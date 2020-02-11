const { DataTypes } = require ('sequelize');
const sequelize     = require ('./db').instance;
const Organization  = require ('./organization').handle;


const User = sequelize.define ('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    passwordReset: {
        type: DataTypes.STRING
    },
    passwordResetDate: {
        type: DataTypes.DATE
    },
    registrationDate: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.NOW
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

User.belongsTo (Organization);
Organization.hasMany (User);


module.exports.handle = User;
module.exports.list = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        resolve ([ ])
    })
}