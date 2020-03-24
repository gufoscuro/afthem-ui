import React, { useState, useCallback, useEffect, useMemo } from 'react';

import BackendElement from './BackendElement';
import FadeinFX from '../../hoc/FadeinFX';

import './VisualEditor.css';


function BackendsEditor (props) {
    const { update, refreshHook } = props;
    const [ model, setModel ] = useState (props.data && props.data.backends ? props.data.backends : []);


    
    useEffect (() => {
        update ({
            backends: model
        });
    }, [ model, update ]);

    useEffect (() => {
        refreshHook (refreshEditor);
    }, []);

    const refreshEditor = useCallback ((data) => {
        // console.log ('refresh', data)
        setModel (data.backends)
    }, []);

    const removeItem = useCallback ((index) => {
        setModel ((prevModel) => {
            let a = [ ...prevModel ];
            a.splice (index, 1);
            return a;
        })
    }, []);

    const addItem = useCallback (() => {
        setModel ((m) => {
            let t = [ ...m ];
            t.push ({
                prefix: '[^/]',
                upstream: '',
                flow_id: '',
                $editing: true
            });

            return t;
        });
    }, []);

    const click_element = useCallback ((status) => {
        console.log ('click', status);

        if (status.action === 'remove')
            removeItem (status.id)

    }, [ removeItem ]);

    const edit_element = useCallback ((index, data) => {
        setModel (prevModel => {
            let m = [ ...prevModel ];
            m[index] = data;
            return m;
        });
    }, [])

    const model_renderer = useMemo (() => {
        const backendsitems_props = {
            click: click_element,
            change: edit_element
        }
        return model ? model.map ((it, i) => {
            return <BackendElement key={i} data={it} {...{ $key: i, ...backendsitems_props  }}  />
        }) : null;
    }, [ model, click_element, edit_element ]);


    return (
        <div className="cols-wrapperr">
            <div className="backends">
                <FadeinFX delay={2}>
                    {model_renderer}
                    <div className="editor-add-component editor-item" onClick={addItem}>
                        Add backend
                    </div>
                </FadeinFX>
            </div>
        </div>
    );
}

export default BackendsEditor;