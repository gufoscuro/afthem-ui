import React, { useCallback, useMemo, useState, useEffect } from 'react';

import SorterBtn from './sorterBtn';
import DeleteBtn from './deleteBtn';
import arrayMove from 'array-move';
import { motion } from "framer-motion";

function ListConfig (props) {
    const { name, value, change, type } = props;
    const [ model, setModel ] = useState (value.map ((it, j) => {
        return { ...{ id: j }, ...{ value: it }}
    }))

    
    useEffect (() => {
        let a = [ ...model ]
        change (name, a.map (({ id, ...keep }) => {
            return keep;
        }))
    }, [ model, name ]);

    const onValueChange = useCallback ((index, val) => {
        setModel (prevModel => {
            let a = [ ...prevModel ],
                v = val;

            if (type === 'list[int]') {
                let vv = val.replace(/\D/, '');
                v = (vv !== '' ? parseInt (vv) : 0);
            }
            a[index].value = val;
            return a;
        })
    }, [ type ]);

    const addItem = useCallback (() => {
        setModel (prevModel => {
            let a = [ ...value ],
                n = type === 'list[int]' ? 0 : '';
            a.push ({
                id: Math.random (),
                value: n
            });
            return a;
        })
    }, [ type ]);

    const shiftPosition = useCallback ((old_pos, new_pos) => {
        if (new_pos >= 0 && new_pos < model.length)
            setModel (prevModel => arrayMove (prevModel, old_pos, new_pos));
    }, [ model ]);

    const removeItem = useCallback ((index) => {
        setModel (prevModel => {
            let a = [ ...prevModel ];
            a.splice (index, 1);
            return a;
        })
    }, [  ]);

    // const onValueChange = useCallback ((index, val) => {
    //     let a = [ ...value ],
    //         v = val;

    //     if (type === 'list[int]') {
    //         let vv = val.replace(/\D/, '');
    //         v = (vv !== '' ? parseInt (vv) : 0);
    //     }
            
    //     a[index] = v;

    //     change (name, a);
    // }, [ name, value, change, type ]);

    // const addItem = useCallback (() => {
    //     let a = [ ...value ],
    //         n = type === 'list[int]' ? 0 : '';

    //     a.push (n);
    //     change (name, a);
    // }, [ name, value, type, change ]);

    // const shiftPosition = useCallback ((old_pos, new_pos) => {
    //     if (new_pos >= 0 && new_pos < value.length) {
    //         let a = arrayMove (value, old_pos, new_pos);
    //         change (name, a);
    //     }
    // }, [ name, value, change ]);

    // const removeItem = useCallback ((index) => {
    //     const a = [ ...value ];
    //     a.splice (index, 1);
    //     change (name, a);
    // }, [ name, value, change ]);

    const renderer = useMemo (() => {
        return (
            <div className="keyval indent-1">
                <div className="keyval-key">{name}</div>
                <div className="indent-1 keyval-list">
                    {(value instanceof Array) && value.map ((it, jj) => {
                        return (
                            <div key={name + '__' + jj} className="editor-component-sortable">
                                <div className="editor-component-field">
                                    <input type="text" name="value" value={it} 
                                        placeholder="value"
                                        onChange={(e) => onValueChange (jj, e.target.value)} />
                                </div>
                                <div className="item-ctrls">
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
    }, [ name, value, onValueChange, shiftPosition, removeItem, addItem ]);


    return renderer;
}

export default ListConfig;