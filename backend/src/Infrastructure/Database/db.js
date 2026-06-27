requiere ('dotenv').config();
const {sequelize}= requiere('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            requiere: true,
            rejectUnauthorized: false
        }
    },
    logging: false
})

module.exports = sequelize;