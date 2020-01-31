var exports         = module.exports = { };

const users     = require ('../model/users');
const utils     = require ('../lib/utils');
const JWTUtil   = require ('../jwt/jwt');



exports.unauthenticated = {
    auth: true,
    check: true
}

exports.auth = function (req) {
    return new Promise ((resolve, reject) => {
        var username = req.body.username,
            password = req.body.password;

        if (username !== undefined) {
            users.getByUsername (username).then ((result) => {
                if (result.length) {
                    var item    = result[0],
                        valid   = username === item.username && password === item.password,
                        payload = { ...item };

                        if (valid) {
                            delete payload.password;
                            JWTUtil.sign (payload).then (resolve).catch (reject);
                        } else
                            resolve ({ authenticated: false });
                } else 
                    resolve ({ authenticated: false });
            }).catch (resolve)
        }
    })
};

exports.check = function (req) {
    var token = req.headers.authentication;
    return JWTUtil.verify (token);
}