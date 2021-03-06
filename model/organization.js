const { DataTypes } = require ('sequelize');
const sequelize     = require ('./db').instance;
const Cluster       = require ('./cluster').handle;


const Organization = sequelize.define ('Organization', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
    timezone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    registrationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    // Other model options go here
});


Organization.hasMany (Cluster);
Cluster.belongsTo (Organization);



module.exports.handle = Organization;