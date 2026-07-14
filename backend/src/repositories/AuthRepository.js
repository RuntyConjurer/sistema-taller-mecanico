'use strict';

const { Usuario, Rol } = require('../infrastructure/models');

class AuthRepository {
  findByEmail(email) {
    return Usuario.findOne({ where: { email: String(email).toLowerCase(), activo: true }, include: [{ model: Rol, as: 'roles', attributes: ['nombre'], through: { attributes: [] } }] });
  }
}

module.exports = { AuthRepository };
