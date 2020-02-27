import React, { useState, useCallback, useEffect, useMemo } from 'react';

// import axios from 'axios';

import './ActorsCatalog.css'


function ImplementersCatalog (props) {
    // const [ catalog, setCatalog ] = useState (props.data);


    // useEffect (() => {
    //     axios.get ('/api/actors/list').then ((result) => {
    //         setCatalog (result.data);
    //     })
    // }, []);

    const clickElement = useCallback ((element) => {
        // console.log (element)
        props.add (element);
    })

    let catalog_render = useMemo (() => {
        if (props.data) {
            return props.data.map ((c, ci) => {
                return (
                    <div key={ci} className="actor-item" onClick={(e) => { e.stopPropagation (); clickElement (c) }}>
                        <div className="lbl">{c.typeid}</div>
                        <div className="txt">{c.class}</div>
                    </div>
                )
            })
        } else 
            return null;
        
    }, [ clickElement ])

    return (
        <div className="ActorsCatalog">
            <div className="inner">
                <div className="fx animated slideInDown d-1">
                    {catalog_render}
                    <div className="close-catalog" onClick={(e) => { e.stopPropagation (); props.hide () }}>Close</div>
                </div>
            </div>
        </div>
    );
}

export default ImplementersCatalog;