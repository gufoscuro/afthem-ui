const fs            = require ('fs');
const crypto        = require ('crypto');

const clusterDAO    = require ('../model/cluster');
const clusterSqlz   = clusterDAO.handle;

const orgDAO        = require ('../model/organization');
const orgSqlz       = orgDAO.handle;



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
                code: 401,
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
            gitUrl: req.body.gitUrl,
            gitUsername: req.body.gitUsername,
            gitPassword: req.body.gitPassword
        }

        // console.log (JSON.stringify (config, null, '   '));

        if (opts.rid && config.name && config.gitUrl && config.gitUsername && config.gitPassword) {
            orgSqlz.findByPk (opts.rid).then ((org) => {
                var clstr = clusterSqlz.build (config);
                clstr.setOrganization (org, { save: false });
                clstr.save ().then ((clstr) => {
                    org.addCluster (clstr, { save: false });
                    org.save ().then (resolve.bind (this, clstr)).catch (reject);
                })
            })
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
        if (opts.rid) {
            clusterSqlz.destroy ({
                where: {
                    id: opts.rid
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

module.exports.fileIndex = (req, res, opts) => {
    return new Promise ((resolve, reject) => {
        read_dir_routine('./assets/base').then (resolve).catch (reject);
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
                reject (error);
            else {
                files.forEach (function (it) {
                    if (it.isDirectory () || it.isFile ()) {
                        var splt    = it.name.split ('.'),
                            ext     = splt.length > 1 ? splt[splt.length - 1] : '__',
                            name_ne = it.name.replace (/\.yml/g, '').replace (/\.xml/g, ''),
                            entry   = { };

                        if (it.name !== '.DS_Store') {
                            entry.name = it.name;
                            entry.normalizedName = name_ne;
                            entry.isDir = it.isDirectory ();
                            entry.extension = ext;

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
            })
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

