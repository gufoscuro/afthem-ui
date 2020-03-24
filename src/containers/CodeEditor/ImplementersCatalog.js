import React, { useCallback, useMemo } from 'react';

import './ActorsCatalog.css'


function ImplementersCatalog (props) {
    const { add, hide, data } = props;
    
    
    const clickElement = useCallback ((element) => {
        add (element);
    }, [ add ])

    let catalog_render = useMemo (() => {
        if (data) {
            return data.map ((c, ci) => {
                return (
                    <div key={ci} className="actor-item" onClick={(e) => { e.stopPropagation (); clickElement (c) }}>
                        <div className="lbl">{c.typeid}</div>
                        <div className="txt">{c.class}</div>
                    </div>
                )
            })
        } else 
            return null;
        
    }, [ clickElement, data ])

    return (
        <div className="ActorsCatalog">
            <div className="inner">
                <div className="fx animated slideInDown d-1">
                    {catalog_render}
                    <div className="close-catalog" onClick={(e) => { e.stopPropagation (); hide () }}>Close</div>
                </div>
            </div>
        </div>
    );
}

export default ImplementersCatalog;