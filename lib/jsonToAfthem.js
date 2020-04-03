"use strict"



const category_handler = (item) => {
    var lowercase   = item.text !== undefined ? item.text.trim().toLowerCase () : '',
        cat_match   = lowercase.match (/type:(.*)/),
        cat         = cat_match ? cat_match[1].trim() : item.text,
        res = {
            category: cat,
            children: []
        }

    item.children.forEach ((it) => {
        res.children.push (item_analyzer (it));
    });

    return res;
}

const actor_handler = (item) => {
    var has_desc    = false,
        prev_child  = null,
        notes_cnt   = 0,
        res         = {
            name: item.text,
            description: null
        }

    // console.log (item)
    item.children.forEach ((it) => {
        var lcase       = it.text !== undefined ? it.text.trim().toLowerCase () : '',
            key_match   = lcase.match(/(.+?):/),
            key         = key_match ? key_match[1] : null,
            type        = it.type !== undefined ? it.type : '';

        if (type === 'paragraph' && !has_desc)
            res.description = it.text;

        else if (key && key === 'config') {
            var conf_opts = { };
            if (it.children !== undefined) {
                it.children.forEach ((config_item) => {
                    var text        = config_item.text,
                        col_index   = text.indexOf (':'),
                        bef_col     = text.substring (0, col_index).trim (),
                        aft_col     = text.substring (col_index + 1).trim (),
                        key_match   = bef_col.match (/`(.*)`/),
                        key         = key_match ? key_match[1] : bef_col,
                        dt_match    = bef_col.match (/\[(.*)\]/),
                        datatype    = dt_match ? dt_match[1] : null;

                    conf_opts[key] = {
                        description: aft_col,
                        type: datatype
                    }
                })
            }
            res.config = conf_opts;
        }

        else if (key && key === 'headers') {
            // skip this key
        }

        else if (key && key.toLowerCase() === 'notes') {
            if (res.notes === undefined)
                res.notes = '';
            it.children.forEach ((note_item) => {
                res.notes += (res.notes !== '' ? ' \n ' : '') + note_item.text;
            })
        }

        else if (key && key.toLowerCase() === 'example') {
            res.example = {
                lang: null,
                code: ''
            };
            
            // console.log ('example', JSON.stringify (it, null, '  '));
            it.children.forEach ((example) => {

                if (example.type === 'code') {
                    if (example.lang)
                        res.example.lang = example.lang;
                    res.example.code = example.text;
                } else if (example.type === 'paragraph') {
                    if (res.example.description === undefined)
                        res.example.description = '';

                    res.example.description += example.text;
                }
            })
        }

        else if (key) {
            if (it.children[0] !== undefined) {
                var txt     = it.children[0].text,
                    txt_m   = txt.match (/`(.*)`/),
                    cleaned = (txt_m ? txt_m[1] : txt).trim(),
                    f_val   = (cleaned === 'yes' || cleaned === 'no') ? (cleaned.toLowerCase() === 'yes') : cleaned;

                res[key] = f_val;
            }
        }

        else {
            // if (res.extra === undefined)
            //     res.extra = [];

            // res.children.push (item_analyzer (it, res));
        }
    });

    return res;
}

const globaldesc_handler = (item) => {
    return {
        type: 'global-description',
        text: item.text
    };
}

const config_handler = (item) => {
    return item;
}

const item_analyzer = (item) => {
    var lowercase       = item.text !== undefined ? item.text.toLowerCase().trim () : '',
        type            = item.type !== undefined ? item.type : null,
        output          = null,
        interpolated    = { ...item, ...{
            type: type
        }};
        

    // console.log ('\n\nitem_analyzer', output.category);

    if (lowercase.startsWith ('type:') || lowercase.startsWith ('[Category]:'))
        output = category_handler (interpolated);

    else if (lowercase.endsWith ('actor'))
        output = actor_handler (interpolated);

    else if (type && type === 'paragraph')
        output = globaldesc_handler (interpolated);

    else if (lowercase === 'config')
        output = config_handler (interpolated);

    else
        output = interpolated;


    return output;
}

module.exports.parse = (json) => {
    return new Promise ((resolve, reject) => {
        var title_clean = json.text.indexOf ('AFtheM') === 0 ? json.text.substring (8) : json.text,
            result = {
                title: title_clean,
                description: '',
                children: []
            };

        json.children.forEach ((it) => {
            var afthem_item = item_analyzer (it);

            if (afthem_item.type === 'global-description')
                result.description += afthem_item.text;
            else
                result.children.push (afthem_item);
        });
        
        resolve (result);
    })
}

