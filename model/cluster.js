const { DataTypes } = require ('sequelize');
const sequelize     = require ('./db').instance;


const Cluster = sequelize.define ('Cluster', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
    gitUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gitUsername: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gitPassword: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
});


module.exports.handle = Cluster;
module.exports.update = () => {
    return new Promise ((resolve, reject) => {
        Cluster.sync ({ force: true }).then (resolve).catch (reject)
    })
}
module.exports.list = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        resolve ([ ])
    })
}