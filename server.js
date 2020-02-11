const express       = require ('express');
const bodyParser    = require ('body-parser');
const path          = require ('path');
const app           = express ();


app.use (bodyParser.urlencoded ({ extended: false }));
app.use (bodyParser.json ());
app.use (express.static (path.join (__dirname, 'build')));





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
const is_authorized = (action_name, unauth_map) => {
    let is_unauth = unauth_map !== undefined && unauth_map[action_name] === true;

    return new Promise ((resolve, reject) => {
        resolve (true); // while in development ...
    })
}
const action_evaulator = (req, res) => {
    var opts = {
            controller: req.params._ctrl,
            action: req.params._act,
            rid: req.params._rid !== undefined ? req.params._rid : null
        };

    if (opts.controller && opts.action) {
        let ctrls = require ('./controller/' + opts.controller);
        if (ctrls !== undefined && typeof (ctrls[opts.action]) === 'function') {
            is_authorized (opts.action, ctrls.unauthenticated, opts.authentication).then ((valid) => {
                if (valid) {
                    ctrls[opts.action](req, res, opts).then ((result) => {
                        res.json (result)
                    }).catch ((e, t) => {
                        res.status(e.code ? e.code : 500).send (e)
                        throw e;
                    })
                } else 
                    res.status (401).json (generic_error ('Unauthorized.')); 
            })
            
        } else 
            res.status(404).json (action_notfound (opts.action));   
    } else
        res.status(500).json (generic_error ());
}




app.all ('/api/:_ctrl/:_act', action_evaulator);
app.all ('/api/:_ctrl/:_act/:_rid', action_evaulator);



app.listen (process.env.PORT || 3001);