import React, { useCallback, useMemo } from 'react';

import SorterBtn from './sorterBtn';
import DeleteBtn from './deleteBtn';
import arrayMove from 'array-move';

function ListNVEConfig (props) {
    const { name, value, change } = props;

    const onValueChange = useCallback ((index, k, v) => {
        let a = [ ...value ];
        a[index][k] = v;

        change (name, a);
    }, [ name, value, change ]);

    const addVEItem = useCallback (() => {
        let a = [ ...value ];
        a.push ({
            name: '',
            value: '',
            evaluated: true
        });
        change (name, a);
    }, [ name, value, change ]);

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
                                    <input type="text" name="name" value={it.name} 
                                        placeholder="name"
                                        onChange={(e) => onValueChange (jj, 'name', e.target.value)} />
                                    <input type="text" name="value" value={it.value} 
                                        placeholder="value"
                                        onChange={(e) => onValueChange (jj, 'value', e.target.value)} />
                                    <select name="evaluated" value={it.evaluated} 
                                        onChange={(e) => onValueChange (jj, 'evaluated', e.target.value === 'true')}>
                                        <option value="true">true</option>
                                        <option value="false">false</option>
                                    </select>

                                    <SorterBtn position={jj} move={shiftPosition} max={value.length} type="up" />
                                    <SorterBtn position={jj} move={shiftPosition} max={value.length} type="down" />
                                    <DeleteBtn position={jj} remove={removeItem} />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div onClick={addVEItem.bind (this)} className="editor-add-subcomponent">+ item to {name}</div>
            </div>
        )
    }, [ name, value, change, onValueChange, shiftPosition, removeItem, addVEItem ]);


    return renderer;
}

export default ListNVEConfig;