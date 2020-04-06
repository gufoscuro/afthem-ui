const fs            = require ('fs');
const crypto        = require ('crypto');

const sequelize     = require ('../model/db').instance;

const clusterDAO    = require ('../model/cluster');
const clusterSqlz   = clusterDAO.handle;

const orgDAO        = require ('../model/organization');
const orgSqlz       = orgDAO.handle;

const userDAO   = require ('../model/user');
const userSqlz  = userDAO.handle;


const actorsCtrl    = require ('./actors');
const yamlUtils     = require ('../src/libs/js/yaml-json');
const fservice      = require ('../services/fs-service');

const c_base_path   = './clusters-data/';



module.exports.list = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        if (opts.rid)
            clusterSqlz.findAll({
                where: {
                    organizationId: opts.rid
                }
            }).then (resolve).catch (reject);
        else
            reject ({
                code: 400,
                message: "organization id must be specified"
            })
    })
}

module.exports.get = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        clusterSqlz.findByPk(opts.rid).then (resolve).catch (reject);
    })
}

module.exports.add = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        var config = {
            name: req.body.name,
            description: req.body.description,
            gitUrl: req.body.gitUrl
        }

        // console.log (JSON.stringify (config, null, '   '));

        if (opts.rid && config.name && config.gitUrl) {
            if (req.body.id !== undefined) {
                clusterSqlz.findByPk (req.body.id)
                    .then (record => record.update (config))
                        .then (clstr => resolve (clstr)).catch (err => reject (err))
            } else {
                orgSqlz.findByPk (opts.rid).then ((org) => {
                    var clstr = clusterSqlz.build (config);

                    sequelize.transaction().then ((t) => {
                        clstr.setOrganization (org, { save: false });
                        clstr.save ({ transaction: t }).then ((clstr) => {
                            org.addCluster (clstr, { save: false });
                            org.save ({ transaction: t }).then (() => {
                                userDAO.load (opts.user.id).then ((usr) => {
                                    fservice.createClusterFolder (org.id, clstr, usr)
                                        .then (() => t.commit().then (() => resolve (clstr)))
                                        .catch (error => {
                                            fservice.removeClusterFolder (org.id, clstr.id);
                                            t.rollback ().then (() => reject ({ code: 500, error: true, message: error.toString() }));
                                        });
                                }).catch (() => reject ({ code: 500, error: true, message: 'Invalid user' }));
                            }).catch (reject);
                        }).catch (reject);
                    })
                })
            }
        } else {
            reject ({
                code: 400,
                error: true,
                message: "invalid parameters"
            })
        }
    })
}


module.exports.remove = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        var oid = req.body.oid,
            cid = opts.rid;

        if (cid && oid) {
            clusterSqlz.destroy ({
                where: {
                    id: cid
                }
            }).then (() => {
                fservice.removeClusterFolder (oid, cid).then (resolve);
            }).catch (reject);
        } else {
            reject ({
                code: 400,
                error: true,
                message: "invalid parameters"
            })
        }
    })
}

module.exports.gitStatus = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        var oid = req.body.oid ? req.body.oid : req.query.oid,
            cid = req.body.cid ? req.body.cid : req.query.cid,
            dir = c_base_path + oid + '/' + cid;

        fservice.gitStatus (dir).then ((result) => {
            resolve ({ files: result });
        })
    })
}

module.exports.fileIndex = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        var oid = req.body.oid ? req.body.oid : req.query.oid,
            cid = req.body.cid ? req.body.cid : req.query.cid,
            dir = c_base_path + oid + '/' + cid;

        Promise.all ([
            read_dir_routine (dir),
            fservice.gitStatus (dir),
            clusterSqlz.findByPk (cid),
            orgSqlz.findByPk (oid)
        ]).then ((results) => {
            var index       = results[0],
                repo_status = results[1],
                cluster_d   = results[2],
                org_data    = results[3],
                binding     = interpolateFilesWithRepoStatus (dir, index, repo_status);

            resolve ({ files: binding, cluster: cluster_d, organization: org_data });
        }).catch ((e) => {
            // console.log ('error', e)
            reject (e)
        });
    })
}

module.exports.fileData = (req, res, opts) => {
    var bad_request = {
        code: 400,
        error: true,
        message: "invalid parameters"
    };

    return new Promise ((resolve, reject) => {
        if (opts.rid) {
            try {
                var path = decrypt (opts.rid);
                read_file_routine(path).then (resolve).catch (reject);
            } catch (e) {
                reject (bad_request)
            }
        } else
            reject (bad_request)
    })
}

module.exports.saveFile = (req, res, opts) => {
    var bad_request = {
        code: 400,
        error: true,
        message: "invalid parameters"
    };

    return new Promise ((resolve, reject) => {
        if (opts.rid) {
            try {
                var path = decrypt (opts.rid),
                    data = req.body.data;

                if (data)
                    write_file_routine(path, data).then (resolve).catch (reject);
            } catch (e) {
                reject (bad_request)
            }
        } else
            reject (bad_request)
    })
}

module.exports.getImplementers = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        var cid         = req.body.cid,
            oid         = req.body.id,
            filepath    = c_base_path + oid + '/' + cid + '/implementers.yml';
        
        read_file_routine (filepath).then ((result) => {
            var json    = yamlUtils.toJSON (result.data);

            if (json.implementers !== undefined) {
                actorsCtrl.asMap().then ((actors_map) => {
                    let actors_schema = { };
                    json.implementers.map ((it, i) => {
                        return {
                            typeid: it.typeid = it.type + '/' + it.id,
                            class: it.class
                        }
                    }).forEach ((it) => {
                        let data = actors_map[it.class];
                        if (data !== undefined) {
                            actors_schema[it.typeid] = { ...it, ...data };
                        }
                    });
                    resolve (actors_schema)
                })
            } else
                resolve (result);
        }).catch (reject);
    })
}

