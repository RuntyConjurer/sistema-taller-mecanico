'use strict';

const bcrypt = require('bcryptjs');
const { AppError } = require('../errors/AppError');
const { validateRequired } = require('../validators');
const { Usuario, Rol, UsuarioRol, sequelize } = require('../infrastructure/models');
const { toApi } = require('../mappers/toApi');

class UserUseCase {
  async list() { return Usuario.findAll({ attributes: { exclude: ['passwordHash'] }, include: [{ model: Rol, as: 'roles', attributes: ['nombre'], through: { attributes: [] } }], order: [['id', 'ASC']] }); }
  async get(id) {
    const user = await Usuario.findByPk(id, { attributes: { exclude: ['passwordHash'] }, include: [{ model: Rol, as: 'roles', attributes: ['nombre'], through: { attributes: [] } }] });
    if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'No se encontró el usuario.');
    return user;
  }
  async create(input) {
    validateRequired(input, ['tipoIdentificacion', 'identificacion', 'nombre', 'email', 'password', 'roles']);
    return sequelize.transaction(async (transaction) => {
      const user = await Usuario.create({ ...input, email: input.email.toLowerCase(), passwordHash: await bcrypt.hash(input.password, 12) }, { transaction });
      const roles = await Rol.findAll({ where: { nombre: input.roles }, transaction });
      if (roles.length !== input.roles.length) throw new AppError(422, 'INVALID_ROLE', 'Uno o más roles no existen.');
      await UsuarioRol.bulkCreate(roles.map((role) => ({ usuarioId: user.id, rolId: role.id })), { transaction });
      return toApi(user);
    });
  }
  async update(id, input) {
    const user = await Usuario.findByPk(id); if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'No se encontró el usuario.');
    const data = Object.fromEntries(Object.entries(input).filter(([key]) => ['nombre', 'email', 'telefono', 'activo', 'sucursalId'].includes(key)));
    if (input.password) data.passwordHash = await bcrypt.hash(input.password, 12);
    await user.update(data); return toApi(user);
  }
}

module.exports = { UserUseCase };
