import React, { useState, useCallback, useEffect, useMemo } from 'react';

import _ from 'lodash/core';


function BackendElement (props) {
    const { $key, data, change, click } = props;
    const [ editing, setEditing ] = useState (false);
    const [ model, setModel ] = useState (props.data)
    

    useEffect (() => {
        if (data.$editing) {
            let m = {...model};
            
            delete m.$editing;
            setModel (m);
            change ($key, m);
            setEditing (true);
        }
    }, [])

    useEffect (() =>  {
        if (editing === false && _.isEqual (data, model) === false) {
            setModel (data);
        }
    }, [ model, data ]);

    const onValueChange = useCallback ((event) => {
        let v = event.target.value,
            n = event.target.name;
        
        if (event.target.validity.valid) {
            setModel ((prevModel) => {
                let m = { ...prevModel };
                m[n] = v;
                return m;
            }); // need to check id is unique
        }
    }, [ model ]);

    const cancelChanges = useCallback (() => {
        setEditing (false);
        setModel (data);
    }, [ data ])

    const confirmChanges = useCallback (() => {
        if (true) { // some sort of validation goes here I suppose ...
            change ($key, { ...model });
            setEditing (false);
        }
    }, [ $key, change, model ])
    
    
    let renderer = useMemo (() => {
        let rrr;

        if (editing) {
            rrr = (
                <>
                    <div className="editor-component-field">
                        <span className="lbl">prefix <i className="sep far fa-long-arrow-right"></i></span>
                        <input type="text" name="prefox" value={model.prefix} onChange={onValueChange}/>
                    </div>
                    <div className="editor-component-field">
                        <span className="lbl">upstream <i className="sep far fa-long-arrow-right"></i></span>
                        <input type="text" name="upstream" value={model.upstream} onChange={onValueChange}/>
                    </div>
                    <div className="editor-component-field">
                        <span className="lbl">flow_id <i className="sep far fa-long-arrow-right"></i></span>
                        <input type="text" name="flow_id" value={model.flow_id} onChange={onValueChange}/>
                    </div>
                    <div className="e-ctrls">
                        <div className="thin-button" onClick={cancelChanges}>Cancel</div>
                        <div className="thin-button" onClick={confirmChanges}>Confirm</div>
                    </div>
                </>
            )
        } else {
            rrr = (
                <>
                    <div className="lbl">prefix: {model.prefix}</div>
                    <div className="txt">upstream: {model.upstream}</div>
                    <div className="txt">flow_id: {model.flow_id}</div>
                    <div className="hover">
                        <div className="ctrls">
                            <div className="thin-button" onClick={() => { setEditing (true) }}>Edit</div>
                            <div className="thin-button" onClick={click.bind (this, { action: 'remove', id: $key })}>Remove</div>
                        </div>
                    </div>
                </>
            )
        }

        return (
            <div className={"editor-component editor-item" + (editing ? ' editing' : '')}>
                {rrr}
            </div>
        );
    }, [ model, editing, onValueChange, cancelChanges, confirmChanges, $key ]);

    return renderer;
}

export default BackendElement;