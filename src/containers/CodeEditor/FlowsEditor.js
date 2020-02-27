import React, { useState, useCallback, useEffect, useMemo } from 'react';

import FlowElement from './FlowElement';
import ImplementersCatalog from './ImplementersCatalog';
import FadeinFX from '../../hoc/FadeinFX';
import axios from 'axios';

import './VisualEditor.css';


function FlowsEditor (props) {
    const [ model, setModel ] = useState (props.data);
    const [ addFlow, setAddFlow ] = useState (false);
    const [ implementersIds, setImplementersIds ] = useState (null);
    const [ actorsMap, setActorsMap ] = useState (null);
    const [ definedActors, setDefinedActors ] = useState ([]);
    
    
    useEffect (() => {
        // console.log ('===> update model', model)
        props.update (model);
        setDefinedActors (Object.keys (model));
    }, [ model ]);

    useEffect (() => {
        props.refreshHook (refreshEditor);
        axios.get ('/api/clusters/getImplementers/' + props.cid).then ((result) => {
            setImplementersIds (result.data.implementers);
            setActorsMap (result.data.actors);
        });
    }, [])

    const refreshEditor = useCallback ((data) => {
        setModel (data)
    }, [])

    const removeItem = useCallback ((key) => {
        let a = { ...model };

        console.log (a);
        delete a[key];
        console.log (a);

        setModel (a);
    }, [ model ]);

    const hideCatalog = useCallback (() => {
        setAddFlow (false)
    }, []);

    const showCatalog = useCallback (() => {
        window.scrollTo (0, 1);
        setAddFlow (true)
    }, []);

    const addItem = useCallback ((item) => {
        let item_spec = actorsMap[item.class];

        setModel ((m) => {
            let t = { ...m };

            if (t[item.typeid] === undefined)
                t[item.typeid] = {
                    $editing: true,
                    $data: item_spec
                };
            else {
                console.log ('existing')
                // t[item.typeid]['$editing'] = true;
            }

            return t;
        });

        setAddFlow (false);
    }, [ actorsMap ]);

    const click_element = useCallback ((status) => {
        console.log ('click', status);

        if (status.action === 'remove')
            removeItem (status.id)

    }, [ removeItem, model ]);

    const edit_element = useCallback ((status) => {
        setModel (prevModel => {
            let m = { ...prevModel };
            m[status.key] = status.data;
            return m;
        });
    }, [ model ])


    const model_renderer = useMemo (() => {
        const flowitems_props = {
            click: click_element,
            change: edit_element,
            definedActors: definedActors
        }
        return model ? Object.keys(model).map ((key, i) => {
            return <FlowElement key={i} data={model[key]} {...{ $key: key, ...flowitems_props  }}  />
        }) : null;
    }, [ model, definedActors, click_element, edit_element ]);

    const addflow_render = useMemo (() => {
        return addFlow ? (<ImplementersCatalog data={implementersIds} add={addItem} hide={hideCatalog} />) : null;
    }, [ addFlow, addItem, hideCatalog ])


    return (
        <div className="cols-wrapper">
            <div className="implementers">
                <FadeinFX delay={2}>
                    {model_renderer}
                    <div className="editor-add-component editor-item" onClick={showCatalog}>
                        Add actor
                        {addflow_render}
                    </div>
                </FadeinFX>
            </div>
            <div className="thread-pool"> </div>
        </div>
    );
}

export default FlowsEditor;