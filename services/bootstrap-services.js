const NodeGit       = require ('nodegit');
const fs            = require ('fs');

const sequelize     = require ('../model/db').instance;

const userDAO       = require ('../model/user');
const userSqlz      = userDAO.handle;
const memberSqlz    = userDAO.membership;


const orgDAO        = require ('../model/organization');
const orgSqlz       = orgDAO.handle;


const clusterMRepo  = "https://github.com/theirish81/afthem-base"
const clusterMPath  = "./default-cluster-data"



const init_script = () => {
    return new Promise ((resolve, reject) => {
        sequelize.sync ({ alter: true }).then (() => {
            orgSqlz.build ({
                name: process.env.ORG_NAME || 'My Organization',
                description:  process.env.ORG_DESCRIPTION || 'My first organization, an amazing one.',
                timezone: 'GMT'
            }).save ().then ((org) => {
                userSqlz.build ({
                    username:  process.env.ADMIN_USERNAME || 'johndoe',
                    password:  process.env.ADMIN_PASSWORD || 'foobar',
                    firstName:  process.env.ADMIN_FIRST_NAME || 'John',
                    lastName:  process.env.ADMIN_LAST_NAME || 'Doe',
                    level: 0,
                    enabled: true,
                    gitUsername: process.env.ADMIN_GIT_USERNAME || 'johndoe',
                    gitPassword: process.env.ADMIN_GIT_PASSWORD || 'foobar'
                }).save().then ((usr) => {
                    var m = memberSqlz.build ({
                        UserId: usr.id,
                        OrganizationId: org.id
                    });
                    m.save ().then (resolve).catch (reject);
                })
            })
        })
    })
}

exports.initDB = () => {
    return new Promise ((resolve, reject) => {
        userSqlz.count().then ((result) => {
            if (result === 0) {
                init_script ().then (resolve).catch (reject)
            } else
                resolve ();
        }).catch (() => {
            init_script ().then (resolve).catch (reject)
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