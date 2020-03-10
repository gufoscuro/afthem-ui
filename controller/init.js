const NodeGit       = require ('nodegit');
const fs            = require ('fs');

const userDAO       = require ('../model/user');
const userSqlz      = userDAO.handle;

const orgDAO        = require ('../model/organization');
const orgSqlz       = orgDAO.handle;


const clusterMRepo  = "https://github.com/theirish81/afthem-base"
const clusterMPath  = "./default-cluster-data"


exports.initDB = () => {
    return new Promise ((resolve, reject) => {
        userSqlz.count().then ((result) => {
            if (result === 0)
                userDAO.initDB ().then (resolve).catch (reject)
            else
                resolve ();
        }).catch (() => {
            userDAO.initDB ().then (resolve).catch (reject)
        })
    })
}

module.exports.fetchDefaultClusterData = () => {
    return new Promise ((resolve, reject) => {
        fs.exists (clusterMPath + '/.git', (exists) => {
            if (exists) {
                console.log ('Default cluster data found. Searching for updates...');
                NodeGit.Repository.open (clusterMPath)
                    .catch (err => reject ({ success: false, message: 'Pull error –', error: err }))
                    .then ((repository) => {
                        return repository.fetchAll()
                            .catch (err => reject ({ success: false, message: 'Pull error –', error: err }))
                            .then (d => repository.mergeBranches ("master", "origin/master"))
                            .done (hash => resolve ({ success: true, message: 'Repository updated.' }));
                    });
            } else {
                console.log ('Fetching default cluster data from github ...');
                NodeGit.Clone (clusterMRepo, clusterMPath)
                    .then (rep => resolve ({ success: true, message: 'Respository successfully cloned.' }))
                    .catch (err => reject ({ success: false, message: 'Clone error –', error: err }))
            }
        })
    })
}