import React, { useState, useCallback, useEffect, useMemo } from 'react';

import NextElement from './flowsSubitems/nextItem';
import SidecarElement from './flowsSubitems/sidecarItem';
// import KeyvalItem from './flowsSubitems/keyvalItem';
import ConfigItem from './flowsSubitems/configItem';

import _ from 'lodash/core';


function FlowElement (props) {
    const { $key, visualId, data, click, change, definedActors, elementSchema, editing, setEditing } = props;
    const [ model, setModel ] = useState (props.data)
    const [ brandNew, setBrandNew ] = useState (false);
    // const elementSchema = actorsSchema !== undefined ? actorsSchema[$key] : null;
    // if ($key === 'proxy/request')
    //     console.log ($key, 'flow', model.sidecars, _.isEqual (data, model));

    // console.log ('elementSchema', elementSchema)
    useEffect (() => {
        if (data.$editing) {
            let m = {...model};
            
            delete m.$editing;
            delete m.$data;
            delete m.$new;

            if (data.$new)
                setBrandNew (true);
                

            if (data.$data.typeid !== "proxy/send_back" && data.$data.typeid.indexOf ('sidecar/') === -1)
                m.next = definedActors && definedActors.length ? definedActors[0] : '';
            if (data.$data.sidecars)
                m.sidecars = { };
            if (data.$data.config) {
                m.config = { };
                for (let k in data.$data.config) {
                    let it = data.$data.config[k],
                        ty = it.type,
                        vl = '';

                    if (ty === 'list' || ty.indexOf ('list[') !== -1)
                        vl = [];

                    m.config[k] = vl;
                }
            }
            
            setModel (m);
            change ({
                key: $key,
                type: 'flows',
                data: m
            });
            setEditing ($key, true);
        }
    }, []);

    useEffect (() =>  {
        if (editing === false && _.isEqual (data, model) === false) {
            setModel (data);
        }
    }, [ model, data, editing ]);

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
    }, []);

    const onValueUpdate = useCallback ((key, value) => {
        setModel (prevModel => {
            let m = { ...prevModel };
            m[key] = value;
            return m;
        });
    }, []);

    const cancelChanges = useCallback (() => {
        setEditing ($key, false);
        setModel (data);
    }, [ data ])

    const confirmChanges = useCallback (() => {
        if (true) { // some sort of validation goes here I suppose ...
            change ({
                key: $key,
                type: 'FlowElement',
                data: { ...model }
            });
            setEditing ($key, false);
            if (brandNew)
                setBrandNew (false);
        }
    }, [ $key, change, model, brandNew ])
    
    
    let renderer = useMemo (() => {
        let fields = [],
            field_props = {
                flowElemId: $key,
                definedActors: definedActors,
                elementSchema: elementSchema,
                onChange: onValueChange,
                onUpdate: onValueUpdate,
                editing: editing
            };
            
        Object.keys (model).forEach ((it, i) => {
            if (it === 'next')
                fields.push (<NextElement key={visualId + i} value={model[it]} {...field_props} />);
            else if (it === 'sidecars')
                fields.push (<SidecarElement key={visualId + i} name={it} value={model[it]} {...field_props} />);
            else if (it === 'config')
                fields.push (<ConfigItem key={visualId + i} name={it} value={model[it]} {...field_props} />);
        });
        return (
            <>
                {fields}
            </>
        )
    }, [ model, editing, onValueUpdate, onValueChange, definedActors, elementSchema ]);


    let ctrls;

    if (editing) {
        ctrls = (
            <div className="e-ctrls">
                {brandNew === false && <div className="thin-button" onClick={cancelChanges}>Cancel</div>}
                <div className="thin-button" onClick={confirmChanges}>Confirm</div>
            </div>
        )
    } else {
        ctrls = (
            <div className="hover">
                <div className="ctrls">
                    <div className="thin-button" onClick={() => { setEditing ($key, true) }}>Edit</div>
                    <div className="thin-button" onClick={click.bind (this, { action: 'remove', id: $key })}>Remove</div>
                </div>
            </div>
        )
    }
    

    return (
        <div className={"editor-component editor-item" + (editing ? ' editing' : '')} 
            onClick={e => click ({ key: $key, action: 'item-click' }, e)}>
            <div className="lbl id">{$key}</div>
            {renderer}
            {ctrls}
        </div>
    );
}

export default FlowElement;