import React, { useState, useCallback, useEffect, useMemo } from 'react';

import NextElement from './flowsSubitems/nextItem';
import SidecarElement from './flowsSubitems/sidecarItem';
import KeyvalItem from './flowsSubitems/keyvalItem';
import ConfigItem from './flowsSubitems/configItem';

import _ from 'lodash/core';


function FlowElement (props) {
    const { $key, data, change, definedActors } = props;
    const [ editing, setEditing ] = useState (false);
    const [ model, setModel ] = useState (props.data)
    const [ config, setConfig ] = useState (null);

    // console.log ('flow', data)


    useEffect (() => {
        if (data.$editing) {
            console.log ('create', data);

            let m = {...model};
            
            delete m.$editing;
            delete m.$data;

            setConfig (data.$data);

            if (data.$data.sidecars)
                m.sidecars = {};
            if (data.$data.config) {
                m.config = { };
                for (let k in data.$data.config) {
                    let it = data.$data.config[k],
                        ty = it.type,
                        vl = '';

                    if (ty === 'list')
                        vl = [];

                    m.config[k] = vl;
                }
            }
            
            setModel (m);
            change ({
                key: props.$key,
                type: 'flows',
                data: m
            });
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

    const onValueUpdate = useCallback ((key, value) => {
        let m = { ...model };

        m[key] = value;
        setModel (m);
    })

    const onItemChange = useCallback ((event, status) => {
        console.log ('on item change', status)
    })

    const cancelChanges = useCallback (() => {
        setEditing (false);
        setModel (data);
    }, [ data ])

    const confirmChanges = useCallback (() => {
        if (true) { // some sort of validation goes here I suppose ...
            change ({
                key: $key,
                type: 'FlowElement',
                data: { ...model }
            });
            setEditing (false);
        }
    }, [ $key, change, model ])
    
    
    let renderer = useMemo (() => {
        let fields = [],
            field_props = {
                definedActors: definedActors,
                onChange: onValueChange,
                onUpdate: onValueUpdate,
                editing: editing
            };
            
        Object.keys (model).forEach ((it, i) => {
            if (it === 'next')
                fields.push (<NextElement key={i} value={model[it]} {...field_props} />);
            else if (it === 'sidecars')
                fields.push (<SidecarElement key={i} name={it} value={model[it]} {...field_props} />);
            else if (it === 'config')
                fields.push (<ConfigItem key={i} name={it} value={model[it]} {...field_props} />);
        });
        return (
            <>
                {fields}
            </>
        )
    }, [ model, editing, onValueUpdate, onValueChange ]);


    let ctrls;

    if (editing) {
        ctrls = (
            <div className="e-ctrls">
                <div className="thin-button" onClick={cancelChanges}>Cancel</div>
                <div className="thin-button" onClick={confirmChanges}>Confirm</div>
            </div>
        )
    } else {
        ctrls = (
            <div className="hover">
                <div className="ctrls">
                    <div className="thin-button" onClick={() => { setEditing (true) }}>Edit</div>
                    <div className="thin-button" onClick={props.click.bind (this, { action: 'remove', id: props.$key })}>Remove</div>
                </div>
            </div>
        )
    }
    

    return (
        <div className={"editor-component editor-item" + (editing ? ' editing' : '')}>
            <div className="lbl">{props.$key}</div>
            {renderer}
            {ctrls}
        </div>
    );
}

export default FlowElement;