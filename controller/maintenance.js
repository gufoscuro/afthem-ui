const bsservice     = require ('../services/bootstrap-services');
const chalk         = require ('chalk');


module.exports.pullBaseRepository = (req, res, opts) => {
    return bsservice.pullDefaultClusterData()
        .catch (r => console.log ('\n', chalk.redBright (r.message), '\n'))
        .then (r => console.log ('\n', chalk.greenBright (r.message), '\n'))
};