const fs                = require ('fs-extra');
const NodeGit           = require ('nodegit');
const path              = require ('path');

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

module.exports.createClusterFolder = (oid, cid, gitUrl) => {
    return new Promise ((resolve, reject) => {
        var dir_path = base_path + oid + '/' + cid;

        // console.log ('cluster', cdata);
        fs.ensureDir (dir_path).then (() => {
            if (gitUrl) {
                fs.exists (dir_path + '/.git', (exists) => {
                    if (exists) {
                        resolve ();
                    } else {
                        NodeGit.Clone (gitUrl, dir_path).catch (reject).then (() => {
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
                        })
                    }
                })
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

module.exports.gitStatus = (path) => {
    return new Promise ((resolve, reject) => {
        NodeGit.Repository.open (path).catch (reject)
            .then ((repository) => {
                repository.getStatus().then ((statuses) => {
                    var result = { };
                    statuses.forEach ((file) => {
                        var status = 'new';

                        if (file.isModified ())
                            status = 'modified';
                        else if (file.isTypechange ())
                            status = 'typechange';
                        else if (file.isRenamed ())
                            status = 'renamed';
                        else if (file.isIgnored ())
                            status = 'ignored';

                        result[file.path ()] = {
                            path: file.path (),
                            status: status
                        };
                    });

                    resolve (result);
                });
            })
    })
}

module.exports.commitAndPush = (opts) => {
    return new Promise ((resolve, reject) => {
        var repo, 
            index, 
            oid;

        NodeGit.Repository.open (opts.repoPath).catch (reject)
            .then ((repository) => {
                repo = repository
            })
            .then (() => {
                return repo.refreshIndex ();
            })
            .then ((results) => {
                index = results;
            })
            .then (() => {
                return index.addAll ()
            })
            .then (() => {
                return index.write ();
            })
            .then (() => {
                return index.writeTree ();
            })
            .then ((oidResult) => {
                oid = oidResult;
                if (NodeGit.Reference.hasLog (repo, "HEAD"))
                    return new Promise ((rs, rj) => {
                        NodeGit.Reference.nameToId(repo, "HEAD").then ((head) => {
                            repo.getCommit (head).then (rs)
                        })
                    })
                else
                    return new Promise ((rs, rj) => {
                        rs (null)
                    });
            })
            .then ((parent) => {
                var author = NodeGit.Signature.now (opts.authorName, opts.authorUsername),
                    parents = parent ? [ parent ] : [];

                return repo.createCommit ("HEAD", author, author, opts.message, oid, parents);
            })
            .done ((commitId) => {
                // console.log ("committed: ", commitId);
                resolve ({ commit: commitId });
            });
    })
}