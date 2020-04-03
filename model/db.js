const configParams  = require ('../config');
const dbhost        = configParams.DB_HOST
const dbname        = configParams.DB_NAME
const dbuser        = configParams.DB_USER
const dbpassw       = configParams.DB_PASSWORD
const dbport        = configParams.DB_PORT


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