import React, { useCallback, useMemo } from 'react';


function SingleValConfig (props) {
    const { name, value, change, type } = props;

    const onValueChange = useCallback ((val) => {
        console.log ('SingleValConfig change', value);
        let v = val;

        if (type === 'boolean')
            v = val === 'true';
        else if (type === 'int') {
            let vv = val.replace(/\D/, '');
            v = (vv !== '' ? parseInt (vv) : 0);
        }
        
        change (name, v);
    }, [ name, value, change ]);

    const renderer = useMemo (() => {
        let inpt,
            hndl = (e) => onValueChange (e.target.value);

        if (type === 'boolean')
            inpt = (
                <select name={name} value={value} onChange={hndl}>
                    <option>true</option>
                    <option>false</option>
                </select>
            );
        else
            inpt = (<input type="text" name={name} value={value} placeholder={name} onChange={hndl} />);

        return (
            <div className="keyval indent-2">
                <div className="lbl">{name}</div>
                <div className="indent-1">{inpt}</div>
            </div>
        )
    }, [ name, value, type, change, onValueChange ]);


    return renderer;
}

export default SingleValConfig;