const userDAO   = require ('../model/user');
const userSqlz  = userDAO.handle;

const orgDAO    = require ('../model/organization');
const orgSqlz   = orgDAO.handle;

const { Op } = require ("sequelize");

var exports = module.exports = { };


exports.list = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        var search = req.body && req.body.search;
        
        if (search) {
            userSqlz.findAll ({
                where: {
                    [Op.or]: [
                        {
                            username: {
                                [Op.like]: search + '%'
                            }
                        },
                        {
                            firstName: {
                                [Op.like]: search + '%'
                            }
                        },
                        {
                            lastName: {
                                [Op.like]: search + '%'
                            }
                        }
                    ]
                },
                limit: 5
            }).then (resolve).catch (reject);
        } else
            userSqlz.findAll().then (resolve).catch (reject);
    })
}

exports.get = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        userSqlz.findByPk(opts.rid).then (resolve).catch (reject);
    })
}

exports.load = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        userSqlz.findByPk(opts.user.id).then (resolve).catch (reject);
    })
}

exports.add = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        const body = req.body;

        if (body.username !== '' && body.password !== '' 
            && body.firstName !== '' && body.lastName !== '' 
            && body.level !== '' && body.organization !== '' 
            && body.gitUsername !== '' && body.gitPassword !== '') {
            var u_data = {
                username: body.username,
                password: body.password,
                firstName: body.firstName,
                lastName: body.lastName,
                level: body.level,
                organization: body.organization,
                enabled: body.enabled,
                passwordReset: "",
                passwordResetDate: null,
                registrationDate: null,
                gitUsername: body.gitUsername,
                gitPassword: body.gitPassword
            }, usr;

            if (body.id !== undefined) {
                userSqlz.findByPk (body.id).then (record => record.update (u_data)).then (usr => resolve (usr)).catch (err => reject (err))
                // userSqlz.update (u_data, { where: { id: body.id } }).then ((usr) => resolve (usr)).catch (err => reject (err))
            } else {
                usr = userSqlz.build (u_data);
                usr.save ().then ((usr) => resolve (usr)).catch (err => reject (err))
            }
        } else 
            reject ({
                message: 'invalid parameters'
            });
    })
}

exports.remove = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        if (req.body.id) {
            userSqlz.destroy ({
                where: {
                    id: req.body.id
                }
            }).then (resolve).catch (reject);
        } else {
            reject ({
                code: 400,
                error: true,
                message: "invalid parameters"
            })
        }
    })
}