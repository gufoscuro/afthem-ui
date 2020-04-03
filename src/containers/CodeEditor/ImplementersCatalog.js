import React, { useMemo, useState, useCallback, useEffect } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';
import FadeinFX from '../../hoc/FadeinFX';
import './ActorsCatalog.css'
import 'react-perfect-scrollbar/dist/css/styles.css';


function ImplementersCatalog (props) {
    const { add, hide, data } = props;
    const [ searchFilter, setSearchFilter ] = useState ('');
    const [ activeItems, setActiveItems ] = useState (data);


    const filterCatalog = useCallback ((segment) => {
        setActiveItems (data.filter (it => {
            return (
                it.typeid.indexOf (segment) !== -1 || 
                it.class.indexOf (segment) !== -1 || 
                it.name.indexOf (segment) !== -1 || 
                it.description.indexOf (segment) !== -1
            )
        }))
    }, [ data ]);

    useEffect (() => {
        let segment = searchFilter.trim().toLowerCase(), 
            timer;

        if (data) {
            if (searchFilter.length < 3) {
                setActiveItems (data);
            } else {
                timer = setTimeout (() => {
                    filterCatalog (segment);
                }, 300);
            }
        }

        return (() => {
            if (timer)
                clearTimeout (timer)
        })
    }, [ data, searchFilter, filterCatalog ]);

    const catalog_render = useMemo (() => {
        return activeItems ? activeItems.map ((c, ci) => {
            return (
                <div key={ci} className="actor-item" onClick={(e) => { e.stopPropagation (); add (c) }}>
                    <div className="lbl">{c.typeid}</div>
                    <div className="txt bold">{c.class}</div>
                    <div className="txt">{c.description}</div>
                </div>
            )
        }) : null
        
    }, [ activeItems ])

    const main_renderer = useMemo (() => {
        const cm_options = { wheelPropagation: false, suppressScrollX: true };

        return (
            <div className="ActorsCatalog">
                <div className="fog animated fadeIn"></div>
                <div className="sizer">
                    <div className="inner">
                        <div className="content fx animated softZoomIn">
                            <div className="close-trigger" onClick={hide}>
                                <i className="far fa-times"></i>
                            </div>
                            <div className="heading">Actors Catalog</div>
                            <div className="search text-field-holder">
                                <div className="text">
                                    <input type="text" className="textfield search-field" placeholder="Search into implementers" 
                                        value={searchFilter} onChange={e => setSearchFilter (e.target.value)} />
                                </div>
                            </div>
                            <div className="cols">
                                <div className="actors">
                                    <PerfectScrollbar options={cm_options}>
                                        <FadeinFX delay={2}>
                                            {catalog_render}
                                        </FadeinFX>
                                    </PerfectScrollbar>
                                </div>
                                {activeItems.length === 0 && <div className="no-results-layer">
                                    No results for the query: {searchFilter}
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }, [ catalog_render, searchFilter, activeItems ])

    return main_renderer;
}

export default ImplementersCatalog;