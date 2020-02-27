const fs            = require ('fs');
const mdToJson      = require ('../lib/mdToJson');
const jsonToAfthem  = require ('../lib/jsonToAfthem');

var exports = module.exports = { };


exports.list = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        fs.readFile ('./test_actors.md', 'utf-8', (err, data) => {
            if (err)
                reject (err);

            mdToJson.parse (data).catch (reject).then ((jsontree) => {
                jsonToAfthem.parse (jsontree).then (resolve).catch (reject);
            });
        })
    })
}

exports.asMap = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        exports.list().then ((json) => {
            var actors_map = { };
            if (json.children !== undefined) {
                json.children.forEach ((category, index) => {
                    if (category.children !== undefined) {
                        category.children.forEach ((actor, ii) => {
                            actors_map[actor.class] = actor;
                        })
                    }
                })
            }
            resolve (actors_map)
        })
    })
}