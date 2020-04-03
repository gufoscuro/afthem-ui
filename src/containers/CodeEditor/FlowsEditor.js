import React, { useState, useCallback, useEffect, useMemo } from 'react';

import FlowElement from './FlowElement';
import ImplementersCatalog from './ImplementersCatalog';
import useBodyClass from '../../components/GlobalHooks/UseBodyClass';
import FadeinFX from '../../hoc/FadeinFX';

import './VisualEditor.css';


function FlowsEditor (props) {
    const { test, update, refreshHook, axiosInstance, oid, cid } = props;
    const [ model, setModel ] = useState (props.data);
    const [ addFlow, setAddFlow ] = useState (false);
    const [ implementersIds, setImplementersIds ] = useState (null);
    const [ definedActors, setDefinedActors ] = useState ([]);
    const [ editingElement, setEditingElement ] = useState (null);
    const [ latestClick, setLatestClick ] = useState (0);
    const [ actorsSchema, setActorsSchema ] = useState ({ });
    
    
    useBodyClass (editingElement ? 'editor-editing' : []);

    useEffect (() => {
        update (model);
        setDefinedActors (Object.keys (model));
    }, [ model, update ]);

    useEffect (() => {
        setImplementersIds (Object.keys (actorsSchema).map (it => actorsSchema[it]))
    }, [ actorsSchema ]);

    useEffect (() => {
        onMount ();
    }, []);

    const refreshEditor = useCallback ((data) => {
        setModel (data)
    }, []);

    const setAsEditing = useCallback ((key, bool) => {
        setEditingElement (bool ? key : null);
    }, []);

    const onMount = useCallback (() => {
        refreshHook (refreshEditor);
        axiosInstance.post ('/api/clusters/getImplementers/', {
            id: oid,
            cid: cid
        }).then ((result) => {
            setActorsSchema (result.data);
        })
    }, [ refreshHook, refreshEditor, actorsSchema, oid, cid, axiosInstance ]);

    const removeItem = useCallback ((key) => {
        setModel (prevModel => {
            let a = { ...prevModel };
            delete a[key];
            return a;
        });
    }, []);

    const hideCatalog = useCallback (() => {
        setAddFlow (false)
    }, []);

    const showCatalog = useCallback (() => {
        window.scrollTo (0, 1);
        setAddFlow (true)
    }, []);

    const addItem = useCallback ((item) => {
        setModel ((m) => {
            let t = { ...m };
            
            if (t[item.typeid] === undefined)
                t[item.typeid] = {
                    $editing: true,
                    $data: item,
                    $new: true
                };
            else {
                setEditingElement (item.typeid, true);
            }

            return t;
        });

        setAddFlow (false);
    }, [ ]);

    const click_element = useCallback ((status, event) => {
        // console.log ('click', status);

        if (status.action === 'item-click') {
            let diff = event.timeStamp - latestClick;
            setLatestClick (event.timeStamp);
            if (diff < 250)
                setAsEditing (status.key, true);
        }
        
        else if (status.action === 'remove')
            removeItem (status.id)

    }, [ removeItem, latestClick ]);

    const edit_element = useCallback ((status) => {
        setModel (prevModel => {
            let m = { ...prevModel };
            m[status.key] = status.data;
            return m;
        });
    }, [])

    const model_renderer = useMemo (() => {
        const flowitems_props = {
            click: click_element,
            change: edit_element,
            setEditing: setAsEditing,
            definedActors: definedActors
            // actorsSchema: actorsSchema
        }
        return model ? Object.keys(model).map ((key, i) => {
            return <FlowElement key={i} 
                data={model[key]} 
                $key={key} 
                editing={editingElement === key} 
                elementSchema={actorsSchema[key] !== undefined ? actorsSchema[key] : null} 
                {...flowitems_props}  />
        }) : null;
    }, [ model, definedActors, actorsSchema, click_element, edit_element, editingElement, setAsEditing ]);

    const addflow_render = useMemo (() => {
        return addFlow ? (<ImplementersCatalog data={implementersIds} add={addItem} hide={hideCatalog} />) : null;
    }, [ addFlow, addItem, hideCatalog, implementersIds ])


    return (
        <div className="cols-wrapperr">
            <div className="flows">
                <FadeinFX delay={2}>
                    {model_renderer}
                    <div className="editor-add-component editor-item" onClick={showCatalog}>
                        Add actor
                    </div>
                </FadeinFX>
            </div>
            {addflow_render}
        </div>
    );
}

export default FlowsEditor;