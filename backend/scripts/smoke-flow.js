'use strict';

const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3100/api/v1';
const timings = [];

async function request(path, { method = 'GET', token, body } = {}) {
  const startedAt = Date.now();
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json();
  timings.push({ path, milliseconds: Date.now() - startedAt });
  if (!response.ok) {
    const error = new Error(payload.error?.message || `HTTP ${response.status}`);
    error.code = payload.error?.code;
    error.status = response.status;
    throw error;
  }
  return payload.data;
}

async function login(email) {
  return request('/sesiones', { method: 'POST', body: { email, password: 'password123' } });
}

async function run() {
  const suffix = String(Date.now()).slice(-10);
  const [service] = await request('/servicios');
  const reception = await login('recepcion@sgtra.demo');
  const branches = await request('/sucursales');
  const branch = branches.find((item) => Number(item.id) === Number(reception.usuario.sucursalId));
  if (!branch) throw new Error('La sucursal del usuario de recepción no está disponible.');
  const booking = await request('/solicitudes-cita', {
    method: 'POST',
    body: {
      cliente: {
        tipoCliente: 'PERSONA',
        tipoIdentificacion: 'CEDULA',
        identificacion: `INT-${suffix}`,
        nombre: 'Cliente de integración',
        telefono: '809-555-0199',
        email: `integracion.${suffix}@sgtra.demo`,
      },
      vehiculo: {
        chasis: `SGTRA-${suffix}`,
        marca: 'Toyota',
        modelo: 'Corolla',
        placa: `I${suffix.slice(-6)}`,
        anio: 2020,
      },
      cita: {
        sucursalId: branch.id,
        servicioId: service.id,
        fechaCita: new Date(Date.now() + 3 * 86400000).toISOString(),
        motivo: 'Validación integral de refrigeración',
      },
    },
  });

  const order = await request(`/citas/${booking.cita.id}/orden`, {
    method: 'POST', token: reception.token, body: {},
  });

  const technician = await login('tecnico@sgtra.demo');
  await request(`/ordenes-trabajo/${order.id}/diagnostico`, {
    method: 'PUT',
    token: technician.token,
    body: {
      presionBaja: 25,
      presionAlta: 150,
      temperatura: 18,
      fallaDetectada: 'Presión fuera de rango',
      observaciones: 'Recorrido automatizado de integración',
    },
  });

  let closeBlock;
  try {
    await request(`/ordenes-trabajo/${order.id}/cerrar`, {
      method: 'POST', token: technician.token, body: {},
    });
  } catch (error) {
    closeBlock = error.code;
  }
  if (closeBlock !== 'WORK_ORDER_PAYMENT_REQUIRED') {
    throw new Error(`El cierre incompleto devolvió ${closeBlock || 'éxito inesperado'}.`);
  }

  await request(`/ordenes-trabajo/${order.id}/servicios`, {
    method: 'POST', token: technician.token, body: { servicioId: service.id, cantidad: 1 },
  });
  const [refrigerant] = await request('/refrigerantes', { token: technician.token });
  await request(`/ordenes-trabajo/${order.id}/materiales`, {
    method: 'POST', token: technician.token, body: { materialId: refrigerant.id, cantidad: 1 },
  });

  const cashier = await login('caja@sgtra.demo');
  const invoice = await request('/facturas', {
    method: 'POST', token: cashier.token, body: { ordenTrabajoId: order.id },
  });
  await request(`/facturas/${invoice.id}/pagos`, {
    method: 'POST',
    token: cashier.token,
    body: { monto: invoice.total, formaPago: 'EFECTIVO', referencia: `SMOKE-${suffix}` },
  });
  const closedOrder = await request(`/ordenes-trabajo/${order.id}/cerrar`, {
    method: 'POST',
    token: technician.token,
    body: {
      descripcion: 'Sistema de refrigeración validado',
      recomendaciones: 'Revisión preventiva en seis meses',
    },
  });
  const history = await request(`/vehiculos/${booking.vehiculo.id}/historial`, { token: technician.token });
  const slowest = timings.reduce((current, item) => (item.milliseconds > current.milliseconds ? item : current));

  console.log(JSON.stringify({
    appointmentId: booking.cita.id,
    workOrderId: order.id,
    invoiceId: invoice.id,
    finalState: closedOrder.estado,
    historyEntries: history.length,
    closeBlock,
    slowestRequest: slowest,
  }, null, 2));
}

run().catch((error) => {
  console.error(`Smoke test fallido: ${error.message}`);
  process.exitCode = 1;
});
