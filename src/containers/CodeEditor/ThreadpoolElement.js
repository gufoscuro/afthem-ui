import React, { useState, useCallback, useEffect, useMemo } from 'react';

import _ from 'lodash/core';


function ThreadpoolElement (props) {
    const { data, $key, change, click, editing, setEditing } = props;
    const [ model, setModel ] = useState (props.data);
    const [ brandNew, setBrandNew ] = useState (false);


    useEffect (() => {
        onMount ();
    }, [])

    useEffect (() =>  {
        if (editing === false && _.isEqual (data, model) === false) {
            setModel (data);
        }
    }, [ model, data, editing ]);

    const onMount = useCallback (() => {
        if (data.$editing) {
            let m = {...model};
            delete m.$editing;
            delete m.$new;

            if (data.$new)
                setBrandNew (true);

            setModel (m);
            change ({
                key: $key,
                type: 'threadpools',
                data: m
            });
            setEditing ($key, true);

        }
    }, [ data, change, model, $key ]);

    const onValueChange = useCallback ((event) => {
        let v = event.target.value,
            m = { ...model };
        
        if (event.target.validity.valid) {
            m[event.target.name] = v;
            setModel (m); // need to check id is unique
        }
    }, [ model ]);

    const cancelChanges = useCallback (() => {
        setEditing ($key, false);
        setModel (data);
    }, [ data ])

    
    const confirmChanges = useCallback (() => {
        if (true) { // some sort of validation goes here I suppose ...
            change ({
                key: $key,
                type: 'threadpools',
                data: { ...model }
            });
            setEditing ($key, false);
            if (brandNew)
                setBrandNew (false);
        }
    }, [ model, change, $key, brandNew ])


    const renderer = useMemo (() => {
        let r;
        if (editing) {
            r = (
                <>
                    <div className="lbl id">{$key}</div>
                    <div className="editor-component-field">
                        <span className="lbl">min <i className="sep far fa-long-arrow-right"></i></span>
                        <input type="text" name="min" value={model.min} pattern="[0-9]*" onChange={onValueChange}/>
                    </div>
                    <div className="editor-component-field">
                        <span className="lbl">max <i className="sep far fa-long-arrow-right"></i></span>
                        <input type="text" name="max" value={model.max} pattern="[0-9]*" onChange={onValueChange}/>
                    </div>
                    <div className="editor-component-field">
                        <span className="lbl">factor <i className="sep far fa-long-arrow-right"></i> </span>
                        <input type="text" name="factor" value={model.factor} pattern="[0-9]*" onChange={onValueChange}/>
                    </div>
                    
                    <div className="e-ctrls">
                        {brandNew === false && <div className="thin-button" onClick={cancelChanges}>Cancel</div>}
                        <div className="thin-button" onClick={confirmChanges}>Confirm</div>
                    </div>
                </>
            );
        } else {
            r = (
                <>
                    <div className="lbl id">{$key}</div>
                    <div className="keyval indent-1">min <i className="far fa-long-arrow-right"></i> {data.min}</div>
                    <div className="keyval indent-1">max <i className="far fa-long-arrow-right"></i> {data.max}</div>
                    <div className="keyval indent-1">factor <i className="far fa-long-arrow-right"></i> {data.factor}</div>
    
                    <div className="hover">
                        <div className="ctrls">
                            <div className="thin-button" onClick={() => { setEditing ($key, true) }}>Edit</div>
                            {$key === 'default' ? null : (<div className="thin-button" onClick={click.bind (this, { action: 'remove-threadpool', id: $key })}>Remove</div>)}
                        </div>
                    </div>
                </>
            )
        }

        return (
            <div className={"editor-component editor-item" + (editing ? ' editing' : '')} onClick={e => click ({ key: $key, type: 'tp', action: 'item-click' }, e)}>{r}</div>
        )
    }, [ editing, click, data, model, $key, onValueChange, confirmChanges, cancelChanges, setEditing, brandNew ])
    

    return renderer;
}

export default ThreadpoolElement;