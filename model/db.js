const dbhost    = process.env.DB_HOST || 'localhost'
const dbname    = process.env.DB_NAME || 'afthem-dashboard'
const dbuser    = process.env.DB_USER || 'afthem'
const dbpassw   = process.env.DB_PASSWORD || 'foobar'
const dbport    = process.env.DB_PORT || 8889


const { Sequelize } = require ('sequelize');



const sequelize = new Sequelize (dbname, dbuser, dbpassw, {
    host: dbhost,
    port: dbport,
    dialect: 'mariadb',
    logging: false,
    dialectOptions: {
        timezone: "Etc/GMT+1"
    }
});


sequelize.authenticate().then (() => {
    console.log ('DB authentication: success')
}).catch ((error) => {
    console.error ('DB authentication: failed', error);
});



module.exports.instance = sequelize;