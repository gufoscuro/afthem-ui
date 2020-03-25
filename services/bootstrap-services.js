const fs            = require ('fs-extra');
const path          = require ('path')
const git           = require ('isomorphic-git')
const http          = require ('isomorphic-git/http/node')
const Spinner       = require ('cli-spinner').Spinner;

const sequelize     = require ('../model/db').instance;

const userDAO       = require ('../model/user');
const userSqlz      = userDAO.handle;
const memberSqlz    = userDAO.membership;


const orgDAO        = require ('../model/organization');
const orgSqlz       = orgDAO.handle;


const clusterMRepo  = process.env.BASE_REPOSITORY || "https://github.com/theirish81/afthem-base.git";
const clusterMPath  = "./default-cluster-data";


const ADMIN_USERNAME        =  process.env.ADMIN_USERNAME || 'johndoe';
const ADMIN_GIT_USERNAME    =  process.env.ADMIN_GIT_USERNAME || 'johndoe';
const ADMIN_GIT_PASSWORD    =  process.env.ADMIN_GIT_PASSWORD || 'foobar';



const init_script = () => {
    return new Promise ((resolve, reject) => {
        sequelize.sync ({ alter: true }).then (() => {
            orgSqlz.build ({
                name: process.env.ORG_NAME || 'My Organization',
                description:  process.env.ORG_DESCRIPTION || 'My first organization, an amazing one.',
                timezone: 'GMT'
            }).save ().then ((org) => {
                userSqlz.build ({
                    username:  ADMIN_USERNAME,
                    password:  process.env.ADMIN_PASSWORD || 'foobar',
                    firstName:  process.env.ADMIN_FIRST_NAME || 'John',
                    lastName:  process.env.ADMIN_LAST_NAME || 'Doe',
                    level: 0,
                    enabled: true,
                    gitUsername: ADMIN_GIT_USERNAME,
                    gitPassword: ADMIN_GIT_PASSWORD
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

const initDB = () => {
    return new Promise ((resolve, reject) => {
        userSqlz.count().then ((result) => {
            if (result === 0) {
                init_script ().then (resolve).catch (reject)
            } else {
                userSqlz.findOne ({
                    where: {
                        level: 0
                    }
                }).then (usr => resolve (usr));
            }
        }).catch (() => {
            init_script ().then (resolve).catch (reject)
        })
    })
}

const fetchDefaultClusterData = (adminUser) => {
    console.log ('clone repo from', clusterMRepo)
    const spinner = new Spinner ();
    spinner.setSpinnerTitle ('Base repository');
    spinner.start ();
    
    return new Promise ((resolve, reject) => {
        var dir = path.join (process.cwd (), clusterMPath);

        fs.exists (clusterMPath + '/.git', (exists) => {
            if (exists) {
                git.pull ({
                    fs,
                    http,
                    dir: clusterMPath,
                    ref: 'master',
                    singleBranch: true,
                    author: {
                        name: ADMIN_USERNAME
                    },
                    onAuth: (url) => {
                        return {
                            username: ADMIN_GIT_USERNAME,
                            password: ADMIN_GIT_PASSWORD
                        }
                    },
                    onAuthSuccess: () => { },
                    onAuthFailure: () => { },
                    onProgress: (event) => { },
                    onMessage: (message) => {
                        spinner.setSpinnerTitle ('Base repository: ' + message)
                    }
                }).then ((payload) => {
                    spinner.stop ();
                    console.log ('\n');
                    resolve ({ success: true, message: 'Base repository successfully updated.' });
                })
                .catch ((error) => {
                    spinner.stop ();
                    reject ({ success: false, message: error.toString(), error: error })
                })
            } else {
                git.clone ({
                    fs, http, dir,
                    url: clusterMRepo,
                    onAuth: (url) => {
                        return {
                            username: ADMIN_GIT_USERNAME,
                            password: ADMIN_GIT_PASSWORD
                        }
                    },
                    onAuthSuccess: () => { },
                    onAuthFailure: () => { },
                    onProgress: (event) => { },
                    onMessage: (message) => {
                        spinner.setSpinnerTitle ('Base repository: ' + message)
                    }
                }).then ((payload) => {
                    spinner.stop ();
                    console.log ('\n');
                    resolve ({ success: true, message: 'Base repository successfully cloned.' })
                })
                .catch ((error) => {
                    spinner.stop ();
                    reject ({ success: false, message: error.toString(), error: error })
                })
            }
        })
    })
}

module.exports.serverPreBootstrap = () => {
    return new Promise ((resolve, reject) => {
        initDB().then (admin => fetchDefaultClusterData (admin).catch (reject).then (resolve))
    })
}