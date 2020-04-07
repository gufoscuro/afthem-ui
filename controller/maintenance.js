const bsservice     = require ('../services/bootstrap-services');
const chalk         = require ('chalk');


module.exports.pullBaseRepository = (req, res, opts) => bsservice.pullDefaultClusterData ();