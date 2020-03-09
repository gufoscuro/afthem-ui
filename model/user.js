const { DataTypes } = require ('sequelize');
const sequelize     = require ('./db').instance;
const Organization  = require ('./organization').handle;

const Cluster       = require ('./cluster').handle;


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
}, {
    // Other model options go here
});

const Membership = sequelize.define ('Membership', { })

// User.belongsTo (Organization);
// Organization.hasMany (User);

Membership.belongsTo (User);
Membership.belongsTo (Organization);
User.hasMany (Membership);
Organization.hasMany (Membership);



module.exports.handle = User;
module.exports.membership = Membership;

module.exports.initDB = () => {
    return new Promise ((resolve, reject) => {
        sequelize.sync ({ alter: true }).then (() => {
            Organization.build ({
                name: process.env.ORG_NAME || 'My Organization',
                description:  process.env.ORG_DESCRIPTION || 'My first organization, an amazing one.',
                timezone: 'GMT'
            }).save ().then ((org) => {
                User.build ({
                    username:  process.env.ADMIN_USERNAME || 'johndoe',
                    password:  process.env.ADMIN_PASSWORD || 'foobar',
                    firstName:  process.env.ADMIN_FIRST_NAME || 'John',
                    lastName:  process.env.ADMIN_LAST_NAME || 'Doe',
                    level: 0,
                    enabled: true,
                    gitUsername: process.env.ADMIN_GIT_USERNAME || 'johndoe',
                    gitPassword: process.env.ADMIN_GIT_PASSWORD || 'foobar'
                }).save().then ((usr) => {
                    // console.log ('\n\n\n ===> User then () \n\n\n\n');
                    var m = Membership.build ({
                        UserId: usr.id,
                        OrganizationId: org.id
                    });
                    m.save ().then (resolve)
                })
            })
        })
    })
}