'use strict';

const bcrypt = require('bcryptjs');
const { AppError } = require('../errors/AppError');
const { validateRequired } = require('../validators');

class AuthUseCase {
  constructor(repository, jwtService) { this.repository = repository; this.jwtService = jwtService; }

  async login(input) {
    validateRequired(input, ['email', 'password']);
    const record = await this.repository.findByEmail(input.email);
    const valid = record && await bcrypt.compare(input.password, record.passwordHash);
    if (!valid) throw new AppError(401, 'INVALID_CREDENTIALS', 'Correo o contraseña incorrectos.');
    const user = { id: Number(record.id), nombre: record.nombre, email: record.email, sucursalId: record.sucursalId ? Number(record.sucursalId) : null, roles: record.roles.map((role) => role.nombre) };
    return { token: this.jwtService.sign(user), usuario: user, expiresIn: '8h' };
  }
}

module.exports = { AuthUseCase };
