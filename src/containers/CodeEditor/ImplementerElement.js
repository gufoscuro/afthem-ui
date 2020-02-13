import React, { useState, useCallback, useEffect } from 'react';

import _ from 'lodash/core';


function ImplementersElement (props) {
    const [ editing, setEditing ] = useState (false);
    const [ model, setModel ] = useState (props.data)

    let class_match     = 'com.apifortress.afthem.',
        class_string    = props.data.class.indexOf (class_match) !== -1 ? 
            props.data.class.substring (props.data.class.indexOf (class_match) + class_match.length) : props.data.class,
        renderer;


    useEffect (() => {
        if (props.data.$editing) {
            let m = {...model};
            delete m.$editing;

            setModel (m);
            props.change ({
                index: props.$key,
                type: 'implementers',
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

        m.id = v;
        setModel (m); // need to check id is unique
    }, [ model ]);

    const cancelChanges = useCallback (() => {
        setEditing (false);
        setModel (props.data);
    }, [ model ])


    const confirmChanges = useCallback (() => {
        if (true) { // some sort of validation goes here I suppose ...
            props.change ({
                index: props.$key,
                type: 'implementers',
                data: { ...model }
            });
            setEditing (false);
        }
    }, [ model ])


    if (editing) {
        renderer = (
            <div className="editor-fields">  
                <div className="editor-component-field">
                    <span className="lbl">ID <i className="sep far fa-long-arrow-right"></i></span>
                    <input type="text" name="id" value={model.id} onChange={onValueChange}/>
                </div>
                <div className="e-ctrls">
                    <div className="thin-button" onClick={cancelChanges}>Cancel</div>
                    <div className="thin-button" onClick={confirmChanges}>Confirm</div>
                </div>
            </div>
        );
    } else {
        renderer = (
            <>
                <div className="lbl">id: {props.data.id}</div>
                <div className="txt">class: {class_string}</div>
                <div className="txt">type: {props.data.type}</div>
                {props.data.thread_pool ? (<div className="txt">thread_pool: {props.data.thread_pool}</div>) : ''}

                <div className="hover">
                    <div className="ctrls">
                        <div className="thin-button" onClick={() => { setEditing (true) }}>Edit</div>
                        <div className="thin-button" onClick={props.click.bind (this, { action: 'remove-implementer', id: props.$key })}>Remove</div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className={"editor-component editor-item" + (editing ? ' editing' : '')}>
            {renderer}
        </div>
    );
}

export default ImplementersElement;