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
            userDAO.getByUsername (username).then ((user) => {
                if (user) {
                    if (user.authenticate (password)) {
                        var payload = {
                            id: user.id,
                            level: user.level,
                            isAdmin: user.level === 0
                        };

                        JWTUtil.sign (payload).then ((r) => {
                            res.cookie ('auth', r.token);
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
    const token = req.cookies.auth || null;
    return token ? JWTUtil.verify (token) 
        : new Promise ((r, j) => j ({ success: false, error: 'No token provided.' }));
}

exports.logout = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        res.clearCookie ('auth');
        resolve ();
    })
}