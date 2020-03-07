const orgDAO    = require ('../model/organization');
const orgSqlz   = orgDAO.handle;

const usrDAO    = require ('../model/user');
const usrSqlz   = usrDAO.handle;
const memSqlz   = usrDAO.membership;



var exports = module.exports = { };


exports.list = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        orgSqlz.findAll().then (resolve).catch (reject);
    })
}

exports.get = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        orgSqlz.findByPk(opts.rid).then (resolve).catch (reject);
    })
}

exports.add = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        const body = req.body;

        if (body.name !== '' && body.description !== '' 
            && body.timezone !== '' && body.registrationDate !== '') {
            var u_data = {
                name: body.name,
                description: body.description,
                timezone: body.timezone,
                registrationDate: body.registrationDate
            }, org;

            if (body.id !== undefined) {
                orgSqlz.update (u_data, { where: { id: body.id } }).then ((usr) => resolve (usr)).catch (err => reject (err))
            } else {
                org = orgSqlz.build (u_data);
                org.save ().then ((usr) => resolve (usr)).catch (err => reject (err))
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
            orgSqlz.destroy ({
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

exports.associatedUsers = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        var search = req.body.search;
        memSqlz.findAll ({
            where: {
                OrganizationId: opts.rid
            },
            limit: 5,
            include: usrSqlz
        }).then ((mem) => {
            let usrs = mem.map (it => it.User);
            if (search)
                resolve (usrs.filter ((it) => {
                    return (
                        it.username.toLowerCase().indexOf (search) !== -1 || 
                        it.firstName.toLowerCase().indexOf (search) !== -1 || 
                        it.lastName.toLowerCase().indexOf (search) !== -1
                    )
                }));
            else
                resolve (usrs);
        })
    })
}

exports.removeMembership = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        var oid = req.body.oid,
            uid = req.body.uid;

        if (oid && uid) {
            memSqlz.destroy ({
                where: {
                    OrganizationId: oid,
                    UserId: uid
                }
            }).then (resolve).catch (reject);
        } else
            reject ({ code: 400, error: true, message: "invalid parameters" });
    })
}

exports.addMembership = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        var oid = req.body.oid,
            uid = req.body.uid;

        if (oid && uid) {
            var mem = memSqlz.build ({
                OrganizationId: oid,
                UserId: uid
            });
            mem.save().then (resolve).catch (reject);
        } else
            reject ({ code: 400, error: true, message: "invalid parameters" });
    })
}