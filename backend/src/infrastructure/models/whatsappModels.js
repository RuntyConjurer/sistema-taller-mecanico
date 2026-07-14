'use strict';

const { DataTypes, modelOptions, id, fk } = require('./modelHelpers');

function defineWhatsAppModels(sequelize) {
  const WhatsAppMessage = sequelize.define('WhatsAppMessage', {
    id: id('id_whatsapp_mensaje'), clienteId: fk('id_cliente'), citaId: fk('id_cita'), usuarioId: fk('id_usuario'),
    wamid: DataTypes.STRING(255), telefonoDestino: { type: DataTypes.STRING(20), field: 'telefono_destino' },
    direccion: DataTypes.STRING(10), tipo: DataTypes.STRING(30), plantilla: DataTypes.STRING(150), idioma: DataTypes.STRING(15),
    contenido: DataTypes.TEXT, estado: DataTypes.STRING(20), errorCodigo: { type: DataTypes.STRING(80), field: 'error_codigo' },
    errorMensaje: { type: DataTypes.TEXT, field: 'error_mensaje' }, fechaEvento: { type: DataTypes.DATE, field: 'fecha_evento' },
    creadoEn: { type: DataTypes.DATE, field: 'creado_en' }, actualizadoEn: { type: DataTypes.DATE, field: 'actualizado_en' },
  }, modelOptions(sequelize, 'whatsapp_mensajes'));

  return { WhatsAppMessage };
}

module.exports = { defineWhatsAppModels };
