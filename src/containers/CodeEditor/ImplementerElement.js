import React, { useState, useCallback, useEffect } from 'react';

import _ from 'lodash/core';


function ImplementersElement (props) {
    const { data, change, click, $key } = props;
    const [ editing, setEditing ] = useState (false);
    const [ model, setModel ] = useState (data)

    let class_match     = 'com.apifortress.afthem.',
        class_string    = props.data.class.indexOf (class_match) !== -1 ? 
            props.data.class.substring (props.data.class.indexOf (class_match) + class_match.length) : props.data.class,
        renderer;


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

            setModel (m);
            change ({
                index: $key,
                type: 'implementers',
                data: m
            });
            setEditing (true);
        }
    }, [ change, model, data, $key ]);

    const onValueChange = useCallback ((event) => {
        const v = event.target.value;
        setModel ((prevModel) => {
            let m = { ...prevModel };

            m.id = v;
            return m;
        });
    }, [ ]);

    const cancelChanges = useCallback (() => {
        setEditing (false);
        setModel (data);
    }, [ data ])


    const confirmChanges = useCallback (() => {
        if (true) { // some sort of validation goes here I suppose ...
            change ({
                index: $key,
                type: 'implementers',
                data: { ...model }
            });
            setEditing (false);
        }
    }, [ $key, change, model ])


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
                <div className="lbl">id: {data.id}</div>
                <div className="txt">class: {class_string}</div>
                <div className="txt">type: {data.type}</div>
                {data.thread_pool ? (<div className="txt">thread_pool: {data.thread_pool}</div>) : ''}

                <div className="hover">
                    <div className="ctrls">
                        <div className="thin-button" onClick={() => { setEditing (true) }}>Edit</div>
                        <div className="thin-button" onClick={click.bind (this, { action: 'remove-implementer', id: $key })}>Remove</div>
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