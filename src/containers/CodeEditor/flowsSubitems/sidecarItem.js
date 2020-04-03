import React, { useMemo, useCallback, useState, useEffect } from 'react';

import ActorSelector from './actorSelector';
import SorterBtn from './sorterBtn';
import DeleteBtn from './deleteBtn';
import arrayMove from 'array-move';
import { motion } from "framer-motion";


function SidecarItem (props) {
    const { onUpdate, editing, definedActors } = props;
    const value = (props.value instanceof Array) === false ? [] : props.value;
    const sidecars = useMemo (() => definedActors.filter (it => it.indexOf ('sidecar') === 0), [ definedActors ]);
    const [ model, setModel ] = useState (value.map ((it, j) => {
        return { ...{ id: j }, ...{ value: it }}
    }));


    useEffect (() => {
        let a = [ ...model ]
        onUpdate ('sidecars', a.map (it => it.value))
    }, [ model ]);

    const shiftPosition = useCallback ((old_pos, new_pos) => {
        if (new_pos >= 0 && new_pos < model.length)
            setModel (prevModel => arrayMove (prevModel, old_pos, new_pos));
    }, [ model ]);

    const changeSidecar = useCallback ((event, pos) => {
        const val = event.target.value;
        setModel (prevModel => {
            let a   = [ ...prevModel ];
            a[pos].value = val;
            return a;
        })
    }, [ ]);

    const addSidecar = useCallback (() => {
        setModel (prevModel => {
            let a = [ ...prevModel ];
            a.push ({
                id: Math.random (),
                value: sidecars[0]
            });
            return a;
        })
    }, [ sidecars ]);

    const removeSidecar = useCallback ((index) => {
        setModel (prevModel => {
            let a = [ ...prevModel ];
            a.splice (index, 1);
            return a;
        })
    }, [ ]);
    
    const renderer = useMemo (() => {
        if (editing) {
            const spring = {
                type: "spring",
                damping: 20,
                stiffness: 300
            };
            return (
                <>
                    <div className="keyval indent-1">
                        <div className="keyval-key">
                            sidecars [list] <i className="sep far fa-long-arrow-right"></i>
                        </div>
                        <div className="indent-1 keyval-list">
                        {(model instanceof Array) && model.map ((it, ii) => {
                            return (
                                <motion.div key={it.id} layoutTransition={spring} className="editor-component-sortable">
                                    <div className="editor-component-field">
                                        <ActorSelector list={sidecars} name="sidecar" value={it.value} change={event => changeSidecar (event, ii)} />
                                    </div>
                                    <div className="item-ctrls">
                                        <SorterBtn position={ii} move={shiftPosition} max={model.length} type="up" />
                                        <SorterBtn position={ii} move={shiftPosition} max={model.length} type="down" />
                                        <DeleteBtn position={ii} remove={removeSidecar} />
                                    </div>
                                </motion.div>
                            )
                        })}
                        </div>
                    </div>
                    
                    <div className="indent-2 add-subcomponent">
                        <div className="editor-add-subcomponent" onClick={addSidecar.bind (this)}>
                            + Sidecar
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="keyval indent-1">
                        <div className="keyval-key">
                            sidecars <i className="sep far fa-long-arrow-right"></i>
                        </div>
                        {model.map ((it, ii) => {
                            return (
                                <div key={ii} className="keyval-val indent-1">{it.value}</div>
                            )
                        })}
                    </div>
                </>
            );
        }
    }, [ editing, model, addSidecar, changeSidecar, removeSidecar, shiftPosition, sidecars ])

    return (
        <>
            {renderer}
        </>
    );
}

export default SidecarItem;