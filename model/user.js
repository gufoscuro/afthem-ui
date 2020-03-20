const crypto        = require ('crypto');

const { DataTypes } = require ('sequelize');
const sequelize     = require ('./db').instance;
const Organization  = require ('./organization').handle;
// const Cluster       = require ('./cluster').handle;


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
        type: DataTypes.DATE,
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
},
{
    defaultScope: {
        attributes: {
            exclude: [ 'password' ]
        }
    },
    scopes: {
        withPassword: {
            attributes: {
                include: [ 'password' ]
            }
        }
    },
    hooks: {
        beforeCreate: (user) => {
            user.password = crypto.createHash('sha256').update(user.password).digest('base64')
        },
        beforeUpdate: (user) => {
            if (user.password)
                user.password = crypto.createHash('sha256').update(user.password).digest('base64')
        }
    } 
});

User.prototype.authenticate = function (password) {
    return this.password === crypto.createHash('sha256').update(password).digest('base64');
};

const Membership = sequelize.define ('Membership', { })

// User.belongsTo (Organization);
// Organization.hasMany (User);

Membership.belongsTo (User);
Membership.belongsTo (Organization);
User.hasMany (Membership);
Organization.hasMany (Membership);


module.exports.getByUsername = (username) => {
    return User.scope('withPassword').findOne ({
        where: {
            username: username
        }
    })
}

module.exports.load = (id) => {
    return new Promise ((resolve, reject) => {
        User.findByPk (id).catch (reject).then ((result) => {
            var usr = {
                username: result.username,
                firstName: result.firstName,
                lastName: result.lastName,
                level: result.level,
                isAdmin: result.level === 0,
                gitUsername: result.gitUsername,
                gitPassword: result.gitPassword
            }
            resolve (usr);
        })
    })
}


module.exports.handle = User;
module.exports.membership = Membership;


