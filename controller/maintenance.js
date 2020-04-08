const bsservice     = require ('../services/bootstrap-services');


module.exports.pullBaseRepository = (req, res, opts) => bsservice.pullDefaultClusterData ();