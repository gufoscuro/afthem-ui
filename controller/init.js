const userDAO   = require ('../model/user');
const userSqlz  = userDAO.handle;

const orgDAO    = require ('../model/organization');
const orgSqlz   = orgDAO.handle;


exports.initDB = () => {
    return new Promise ((resolve, reject) => {
        userSqlz.count().then ((result) => {
            if (result === 0)
                userDAO.initDB ().then (resolve);
            else
                resolve ();
        }).catch (() => {
            userDAO.initDB ().then (resolve)
        })
    })
}