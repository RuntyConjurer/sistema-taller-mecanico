'use strict';

const bcrypt = require('bcryptjs');
const { validateRequired } = require('../validators');

class UserUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  list() {
    return this.repository.list();
  }

  get(id) {
    return this.repository.find(id);
  }

  async create(input) {
    validateRequired(input, ['tipoIdentificacion', 'identificacion', 'nombre', 'email', 'password', 'roles']);
    const { password, roles, ...fields } = input;
    return this.repository.transaction(async (transaction) => this.repository.create({
      ...fields,
      email: input.email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
    }, roles, transaction));
  }

  async update(id, input) {
    const data = Object.fromEntries(
      Object.entries(input).filter(([key]) => ['nombre', 'email', 'telefono', 'activo', 'sucursalId'].includes(key)),
    );
    if (input.password) data.passwordHash = await bcrypt.hash(input.password, 12);
    return this.repository.update(id, data);
  }
}

module.exports = { UserUseCase };
