const fs                = require ('fs-extra');
const path              = require ('path')
const git               = require ('isomorphic-git')
const http              = require ('isomorphic-git/http/node')

const def_cdata_path    = './default-cluster-data/cluster_model'
const base_path         = './clusters-data/'



module.exports.createOrganizationFolder = (id) => {
    return new Promise ((resolve, reject) => {
        var dir_path = base_path + id;
        fs.ensureDir (dir_path).then (resolve).catch (err => reject (err));
    })
}

module.exports.removeOrganizationFolder = (id) => {
    return new Promise ((resolve, reject) => {
        var dir_path = base_path + id;
        fs.remove (dir_path).then (resolve).catch (resolve);
    })
}

module.exports.createClusterFolder = (oid, cluster, user) => {
    return new Promise ((resolve, reject) => {
        var cid         = cluster.id,
            gitUrl      = cluster.gitUrl,
            gitUsername = user.gitUsername,
            gitPassword = user.gitPassword,
            dir_path    = base_path + oid + '/' + cid,
            dir         = path.join (process.cwd (), dir_path);
            

        fs.ensureDir (dir_path).then (() => {
            if (gitUrl) {
                fs.remove (dir_path + '/.git')
                    .then (() => {
                        git.clone ({
                            fs, http, dir,
                            url: gitUrl,
                            onAuth: (url) => {
                                return {
                                    username: gitUsername,
                                    password: gitPassword
                                }
                            },
                            onAuthSuccess: () => { },
                            onAuthFailure: (e) => { },
                            onProgress: (event) => { },
                            onMessage: (message) => { }
                        }).then ((payload) => {
                            var hasFiles = false;
                            fs.readdir (dir_path, (err, info) => {
                                info.forEach ((it) => {
                                    if (it.indexOf ('.') > 0)
                                        hasFiles = true;
                                });
    
                                if (hasFiles) {
                                    resolve ({ success: true, message: 'The repository you specified appears to be not empty.' });
                                } else {
                                    fs.copy (def_cdata_path, dir_path).catch (reject).then (() => {
                                        resolve ({ success: true });
                                    })
                                }
                            });
                        }).catch ((error) => {
                            reject (error);
                        })
                    })
                    .catch (reject);
            } else 
                reject ({ message: 'Invalid git parameters' });
        }).catch (err => reject (err));
    })
}

module.exports.removeClusterFolder = (oid, cid) => {
    return new Promise ((resolve, reject) => {
        var dir_path = base_path + oid + '/' + cid;
        fs.remove (dir_path).then (resolve).catch (resolve);
    })
}

module.exports.gitStatus = (dir_path) => {
    return new Promise ((resolve, reject) => {
        var dir     = path.join (process.cwd (), dir_path),
            results = { };
        git.statusMatrix ({
            fs,
            dir: dir
        }).then ((result) => {
            result.forEach ((it) => {
                var filepath    = it[0],
                    headSts     = it[1],
                    workdirSts  = it[2],
                    stageSts    = it[3],
                    isNew       = headSts === 0 && workdirSts > headSts,
                    isModified  = headSts === 1 && workdirSts > headSts,
                    isStaged    = workdirSts == stageSts,
                    status      = 'unmodified';

                // console.log (filepath, headSts, workdirSts, stageSts)
                if (isNew)
                    status = 'new';
                else if (isModified)
                    status = 'modified';

                results[filepath] = {
                    path: filepath,
                    status: status,
                    staged: isStaged,
                    values: it
                }
            })
            resolve (results)
        })
    })
}

module.exports.commitAndPush = (opts) => {
    return new Promise ((resolve, reject) => {
        var dir = path.join (process.cwd (), opts.repoPath);
        git.statusMatrix ({ fs, dir: dir }).then (files => {
            // f[1] === 0 && f[2] === 2 && f[3] === 0
            Promise.all (
                files.filter ((f) => { return (f[2] > f[3]) })
                    .map ((f) => git.add ({ fs, dir: dir, filepath: f[0] }))
            ).then ((r) => {
                git.commit ({
                    fs,
                    dir: dir,
                    author: {
                        name: opts.authorName,
                        email: '',
                    },
                    message: opts.message
                }).then (result => resolve ({ success: true })).catch (reject)
            }).catch (e => reject (e));
        })
    })
}