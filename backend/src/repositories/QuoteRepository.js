'use strict';

const models = require('../infrastructure/models');
const { AppError } = require('../errors/AppError');

class QuoteRepository {
  constructor(db = models) {
    this.db = db;
  }

  transaction(work) {
    return this.db.sequelize.transaction(work);
  }

  list(user) {
    const where = !user.roles.includes('ADMINISTRADOR') ? { sucursalId: user.sucursalId } : {};
    return this.db.Cotizacion.findAll({
      where,
      include: [{
        model: this.db.CotizacionDetalle,
        as: 'detalles',
        include: [
          { model: this.db.Servicio, as: 'servicio' },
          { model: this.db.Material, as: 'material' },
        ],
      }],
      order: [['id', 'DESC']],
    });
  }

  async find(id, user) {
    const quote = await this.db.Cotizacion.findByPk(id, {
      include: [{
        model: this.db.CotizacionDetalle,
        as: 'detalles',
        include: [
          { model: this.db.Servicio, as: 'servicio' },
          { model: this.db.Material, as: 'material' },
        ],
      }],
    });
    if (!quote) throw new AppError(404, 'QUOTE_NOT_FOUND', 'No se encontró la cotización.');
    if (!user.roles.includes('ADMINISTRADOR') && Number(quote.sucursalId) !== Number(user.sucursalId)) {
      throw new AppError(403, 'BRANCH_FORBIDDEN', 'La cotización pertenece a otra sucursal.');
    }
    return quote;
  }

  findService(id, transaction) {
    return this.db.Servicio.findByPk(id, { transaction });
  }

  findMaterial(id, transaction) {
    return this.db.Material.findByPk(id, { transaction });
  }

  async create(data, details, transaction) {
    const quote = await this.db.Cotizacion.create(data, { transaction });
    await this.db.CotizacionDetalle.bulkCreate(
      details.map((item) => ({ ...item, cotizacionId: quote.id })),
      { transaction },
    );
    return this.db.Cotizacion.findByPk(quote.id, {
      include: [{ model: this.db.CotizacionDetalle, as: 'detalles' }],
      transaction,
    });
  }

  update(quote, data) {
    return quote.update(data);
  }

  updateState(quote, state) {
    return quote.update({ estado: state });
  }
}

module.exports = { QuoteRepository };