module.exports.removeFlow = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        var cid         = req.body.cid,
            oid         = req.body.id,
            filename    = req.body.filename,
            file_path   = c_base_path + oid + '/' + cid + '/flows/' + filename + '.yml';

        fs.unlink (file_path, (err) => {
            if (err) {
                resolve ({ success: false });
            } else
                resolve ({ success: true });
        });
        
    })
}

module.exports.createFlow = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        var cid         = req.body.cid,
            oid         = req.body.id,
            filename    = req.body.filename,
            file_path   = c_base_path + oid + '/' + cid + '/flows/' + filename.replace (/\.yml/, '') + '.yml';

        fs.exists (file_path, (exists) => {
            if (exists)
                reject ({
                    code: 409,
                    error: true,
                    message: "This flow already exists."
                })
            else {
                read_file_routine ('./assets/defaultFiles/flow.yml').then ((result) => {
                    write_file_routine (file_path, result.data).then (resolve).catch (reject);
                })
            }
        })
    })
}

module.exports.listFlows = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        var cid         = req.body.cid || req.query.cid,
            oid         = req.body.oid || req.query.oid,
            dir_path    = c_base_path + oid + '/' + cid + '/flows/';

        read_dir_routine (dir_path).catch (reject).then (result => {
            resolve (
                result.files.filter (it => it.name.indexOf ('.yml') !== -1).map (it => it.name.substring (0, it.name.indexOf ('.yml')))
            )
        })
    })
}

module.exports.commit = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        var cid = req.body.cid,
            oid = req.body.id,
            mex = req.body.message,
            dir = c_base_path + oid + '/' + cid;

        userDAO.load (opts.user.id).then ((usr) => {
            fservice.commitAndPush ({
                repoPath: dir,
                authorName: usr.firstName + ' ' + usr.lastName,
                authorUsername: usr.gitUsername,
                authorPassword: usr.gitPassword,
                message: mex !== '' ? mex : 'commit changes @ ' + new Date().toLocaleString()
            }).then (resolve).catch (reject)
        })
    })
}




const encrypt = (data) => {
    var cipher      = crypto.createCipher ('aes192', 'ahlkajsh!3da'),
        encrypted   = cipher.update (data, 'utf8', 'hex');

    return encrypted + cipher.final ('hex');
}

const decrypt = (data) => {
    var decipher    = crypto.createDecipher ('aes192', 'ahlkajsh!3da'),
        decrypted   = decipher.update (data, 'hex', 'utf8');
        
    return decrypted + decipher.final ('utf8');
}

const read_dir_routine = (path) => {
    return new Promise ((resolve, reject) => {
        var dir_data = {
                path: path,
                files: []
            },
            dir_obj_index   = { },
            dir_promises    = [ ];

        fs.readdir (path, { withFileTypes: true }, function (error, files) {
            if (error)
                reject ({ message: error.toString (), code: 500 });
            else {
                files.forEach (function (it) {
                    if (it.isDirectory () || it.isFile ()) {
                        var splt    = it.name.split ('.'),
                            ext     = splt.length > 1 ? splt[splt.length - 1] : '__',
                            name_ne = it.name.replace (/\.yml/g, '').replace (/\.xml/g, ''),
                            entry   = { };

                        if (it.name !== '.DS_Store' && it.name.indexOf ('.') !== 0) {
                            entry.name = it.name;
                            entry.normalizedName = name_ne;
                            entry.isDir = it.isDirectory ();
                            entry.extension = ext;
                            entry.path = path + '/' + it.name;

                            if (!it.isDirectory ())
                                entry.id = encrypt (path + '/' + it.name);

                            dir_data.files.push (entry);

                            if (it.isDirectory ()) {
                                var dir_path = path + '/' + it.name;
                                dir_obj_index[dir_path] = entry;
                                dir_promises.push (read_dir_routine (dir_path));
                            }
                        }
                    }
                });
            }
            
            Promise.all (dir_promises).then ((results) => {
                results.forEach ((dir_res) => {
                    if (dir_obj_index[dir_res.path] !== undefined)
                        dir_obj_index[dir_res.path].files = dir_res.files;
                });

                resolve (dir_data);
            }).catch (reject)
        })
    });
}

function read_file_routine (path) {
    return new Promise ((resolve, reject) => {
        fs.readFile (path, { encoding: 'utf-8' }, function (error, data) {
            if (error)
                reject ({ error: error });
            else
                resolve ({ path: path, data: data });
        });
    })
}

function write_file_routine (path, data) {
    return new Promise ((resolve, reject) => {
        fs.writeFile (path, data, (error) => {
            if (error)
                reject ({ error: error });
            else
                resolve ();
        });
    })
}

const interpolateFilesWithRepoStatus = (dir, index, repo_map) => {
    return index.files.map ((it, index) => {
        var path    = it.path.replace (dir + '/', ''),
            match   = repo_map[path];

        it.path = path;
        if (it.isDir) {
            it.files = interpolateFilesWithRepoStatus (dir, it, repo_map);
        } else if (match !== undefined) {
            it.repo = match;
        }

        return it;
    })
}