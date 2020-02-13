import React, { useState, useCallback, useEffect, useMemo } from 'react';

// import PerfectScrollbar from 'react-perfect-scrollbar';
import axios from 'axios';

import './ActorsCatalog.css'


function ActorsCatalog (props) {
    const [ catalog, setCatalog ] = useState (null);


    useEffect (() => {
        axios.get ('/api/actors/list').then ((result) => {
            setCatalog (result.data);
        })
    }, []);

    const clickElement = useCallback ((element) => {
        // console.log (element)
        props.add ({
            id: element.name + Math.floor(Math.random() * 10000),
            class: element.class,
            type: element.type
        });
    }, [ catalog ])

    const toggleCategory = useCallback ((index) => {
        let a = { ...catalog },
            c = a.children[index];

        c.active = (c.active === undefined || c.active === false) ? true : false;
        setCatalog (a);
    }, [ catalog ])

    let catalog_render = useMemo (() => {
        if (catalog) {
            return catalog.children.map ((cat, i) => {
                return (
                    <div key={i} className={"cat" + (cat.active ? ' active' : '')}>
                        <div className="head" onClick={(e) => { e.stopPropagation (); toggleCategory (i) }}>{cat.category}</div>
                        <div className="children">
                            {cat.children.map ((c, ci) => {
                                return (
                                    <div key={i + "_" + ci} className="actor-item" onClick={(e) => { e.stopPropagation (); clickElement ({...c, ...{ type: cat.category }}) }}>
                                        <div className="lbl">{c.name}</div>
                                        <div className="txt">{c.description}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            });
        } else 
            return null;
        
    }, [ catalog, clickElement, toggleCategory ])

    return (
        <div className="ActorsCatalog">
            <div className="inner">
                <div className="fx animated slideInDown d-1">
                    {/* <PerfectScrollbar options={{ wheelPropagation: false }}> */}
                        {catalog_render}
                        <div className="close-catalog" onClick={(e) => { e.stopPropagation (); props.hide () }}>Close</div>
                    {/* </PerfectScrollbar> */}
                </div>
            </div>
        </div>
    );
}

export default ActorsCatalog;