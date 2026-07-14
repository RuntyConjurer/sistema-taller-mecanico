'use strict';

const { AppError } = require('../errors/AppError');
const { validateRequired, validateState } = require('../validators');

class ResourceUseCase {
  constructor(repository, config = {}) {
    this.repository = repository;
    this.config = config;
  }

  list(query, user) {
    const where = this.config.listWhere ? this.config.listWhere(query) : {};
    return this.repository.list({ user, limit: query.limit, where });
  }

  get(id, user) {
    return this.repository.findById(id, { user });
  }

  create(input, user) {
    if (this.config.required) validateRequired(input, this.config.required);
    const data = pick(input, this.config.fields);
    if (this.config.branchScoped && !user.roles.includes('ADMINISTRADOR')) data.sucursalId = user.sucursalId;
    return this.repository.create(data);
  }

  update(id, input, user) {
    const data = pick(input, this.config.fields);
    if (!Object.keys(data).length) throw new AppError(422, 'EMPTY_UPDATE', 'No se recibieron campos editables.');
    if (this.config.branchScoped && !user.roles.includes('ADMINISTRADOR')) delete data.sucursalId;
    return this.repository.update(id, data, { user });
  }

  async updateState(id, state, user) {
    validateState(state, this.config.states);
    return this.repository.update(id, { estado: state }, { user });
  }
}

function pick(input, fields = []) {
  return fields.reduce((result, field) => {
    if (input[field] !== undefined) result[field] = input[field];
    return result;
  }, {});
}

module.exports = { ResourceUseCase, pick };
