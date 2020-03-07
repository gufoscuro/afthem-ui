var modelUtil = { };

modelUtil.checkByModel = (model, data) => {
    return new Promise ((resolve, reject) => {
        var result  = data,
            outcome = true;

        for (var key in result) {
            var validation_data = model[key],
                valid = true,
                val = result[key];

            if (validation_data) {
                if (validation_data.nullable === false && val.toString().trim () === '')
                    valid = false;
            }

            if (valid === false)
                outcome = false;

            result[key] = {
                value: val,
                valid: valid
            }
        }

        resolve ({
            valid: outcome,
            result: result
        })
    })
}

modelUtil.getDefaults = (model) => {
    var result = { };
    for (var key in model) {
        var item_data   = model[key],
            def_val     = '';

        if (item_data.defaultValue !== undefined)
            def_val = item_data.defaultValue;

        else if (item_data.type === 'int')
            def_val = 0;
        else if (item_data.type === 'boolean')
            def_val = true;
        else if (item_data.type === 'select')
            def_val = '';
        else if (item_data.type === 'password')
            def_val = '';
        
        result[key] = def_val;
    }

    return result;
}

module.exports = modelUtil;