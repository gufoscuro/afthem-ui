import React, { useCallback, useMemo, useState, useEffect } from 'react';

import SorterBtn from './sorterBtn';
import DeleteBtn from './deleteBtn';
import SmartSelector from '../SmartSelector';
import arrayMove from 'array-move';
import { motion } from "framer-motion";

function ListVEConfig (props) {
    const { name, value, change } = props;
    const [ model, setModel ] = useState (value.map ((it, j) => {
        return {...{ id: j }, ...it}
    }));


    useEffect (() => {
        let a = [ ...model ]
        change (name, a.map (({ id, ...keep }) => {
            return keep;
        }))
    }, [ model ]);

    const onValueChange = useCallback ((index, k, v) => {
        console.log ('onValueChange', index, k, v)
        setModel (prevModel => {
            let a = [ ...prevModel ];
            a[index][k] = v;
            return a;
        })
    }, [ model ]);

    const addVEItem = useCallback (() => {
        setModel (prevModel => {
            let a = [ ...prevModel ],
                all_completed = true;

            a.forEach ((it) => {
                if (it.value === '')
                    all_completed = false;
            });

            if (all_completed)
                a.push ({
                    value: '',
                    evaluated: false,
                    id: Math.random ()
                });
            return a;
        })
    }, [ model ]);

    const shiftPosition = useCallback ((old_pos, new_pos) => {
        if (new_pos >= 0 && new_pos < model.length) {
            setModel (prevModel => {
                return arrayMove (prevModel, old_pos, new_pos);
            })
        }
    }, [ model ]);

    const removeItem = useCallback ((index) => {
        setModel (prevModel => {
            let a = [ ...prevModel ];
            a.splice (index, 1);
            return a;
        })
    }, [ model ]);

    const renderer = useMemo (() => {
        const spring = {
            type: "spring",
            damping: 20,
            stiffness: 300
        };


        return (
            <div className="keyval indent-1 level-2">
                <div className="keyval-key">{name}</div>
                <div className="indent-1 keyval-list">
                    {/* <AnimatePresence>initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.15 }}  */}
                    {(model instanceof Array) && model.map ((it, jj) => {
                        return (
                            <motion.div 
                                layoutTransition={spring} 
                                key={it.id} 
                                className="editor-component-sortable">
                                <div className="editor-component-field no-space">
                                    <input type="text" name="value" value={it.value} autoComplete="off" 
                                        placeholder="value"
                                        onChange={(e) => onValueChange (jj, 'value', e.target.value)} />
                                </div>
                                <div className="editor-component-field">
                                    <SmartSelector type="boolean" name="evaluated" 
                                        value={it.evaluated} change={(n, v) => onValueChange (jj, n, v)} 
                                        label="Evaluated" />
                                </div>
                                <div className="item-ctrls">
                                    <SorterBtn position={jj} move={shiftPosition} max={model.length} type="up" />
                                    <SorterBtn position={jj} move={shiftPosition} max={model.length} type="down" />
                                    <DeleteBtn position={jj} remove={removeItem} />
                                </div>
                            </motion.div>
                        );
                    })}
                {/* </AnimatePresence> */}
                    <div onClick={addVEItem.bind (this)} className="editor-add-subcomponent">+ item to {name}</div>
                </div>
            </div>
        )
    }, [ name, model, onValueChange, shiftPosition, removeItem, addVEItem ]);


    return renderer;
}

export default ListVEConfig;