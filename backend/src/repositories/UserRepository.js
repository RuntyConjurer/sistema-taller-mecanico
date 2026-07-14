'use strict';

const models = require('../infrastructure/models');
const { AppError } = require('../errors/AppError');

class UserRepository {
  constructor(db = models) {
    this.db = db;
  }

  list() {
    return this.db.Usuario.findAll({
      attributes: { exclude: ['passwordHash'] },
      include: [{
        model: this.db.Rol,
        as: 'roles',
        attributes: ['nombre'],
        through: { attributes: [] },
      }],
      order: [['id', 'ASC']],
    });
  }

  async find(id, { includePassword = false } = {}) {
    const user = await this.db.Usuario.findByPk(id, {
      attributes: includePassword ? undefined : { exclude: ['passwordHash'] },
      include: includePassword ? [] : [{
        model: this.db.Rol,
        as: 'roles',
        attributes: ['nombre'],
        through: { attributes: [] },
      }],
    });
    if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'No se encontró el usuario.');
    return user;
  }

  transaction(work) {
    return this.db.sequelize.transaction(work);
  }

  async create(data, roleNames, transaction) {
    const user = await this.db.Usuario.create(data, { transaction });
    const roles = await this.db.Rol.findAll({ where: { nombre: roleNames }, transaction });
    if (roles.length !== roleNames.length) throw new AppError(422, 'INVALID_ROLE', 'Uno o más roles no existen.');
    await this.db.UsuarioRol.bulkCreate(
      roles.map((role) => ({ usuarioId: user.id, rolId: role.id })),
      { transaction },
    );
    return user;
  }

  async update(id, data) {
    const user = await this.find(id, { includePassword: true });
    return user.update(data);
  }
}

module.exports = { UserRepository };
