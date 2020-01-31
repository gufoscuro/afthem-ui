const orgDAO   = require ('../model/organization');
const orgSqlz  = orgDAO.handle;

var exports = module.exports = { };


exports.list = (req, res, opts) => {
    // sequelize.sync ();
    return new Promise ((resolve, reject) => {
        orgSqlz.findAll().then (resolve).catch (reject);
        // user.list().then (resolve).catch (reject)
    })
}

exports.get = (req, res, opts) => {
    // sequelize.sync ();
    return new Promise ((resolve, reject) => {
        orgSqlz.findByPk(opts.rid).then (resolve).catch (reject);
    })
}

exports.add = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        orgSqlz.create ({
            name: "Wenking INC",
            description: "wenking",
            timezone: "",
            registrationDate: null
        }).then (resolve).catch (reject);
    })
}