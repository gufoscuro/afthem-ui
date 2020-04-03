var exports = { };


exports.PORT                    = process.env.PORT || 3001
exports.PROD                    = process.env.PROD || false
exports.BASE_REPOSITORY         = process.env.BASE_REPOSITORY || "gino" // "https://github.com/theirish81/afthem-base.git"


exports.DB_HOST                 = process.env.DB_HOST || 'localhost'
exports.DB_NAME                 = process.env.DB_NAME || 'afthem-dashboard'
exports.DB_USER                 = process.env.DB_USER || 'afthem'
exports.DB_PASSWORD             = process.env.DB_PASSWORD || 'foobar'
exports.DB_PORT                 = process.env.DB_PORT || 8889


exports.ADMIN_USERNAME          = process.env.ADMIN_USERNAME || 'johndoe'
exports.ADMIN_PASSWORD          = process.env.ADMIN_PASSWORD || 'foobar'
exports.ADMIN_FIRST_NAME        = process.env.ADMIN_FIRST_NAME || 'John'
exports.ADMIN_LAST_NAME         = process.env.ADMIN_LAST_NAME || 'Doe'
exports.ADMIN_GIT_USERNAME      = process.env.ADMIN_GIT_USERNAME || 'johndoe'
exports.ADMIN_GIT_PASSWORD      = process.env.ADMIN_GIT_PASSWORD || 'foobar'
exports.ORG_NAME                = process.env.ORG_NAME || 'My Organization'
exports.ORG_DESCRIPTION         = process.env.ORG_DESCRIPTION || 'My first organization, an amazing one.'


exports.DEFAULT_DATA_FOLDER     = './default-cluster-data'
exports.DEFAULT_CLUSTER_FOLDER  = exports.DEFAULT_DATA_FOLDER + '/cluster_model'
exports.CLUSTERS_FOLDER         = './clusters-data/'



module.exports = exports;