import React, { useCallback, useMemo } from 'react';


function SmartSelector (props) {
    const { name, value, change, type, options, label } = props;

    const ovc = useCallback (event => {
        let v = event.target.value;

        if (type === 'boolean') {
            v = event.target.checked;
        }

        else if (type === 'select:int') {
            let vv = v.replace(/\D/, '');
            v = (vv !== '' ? parseInt (vv) : 0);
        }
        
        change (name, v);
    }, [ name, change, type ]);

    const renderer = useMemo (() => {
        let inpt, gid = name + Math.round (Math.random () * 100000);

        if (type === 'boolean') {
            inpt = (
                <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" checked={value} id={gid} onChange={ovc} />
                    <label className="custom-control-label" htmlFor={gid}>{label}</label>
                </div>
            )
        }

        else if (type === 'select' || type === 'select:int') {
            inpt = (
                <select name={name} value={value} onChange={ovc}>
                    {options !== undefined ? options.map ((it, index) => {
                        return (<option key={it.value} value={it.value}>{it.text}</option>)
                    }) : (<option disabled>No options specified</option>)}
                </select>
            )
        }

        return inpt;
    }, [ name, value, type, options, ovc, label ]);


    return renderer;
}

export default SmartSelector;