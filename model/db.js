const dbhost    = 'localhost'
const dbname    = 'afthem-dashboard'
const dbuser    = 'afthem'
const dbpassw   = 'foobar'
const dbport    = 8889


const { Sequelize } = require ('sequelize');



const sequelize = new Sequelize (dbname, dbuser, dbpassw, {
    host: dbhost,
    port: dbport,
    dialect: 'mariadb',
    logging: false
});


sequelize.authenticate().then (() => {
    console.log ('DB authenticated')
}).catch ((error) => {
    console.error ('DB authentication error', error);
});



module.exports.instance = sequelize;