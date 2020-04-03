const docsService = require ('../services/docs-service');


module.exports.list = (req, res, opts) => docsService.list ();
module.exports.asMap = (req, res, opts) => docsService.asMap ();