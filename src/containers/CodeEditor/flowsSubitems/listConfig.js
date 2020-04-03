import React, { useCallback, useMemo, useState, useEffect } from 'react';

import SorterBtn from './sorterBtn';
import DeleteBtn from './deleteBtn';
import arrayMove from 'array-move';
import { motion } from "framer-motion";

function ListConfig (props) {
    const { name, value, change, type } = props;
    const [ model, setModel ] = useState (value.map ((it, j) => {
        return { ...{ id: j }, ...{ value: it }}
    }));
    
    
    useEffect (() => {
        let a = [ ...model ];
        change (name, a.map (it => it.value))
    }, [ model ]);

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
            let a = [ ...prevModel ],
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
    

    const renderer = useMemo (() => {
        const spring = {
            type: "spring",
            damping: 20,
            stiffness: 300
        };
        return (
            <div className="keyval indent-1">
                <div className="keyval-key">{name}</div>
                <div className="indent-1 keyval-list">
                    {(model instanceof Array) && model.map ((it, jj) => {
                        return (
                            <motion.div key={it.id} layoutTransition={spring} className="editor-component-sortable">
                                <div className="editor-component-field">
                                    <div className="sortable-lbl">value</div>
                                    <input type="text" name="value" value={it.value} 
                                        placeholder="value"
                                        onChange={(e) => onValueChange (jj, e.target.value)} />
                                </div>
                                <div className="item-ctrls">
                                    <SorterBtn position={jj} move={shiftPosition} max={value.length} type="up" />
                                    <SorterBtn position={jj} move={shiftPosition} max={value.length} type="down" />
                                    <DeleteBtn position={jj} remove={removeItem} />
                                </div>
                            </motion.div>
                        );
                    })}
                    <div onClick={addItem.bind (this)} className="editor-add-subcomponent pad-left">+ Add item</div>
                </div>
            </div>
        )
    }, [ name, model, onValueChange, shiftPosition, removeItem, addItem ]);


    return renderer;
}

export default ListConfig;