const fs    = require ('fs');
const jwt   = require ('jsonwebtoken');

var exports         = module.exports = { },
    sign_options    = {
        issuer: 'Afthem',
        subject: 'some@user.com',
        audience: 'http://afthem.io',
        expiresIn: "90d",
        algorithm: "RS256"
    };

    

const verify_token = (token) => {
    var verify_options  = { ...sign_options },
        publicKEY       = fs.readFileSync ('./lib/jwt/public.key', 'utf8'),
        result          = null;

    verify_options.algorithm = ["RS256"];
    result = jwt.verify (token, publicKEY, verify_options);
    return result.error ? null : result;
}

exports.sign = function (payload) {
    return new Promise ((resolve, reject) => {
        try {
            var privateKEY  = fs.readFileSync ('./lib/jwt/private.key', 'utf8'),
                token       = jwt.sign (payload, privateKEY, sign_options);
                
            resolve ({
                token: token
            })
        } catch (e) {
            resolve ({
                error: true,
                message: e.toString ()
            })
        }
    })
}

exports.verify = function (token) {
    return new Promise ((resolve, reject) => {
        var c = verify_token (token);
        if (c)
            resolve ({ success: true, data: c });
        else 
            resolve ({ success: false, error: c });
    })
}

exports.getUser = function (token) {
    return verify_token (token);
}
