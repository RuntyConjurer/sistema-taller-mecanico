'use strict';

const { AppError } = require('../errors/AppError');

class BaseRepository {
  constructor(model, options = {}) {
    this.model = model;
    this.branchScoped = options.branchScoped || false;
    this.defaultInclude = options.include || [];
  }

  scope(where, user) {
    if (this.branchScoped && user && !user.roles.includes('ADMINISTRADOR')) return { ...where, sucursalId: user.sucursalId };
    return where;
  }

  async list({ where = {}, user, include = this.defaultInclude, limit = 100, order = [['id', 'DESC']] } = {}) {
    return this.model.findAll({ where: this.scope(where, user), include, limit: Math.min(Number(limit) || 100, 250), order });
  }

  async findById(id, { user, include = this.defaultInclude, transaction } = {}) {
    const record = await this.model.findOne({ where: this.scope({ id }, user), include, transaction });
    if (!record) throw new AppError(404, 'NOT_FOUND', 'No se encontró el registro solicitado.');
    return record;
  }

  create(data, options = {}) { return this.model.create(data, options); }

  async update(id, data, context = {}) {
    const record = await this.findById(id, context);
    return record.update(data, { transaction: context.transaction });
  }
}

module.exports = { BaseRepository };
