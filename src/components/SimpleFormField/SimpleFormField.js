import React, { useCallback, useMemo } from 'react';


function SimpleFormField (props) {
    const { name, value, change, keypress, type, options, disabled = false } = props;

    const onValueChange = useCallback ((val, event) => {
        let v = val;

        if (type === 'boolean') {
            v = event.target.checked;
            // v = val === 'true';
        }
        else if (type === 'int' || type === 'select:int') {
            let vv = val.replace(/\D/, '');
            v = (vv !== '' ? parseInt (vv) : 0);
        }
        
        change (name, v);
    }, [ name, change, type ]);

    const renderer = useMemo (() => {
        let inpt,
            hndl = (e) => onValueChange (e.target.value, e);

        if (type === 'boolean') {
            inpt = (
                <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" checked={value} id="customSwitch1" onChange={hndl} disabled={disabled} />
                    <label className="custom-control-label" htmlFor="customSwitch1"></label>
                </div>
            )
        }

        else if (type === 'select' || type === 'select:int') {
            inpt = (
                <select name={name} value={value} onChange={hndl} disabled={disabled}>
                    {options !== undefined ? options.map ((it, index) => {
                        return (<option key={it.value} value={it.value}>{it.text}</option>)
                    }) : (<option disabled>No options specified</option>)}
                </select>
            )
        }
        
        else if (type === 'text' || type === 'password' || type === 'int') {
            let t_type = (type === 'password' ? type : 'text');
            if (keypress !== undefined)
                inpt = (<input className="textfield" type={t_type} name={name} value={value} 
                    placeholder={name} onChange={hndl} onKeyPress={keypress} autoComplete="off" disabled={disabled} />);
            else
                inpt = (<input className="textfield" type={t_type} name={name} value={value} 
                    placeholder={name} onChange={hndl} disabled={disabled} autoComplete="off" />);
        }

        return (
            <div className="text-field-holder clearfix">
                <div className="label">{name}</div>
                <div className="text">{inpt}</div>
            </div>
        )
    }, [ name, value, type, options, onValueChange, keypress, disabled ]);


    return renderer;
}

export default SimpleFormField;