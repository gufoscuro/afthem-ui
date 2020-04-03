const configParams  = require ('../config');
const fs            = require ('fs');
const mdToJson      = require ('../lib/mdToJson');
const jsonToAfthem  = require ('../lib/jsonToAfthem');

var exports = module.exports = { };


// exports.list = (req, res, opts) => {
//     return new Promise ((resolve, reject) => {
//         fs.readFile (configParams.DEFAULT_DATA_FOLDER + '/docs/redis.md', 'utf-8', (err, data) => {
//             if (err)
//                 reject (err);

//             mdToJson.parse (data).catch (reject).then ((jsontree) => {
//                 jsonToAfthem.parse (jsontree).then (resolve).catch (reject);
//             });
//         })
//     })
// }

exports.list = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        fs.readdir (configParams.DEFAULT_DATA_FOLDER + '/docs', { withFileTypes: true }, function (error, files) {
            if (error)
                reject ({ message: error.toString (), code: 500 });
            else {
                Promise.all (
                    files.map ((it) => {
                        return new Promise ((r, j) => {
                            fs.readFile (configParams.DEFAULT_DATA_FOLDER + '/docs/' + it.name, 'utf-8', (err, data) => {
                                if (err)
                                    j (err);
        
                                mdToJson.parse (data)
                                    .catch (reject)
                                    .then (jsontree => jsonToAfthem.parse (jsontree).then (r).catch (j));
                            })
                        })
                    })
                ).catch (reject).then (results => {
                    resolve (results)
                })
            }
        })
    })
}

exports.asMap = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        exports.list().then ((json) => {
            var actors_map = { };
            if (json.length) {
                json.forEach ((cat, i) => {
                    if (cat.children !== undefined) {
                        cat.children.forEach ((category, index) => {
                            if (category.children !== undefined) {
                                category.children.forEach ((actor, ii) => {
                                    actors_map[actor.class] = actor;
                                })
                            }
                        })
                    }
                })
            }
            resolve (actors_map)
        })
    })
}