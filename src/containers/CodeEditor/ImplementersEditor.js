import React, { useState, useCallback, useEffect, useMemo } from 'react';

import ImplementerElement from './ImplementerElement';
import ThreadpoolElement from './ThreadpoolElement';
import ActorsCatalog from './ActorsCatalog';
import FadeinFX from '../../hoc/FadeinFX';
import './VisualEditor.css';


function ImplementersEditor (props) {
    const { axiosInstance, data, refreshHook, update } = props;
    const [ implementers, setImplementers] = useState (data ? data.implementers : null);
    const [ thread_pools, setThreadPools ] = useState (data ? data.thread_pools : null);
    const [ addFlow, setAddFlow ] = useState (false);
    

    useEffect (() => {
        onMount ();
    }, []);

    useEffect (() => {
        update ({
            implementers: implementers,
            thread_pools: thread_pools
        });
    }, [ implementers, thread_pools, update ]);

    const refreshEditor = useCallback ((data) => {
        setImplementers (data.implementers);
        setThreadPools (data.thread_pools);
    }, []);

    const onMount = useCallback (() => {
        refreshHook (refreshEditor)
    }, [ refreshHook, refreshEditor ]);

    const addImplementer = useCallback ((item) => {
        let a = [...implementers]
        a.push ({...item, ...{ $editing: true }});
        setImplementers (a);
        setAddFlow (false);
        setTimeout (() => { window.scrollTo (0, 10000) }, 20)
    }, [ implementers ]);

    const removeImplenenter = useCallback ((index) => {
        let a = [...implementers];
        a.splice (index, 1);
        setImplementers (a);
    }, [ implementers ]);

    const removeThreadpool = useCallback ((key) => {
        let a = { ...thread_pools };
        delete a[key];
        setThreadPools (a);
    }, [ thread_pools ]);

    const hideCatalog = useCallback (() => {
        setAddFlow (false)
    }, []);

    const showCatalog = useCallback (() => {
        window.scrollTo (0, 1);
        setAddFlow (true)
    }, []);

    const addTP = useCallback (() => {
        let c = 0,
            t = { ...thread_pools },
            k = 'threadpool_' + c,
            o = { min: 1, max: 1, factor: 1 };

        while (t[k] !== undefined) {
            k = 'threadpool_' + c;
            c++;
        }
        t[k] = {...o, ...{ $editing: true }};
        setThreadPools (t);
    }, [ thread_pools ]);

    const click_element = useCallback ((status) => {
        console.log ('click', status);

        if (status.action === 'remove-implementer') {
            removeImplenenter (status.id);
        }

        else if (status.action === 'remove-threadpool') {
            removeThreadpool (status.id);
        }
    }, [ removeImplenenter, removeThreadpool ]);

    const edit_element = useCallback ((status) => {
        if (status.type === 'implementers') {
            let i = [...implementers]
            if (i[status.index] !== undefined)
                i[status.index] = status.data;

            setImplementers (i);
            console.log ('edit_element', i);
        }

        else if (status.type === 'threadpools') {
            let t = { ...thread_pools }
            if (t[status.key] !== undefined)
                t[status.key] = status.data;

                setThreadPools (t);
            console.log ('edit_element', t);
        }
        
    }, [ implementers, thread_pools ])


    const implementers_render = useMemo (() => {
        return implementers ? implementers.map ((o, i) => <ImplementerElement key={i} data={o} {...{ $key: i, click: click_element, change: edit_element }} />) : null
    }, [ implementers, click_element, edit_element ]);

    const threadpool_render = useMemo (() => {
        return thread_pools ? Object.keys(thread_pools).map ((key, i) => {
            return <ThreadpoolElement key={i} data={thread_pools[key]} {...{ $key: key, click: click_element, change: edit_element }}  />
        }) : null
    }, [ thread_pools, click_element, edit_element ]);

    const addflow_render = useMemo (() => {
        return addFlow ? (<ActorsCatalog axiosInstance={axiosInstance} add={addImplementer} hide={hideCatalog} />) : null;
    }, [ addFlow, addImplementer, hideCatalog, axiosInstance ])


    return (
        <div className="cols-wrapper">
            <div className="implementers">
                <FadeinFX>
                    <div className="head">Actors</div>
                    {implementers_render}
                    <div className="editor-add-component editor-item" onClick={showCatalog}>
                        Add Implementer
                    
                        {addflow_render}    
                    </div>
                </FadeinFX>
            </div>
            <div className="thread-pool">
                <FadeinFX delay={2}>
                    <div className="head">Thread Pool</div>
                    {threadpool_render}
                    <div className="editor-add-component editor-item" onClick={addTP}>Add Thread Pool</div>
                </FadeinFX>
            </div>
        </div>
    );
}

export default ImplementersEditor;