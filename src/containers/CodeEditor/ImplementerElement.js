import React, { useState, useCallback, useEffect, useMemo } from 'react';

import { STRING } from '../../libs/js/utils';
import _ from 'lodash/core';


function ImplementersElement (props) {
    const { data, change, click, $key, pools, editing, setEditing } = props;
    const [ model, setModel ] = useState (data);
    const [ brandNew, setBrandNew ] = useState (false);

    // console.log ('implementer', editing)

    let renderer;


    useEffect (() => {
        onMount ();
    }, []);

    // useEffect (() => {
    //     setModel (prevM => {
    //         return prevM.instances === undefined ? {
    //             ...prevM,
    //             instances: 1
    //         } : prevM;
    //     })
    // }, [ data ]);

    // useEffect (() =>  {
    //     if (editing === false && _.isEqual (data, model) === false) {
    //         setModel (data);
    //     }
    // }, [ model, data, editing ]);

    const class_string = useMemo (() => {
        let class_match = 'com.apifortress.afthem.',
            final_clss  = data.class.indexOf (class_match) !== -1 ? 
                data.class.substring (props.data.class.indexOf (class_match) + class_match.length) : data.class;

        return STRING.tiny (final_clss, 70)
    }, [ data.class ]);
    
    const onMount = useCallback (() => {
        if (data.$editing) {
            let m = {...model};
            delete m.$editing;
            delete m.$new;

            if (data.$new)
                setBrandNew (true);

            setModel (m);
            change ({
                index: $key,
                type: 'implementers',
                data: m
            });
            setEditing ($key, true);
        }
    }, [ change, model, data, $key ]);

    const onValueChange = useCallback ((event) => {
        let n = event.target.name,
            v = event.target.value;

        setModel ((prevModel) => {
            let m = { ...prevModel };
            if (n === 'thread_pool' && v === 'null')
                delete m.thread_pool;
            else if (n === 'instances') {
                let vv = v.replace(/\D/, '');
                v = (vv !== '' ? parseInt (vv) : 1);
                m[n] = v
            } else
                m[n] = v;

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
            setEditing ($key, false);
            if (brandNew)
                setBrandNew (false);
        }
    }, [ $key, change, model, brandNew ])


    if (editing) {
        renderer = (
            <div className="editor-fields">  
                <div className="editor-component-field">
                    <div className="lbl">ID <i className="sep far fa-long-arrow-right"></i></div>
                    <div className="indent-1">
                        <input type="text" name="id" value={model.id} onChange={onValueChange}/>
                    </div>
                </div>
                <div className="editor-component-field">
                    <div className="lbl">instances <i className="sep far fa-long-arrow-right"></i></div>
                    <div className="indent-1">
                        <input type="text" name="instances" value={model.instances} onChange={onValueChange}/>
                    </div>
                </div>
                <div className="editor-component-field">
                    <div className="lbl">thread_pool <i className="sep far fa-long-arrow-right"></i></div>
                    <div className="indent-1">
                        <select name="thread_pool" value={model.thread_pool ? model.thread_pool : 'null'} onChange={onValueChange}>
                            <option value="null">(not set)</option>
                            {pools.map ((o, i) => <option key={i}>{o}</option>)}
                        </select>
                    </div>
                </div>
                <div className="e-ctrls">
                    {brandNew === false && <div className="thin-button" onClick={cancelChanges}>Cancel</div>}
                    <div className="thin-button" onClick={confirmChanges}>Confirm</div>
                </div>
            </div>
        );
    } else {
        renderer = (
            <>
                <div className="lbl id">id: {data.id}</div>
                <div className="txt">class: {class_string}</div>
                <div className="txt">type: {data.type}</div>
                {data.thread_pool ? (<div className="txt">thread_pool: {data.thread_pool}</div>) : ''}

                <div className="hover">
                    <div className="ctrls">
                        <div className="thin-button" onClick={() => { setEditing ($key, true) }}>Edit</div>
                        <div className="thin-button" onClick={click.bind (this, { action: 'remove-implementer', id: $key })}>Remove</div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className={"editor-component editor-item" + (editing ? ' editing' : '')} onClick={e => click ({ key: $key, action: 'item-click' }, e)}>
            {renderer}
        </div>
    );
}

export default ImplementersElement;