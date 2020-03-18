var exports         = module.exports = { };

const userDAO   = require ('../model/user');
const userSqlz  = userDAO.handle;
const JWTUtil   = require ('../lib/jwt/jwt');
const crypto    = require ('crypto');



exports.unauthenticated = {
    auth: true,
    check: true
}

exports.auth = function (req, res, opts) {
    return new Promise ((resolve, reject) => {
        var username = req.body.username,
            password = req.body.password;

        if (username !== undefined) {
            userDAO.getByUsername (username).then ((result) => {
                if (result) {
                    var valid   = username === result.username && password === result.password,
                        payload = {
                            id: result.id,
                            level: result.level,
                            isAdmin: result.level === 0
                        };

                        if (valid) {
                            JWTUtil.sign (payload).then ((r) => {
                                res.cookie ('auth', r.token);
                                // console.log (r);
                                resolve (r);
                            }).catch (reject);
                        } else
                            resolve ({ authenticated: false });
                } else 
                    resolve ({ authenticated: false });
            }).catch (resolve)
        }
    })
};

exports.check = function (req) {
    var token = req.cookies.auth;
    return JWTUtil.verify (token);
}