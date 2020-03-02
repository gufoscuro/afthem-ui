import React, { useMemo, useCallback } from 'react';

import ActorSelector from './actorSelector';
import SorterBtn from './sorterBtn';
import DeleteBtn from './deleteBtn';
import arrayMove from 'array-move';


function SidecarItem (props) {
    const { onUpdate, editing, definedActors } = props;
    const sidecars = definedActors.filter (it => it.indexOf ('sidecar') === 0)
    let value = props.value;

    if ((value instanceof Array) === false)
        value = [];
    


    const shiftPosition = useCallback ((old_pos, new_pos) => {
        if (new_pos >= 0 && new_pos < value.length) {
            let a = arrayMove (value, old_pos, new_pos);
            onUpdate ('sidecars', a);
        }
    }, [ onUpdate ]);

    const changeSidecar = useCallback ((event, pos) => {
        const val = event.target.value;
        const a = [ ...value ];
        a[pos] = val;
        onUpdate ('sidecars', a);
    }, [ onUpdate ]);

    const addSidecar = useCallback (() => {
        const a = [ ...value ];
        a.push (sidecars[0]);
        onUpdate ('sidecars', a);
    }, [ onUpdate ]);

    const removeSidecar = useCallback ((index) => {
        const a = [ ...value ];
        a.splice (index, 1);
        onUpdate ('sidecars', a);
    }, [ onUpdate ]);
    
    const renderer = useMemo (() => {
        if (editing) {
            return (
                <>
                    <span className="lbl indent-1">sidecars [list] <i className="sep far fa-long-arrow-right"></i></span>
                    {(value instanceof Array) && value.map ((it, ii) => {
                        return (
                            <div key={ii} className="editor-component-field">
                                <div className="lbl indent-2">
                                    <ActorSelector list={sidecars} name="sidecar" value={it} change={event => changeSidecar (event, ii)} />
                                    <SorterBtn position={ii} move={shiftPosition} max={value.length} type="up" />
                                    <SorterBtn position={ii} move={shiftPosition} max={value.length} type="down" />
                                    <DeleteBtn position={ii} remove={removeSidecar} />
                                </div>
                            </div>
                        )
                    })}
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
                    <div className="keyval indent-1">sidecars <i className="sep far fa-long-arrow-right"></i></div>
                    {value.map ((it, ii) => {
                        return (
                            <div key={ii} className="keyval indent-2">{it}</div>
                        )
                    })}
                </>
            );
        }
    }, [ editing, value ])

    return (
        <>
            {renderer}
        </>
    );
}

export default SidecarItem;