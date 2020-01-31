const userDAO   = require ('../model/user');
const userSqlz  = userDAO.handle;

const orgDAO    = require ('../model/organization');
const orgSqlz   = orgDAO.handle;

var exports = module.exports = { };


exports.list = (req, res, opts) => {
    // sequelize.sync ();
    return new Promise ((resolve, reject) => {
        userSqlz.findAll().then (resolve).catch (reject);
        // user.list().then (resolve).catch (reject)
    })
}

exports.add = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        orgSqlz.findByPk (1).then ((org) => {
            var usr = userSqlz.build ({
                username: "gufoscuro@gmail.com",
                password: "foobar",
                firstName: "Lorenzo",
                lastName: "Fontana",
                level: 0,
                organization: "Wenking Inc",
                enabled: true,
                passwordReset: "",
                passwordResetDate: null,
                registrationDate: null,
                gitUsername: "seghe",
                gitPassword: "seghe"
            });
            usr.setOrganization (org, { save: false });
            usr.save ().then ((usr) => {
                org.addUser (usr, { save: false });
                org.save ().then (resolve).catch (reject);
            })
        })
    })
}