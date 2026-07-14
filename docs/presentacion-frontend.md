# Guion técnico de presentación SGTRA

## Recorrido de cinco minutos

1. Abrir el sitio público y crear una solicitud de cita con cliente y vehículo nuevos.
2. Entrar como `RECEPCIONISTA`, confirmar la cita y convertirla en OT.
3. Entrar como `TECNICO`, registrar presión baja, presión alta, temperatura y falla.
4. Consumir refrigerante; primero enviar una cantidad excesiva para demostrar `P0004` y luego una válida.
5. Entrar como `CAJERO`, emitir la factura y registrar el pago.
6. Cerrar la OT y mostrar el nuevo evento en el historial del vehículo.
7. Cambiar de sucursal para demostrar el aislamiento operativo.

## Qué explicar mientras se presenta

- React guía al usuario, pero no impone la integridad final.
- El use case abre transacciones en operaciones compuestas.
- El repository concentra Sequelize y evita SQL en controllers.
- PostgreSQL bloquea stock negativo y cierres incompletos mediante triggers.
- Nginx presenta una sola dirección y separa la red pública de la interna.
- Los cuatro roles demuestran permisos distintos con el mismo backend.

## Preguntas frecuentes

**¿Por qué no se usa Redux o TypeScript?**  
El tamaño del proyecto no los necesita. Estado local, servicios de dominio y JavaScript mantienen el código defendible para el equipo.

**¿Qué evita clientes huérfanos al agendar?**  
Cliente, vehículo y cita se crean dentro de una transacción; cualquier error revierte los tres pasos.

**¿Dónde se descuenta el refrigerante?**  
El backend inserta el consumo una sola vez. El trigger bloquea la fila del material, valida el stock, descuenta y registra el movimiento.

**¿Por qué la API usa camelCase si PostgreSQL usa snake_case?**  
Los mappers desacoplan la interfaz del esquema relacional y hacen legible cada lado en su contexto.

**¿El guard de React protege la API?**  
No. Solo mejora navegación. El JWT y los permisos del backend protegen los datos.

**¿Cómo se evita una segunda OT para la misma cita?**  
El use case lo comprueba y un índice único en PostgreSQL actúa como última defensa.

**¿Cómo se demuestra el requisito de menos de tres segundos?**  
Con un smoke test sobre los datos seed. Healthchecks ayudan a recuperar servicios, pero no demuestran matemáticamente el 99% de disponibilidad.

**¿Qué queda fuera?**  
WhatsApp Business y facturación electrónica, marcados como opcionales por el SRS.
