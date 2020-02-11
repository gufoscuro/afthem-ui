const yaml      = require ('js-yaml')



module.exports.toYAML = (json, parse = false) => {
    var json_data = parse ? JSON.parse (json) : json;
    return yaml.safeDump (json_data)
}

module.exports.toJSON = (yml) => {
    return yaml.safeLoad (yml);
}


