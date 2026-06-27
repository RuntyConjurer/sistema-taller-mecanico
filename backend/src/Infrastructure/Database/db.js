const {sequelize}= requiere('sequelize');

const sequelize = new Sequelize('postgresql://postgres.twkvqecbzqjhhlggadua:[j5NF4XzXWUeLbwQR]@aws-1-us-east-2.pooler.supabase.com:6543/postgres'{
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