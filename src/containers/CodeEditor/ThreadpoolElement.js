import React, { useState, useCallback, useEffect } from 'react';

import _ from 'lodash/core';


function ThreadpoolElement (props) {
    const [ editing, setEditing ] = useState (false);
    const [ model, setModel ] = useState (props.data)

    let renderer;


    useEffect (() => {
        if (props.data.$editing) {
            let m = {...model};
            delete m.$editing;

            setModel (m);
            props.change ({
                key: props.$key,
                type: 'threadpools',
                data: m
            });
            setEditing (true);
        }
    }, [])

    useEffect (() =>  {
        if (editing === false && _.isEqual (props.data, model) === false) {
            setModel (props.data);
        }
    }, [ model ]);


    const onValueChange = useCallback ((event) => {
        let v = event.target.value,
            m = { ...model };
        
        if (event.target.validity.valid) {
            m[event.target.name] = v;
            setModel (m); // need to check id is unique
        }
    }, [ model ]);

    const cancelChanges = useCallback (() => {
        setEditing (false);
        setModel (props.data);
    }, [ model ])

    
    const confirmChanges = useCallback (() => {
        if (true) { // some sort of validation goes here I suppose ...
            props.change ({
                key: props.$key,
                type: 'threadpools',
                data: { ...model }
            });
            setEditing (false);
        }
    }, [ model ])


    if (editing) {
        renderer = (
            <>
                <input type="text" name="min" value={model.min} pattern="[0-9]*" onChange={onValueChange}/>
                <input type="text" name="max" value={model.max} pattern="[0-9]*" onChange={onValueChange}/>
                <input type="text" name="factor" value={model.factor} pattern="[0-9]*" onChange={onValueChange}/>
                
                <div>
                    <div className="thin-button" onClick={cancelChanges}>Cancel</div>
                    <div className="thin-button" onClick={confirmChanges}>Confirm</div>
                </div>
            </>
        );
    } else {
        renderer = (
            <>
                <div className="lbl">{props.$key}</div>
                <div className="keyval indent-1">min <i className="far fa-long-arrow-right"></i> {props.data.min}</div>
                <div className="keyval indent-1">max <i className="far fa-long-arrow-right"></i> {props.data.max}</div>
                <div className="keyval indent-1">factor <i className="far fa-long-arrow-right"></i> {props.data.factor}</div>

                <div className="hover">
                    <div className="ctrls">
                        <div className="thin-button" onClick={() => { setEditing (true) }}>Modifica</div>
                        {props.$key === 'default' ? null : (<div className="thin-button" onClick={props.click.bind (this, { action: 'remove-threadpool', id: props.$key })}>Elimina</div>)}
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="editor-component editor-item">
            {renderer}
        </div>
    );
}

export default ThreadpoolElement;