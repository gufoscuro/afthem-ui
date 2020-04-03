const configParams  = require ('../config');
const fs            = require ('fs-extra');
const mdToJson      = require ('../lib/mdToJson');
const jsonToAfthem  = require ('../lib/jsonToAfthem');
const BASE_PATH     = configParams.DEFAULT_DATA_FOLDER;

var exports = module.exports = { };


const actorsList = () => {
    return new Promise ((resolve, reject) => {
        fs.readdir (BASE_PATH + '/docs', { withFileTypes: true }, function (error, files) {
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
                ).catch (reject).then (resolve)
            }
        })
    })
}

const listToMap = (actors_list) => {
    var actors_map = { };
    if (actors_list.length) {
        actors_list.forEach ((cat, i) => {
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
    return actors_map
}


exports.list = (force_parse) => {
    if (force_parse)
        return actorsList ();
    else {
        return new Promise ((resolve, reject) => {
            fs.readFile (BASE_PATH + '/list_cache.json', { encoding: 'utf-8' })
                .catch (reject)
                .then (result => resolve (JSON.parse (result)));
        })
    }
}

exports.asMap = (force_parse) => {
    return new Promise ((resolve, reject) => {
        if (force_parse)
            actorsList().catch (reject).then (list => resolve (listToMap (list)));
        else {
            fs.readFile (BASE_PATH + '/map_cache.json', { encoding: 'utf-8' })
                .catch (reject)
                .then (result => resolve (JSON.parse (result)));
        }
    })
}

exports.createDocsCache = () => {
    return new Promise ((resolve, reject) => {
        actorsList().catch (reject).then (list => {
            Promise.all ([
                fs.writeFile (BASE_PATH + '/list_cache.json', JSON.stringify (list)),
                fs.writeFile (BASE_PATH + '/map_cache.json', JSON.stringify (listToMap (list)))
            ]).catch (reject).then (r => resolve ({ success: true }))
        })
    })
}