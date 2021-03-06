const configParams  = require ('./config');
const PROD          = configParams.PROD;
const PORT          = configParams.PORT;
const express       = require ('express');
const bodyParser    = require ('body-parser');
const cookieParser  = require ('cookie-parser');
const path          = require ('path');
const JWTUtil       = require ('./lib/jwt/jwt');
const app           = express ();
const bootService   = require ('./services/bootstrap-services');
const chalk         = require ('chalk');


app.use (bodyParser.urlencoded ({ extended: false }));
app.use (bodyParser.json ());
app.use (cookieParser ());






const generic_error = (message) => {
    return {
        error: true,
        message: message !== undefined ? message : 'generic error'
    }
}
const action_notfound = (name) => {
    return {
        error: true,
        message: 'Can\'t find the action ['+ name +']'
    }
}
const is_authorized = (action_name, unauth_map, token) => {
    let is_unauth = unauth_map !== undefined && unauth_map[action_name] === true;

    return new Promise ((resolve, reject) => {
        if (is_unauth)
            resolve ({ success: true });
        else if (token && token !== undefined)
            JWTUtil.verify (token).then (resolve);
        else
            resolve ({ success: false });
    })
}
const action_evaulator = (req, res) => {
    var opts = {
            controller: req.params._ctrl,
            action: req.params._act,
            rid: req.params._rid !== undefined ? req.params._rid : null,
            authentication: req.cookies !== undefined ? req.cookies.auth : null
        };

    if (opts.controller && opts.action) {
        let ctrls = require ('./controller/' + opts.controller);
        if (ctrls !== undefined && typeof (ctrls[opts.action]) === 'function') {
            is_authorized (opts.action, ctrls.unauthenticated, opts.authentication).then ((outcome) => {
                if (outcome.success) {
                    opts.user = outcome.data;
                    ctrls[opts.action](req, res, opts).then ((result) => {
                        res.json (result)
                    }).catch ((e, t) => {
                        // console.log ('[Server.js] exception with code', ((e && e.code && typeof (e.code) === 'number') ? e.code : '--- no code'));
                        res.status ((e && e.code && typeof (e.code) === 'number') ? e.code : 500).send (e);
                        if (!PROD)
                            console.log ('\n\n', chalk.redBright ('==> Error'), e);
                    })
                } else
                    res.status (401).json (generic_error ('Unauthorized.')); 
            })
            
        } else 
            res.status(404).json (action_notfound (opts.action));   
    } else
        res.status(500).json (generic_error ());
}



app.get ('/', function (req, res) {
    res.sendFile (path.join (__dirname, 'build', 'index.html'));
});

app.all ('/api/:_ctrl/:_act', action_evaulator);
app.all ('/api/:_ctrl/:_act/:_rid', action_evaulator);



app.use (express.static (path.join (__dirname, 'build')));
app.use ('*', express.static (path.join (__dirname, 'build')));




bootService.serverPreBootstrap ()
    .catch (r => console.log ('\n', chalk.redBright (r.message), '\n'))
    .then (r => {
        if (r && r.message)
            console.log (chalk.greenBright (r.message));

        app.listen (PORT || 3001);
        console.log ('\nServer listening on http://localhost:' + PORT);
    });

