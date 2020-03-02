import React, { useCallback, useMemo } from 'react';

import SorterBtn from './sorterBtn';
import DeleteBtn from './deleteBtn';
import arrayMove from 'array-move';

function ListConfig (props) {
    const { name, value, change, type } = props;

    const onValueChange = useCallback ((index, val) => {
        let a = [ ...value ],
            v = val;

        if (type === 'list[int]') {
            let vv = val.replace(/\D/, '');
            v = (vv !== '' ? parseInt (vv) : 0);
        }
            
        a[index] = v;

        change (name, a);
    }, [ name, value, change ]);

    const addItem = useCallback (() => {
        let a = [ ...value ],
            n = type === 'list[int]' ? 0 : '';

        a.push (n);
        change (name, a);
    }, [ name, value, type, change ]);

    const shiftPosition = useCallback ((old_pos, new_pos) => {
        if (new_pos >= 0 && new_pos < value.length) {
            let a = arrayMove (value, old_pos, new_pos);
            change (name, a);
        }
    }, [ name, value, change ]);

    const removeItem = useCallback ((index) => {
        const a = [ ...value ];
        a.splice (index, 1);
        change (name, a);
    }, [ name, value, change ]);

    const renderer = useMemo (() => {
        return (
            <div className="keyval indent-2">
                <div className="lbl">{name}</div>
                <div className="indent-1">
                    {(value instanceof Array) && value.map ((it, jj) => {
                        return (
                            <div key={name + '__' + jj} className="editor-component-field">
                                <div className="lbl">
                                    <input type="text" name="value" value={it} 
                                        placeholder="value"
                                        onChange={(e) => onValueChange (jj, e.target.value)} />

                                    <SorterBtn position={jj} move={shiftPosition} max={value.length} type="up" />
                                    <SorterBtn position={jj} move={shiftPosition} max={value.length} type="down" />
                                    <DeleteBtn position={jj} remove={removeItem} />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div onClick={addItem.bind (this)} className="editor-add-subcomponent">+ item to {name}</div>
            </div>
        )
    }, [ name, value, change, onValueChange, shiftPosition, removeItem, addItem ]);


    return renderer;
}

export default ListConfig;