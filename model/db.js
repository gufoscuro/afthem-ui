const { Sequelize } = require ('sequelize');


const sequelize = new Sequelize ('afthem-dashboard', 'afthem', 'foobar', {
    host: 'localhost',
    port: 8889,
    dialect: 'mariadb'
});


sequelize.authenticate().then (() => {
    console.log ('DB authenticated')
}).catch ((error) => {
    console.log ('DB error', error)
})


module.exports.instance = sequelize;