import React, { useState, useCallback, useEffect, useMemo } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';
import FadeinFX from '../../hoc/FadeinFX';

import './ActorsCatalog.css';
import 'react-perfect-scrollbar/dist/css/styles.css';


function ActorsCatalog (props) {
    const { catalog, add, hide } = props;
    const [ searchFilter, setSearchFilter ] = useState ('');
    const [ activeModules, setActiveModules ] = useState ([0]);
    const [ activeItems, setActiveItems ] = useState (catalog);


    

    const filterCatalog = useCallback ((segment) => {
        let activ = [];
        catalog.forEach ((mod, j) => {
            let mod_item = {
                title: mod.title,
                description: mod.description,
                children: []
            }
            mod.children.forEach ((cat, i) => {
                let cat_item = {
                    category: cat.category,
                    children: []
                }
                cat.children.forEach ((item, h) => {
                    if (item.name.toLowerCase().indexOf (segment) !== -1 || item.description.toLowerCase().indexOf (segment) !== -1)
                        cat_item.children.push (item);
                });

                if (cat_item.children.length > 0)
                    mod_item.children.push (cat_item);
            });
            if (mod_item.children.length)
                activ.push (mod_item);
        });
        setActiveItems (activ);
    }, [ catalog ]);

    useEffect (() => {
        let segment = searchFilter.trim().toLowerCase(), timer;
        if (catalog) {
            if (searchFilter.length < 3) {
                setActiveModules ([0]);
                setActiveItems (catalog);
            } else {
                timer = setTimeout (() => {
                    filterCatalog (segment);
                }, 400);
            }
        }

        return (() => {
            if (timer)
                clearTimeout (timer)
        })
    }, [ searchFilter, filterCatalog ]);

    const clickElement = useCallback ((element) => {
        add ({
            id: element.name + Math.floor (Math.random() * 10000),
            class: element.class,
            type: element.type
        });
    }, [ add ]);

    const openModule = useCallback ((index) => {
        setActiveModules ([ index ]);
    }, [ catalog ])

    const onSearch = useCallback ((event) => {
        setSearchFilter (event.target.value)
    }, [])

    const modules_renderer = useMemo (() => {
        return activeItems.map ((modules, i) => {
            return (
                <div key={i} className={"module" + (activeModules.indexOf (i) !== -1 ? ' active' : '')} onClick={openModule.bind (this, i)}>
                    <div className="head">{modules.title}</div>
                </div>
            )
        });
    }, [ activeItems, activeModules ]);

    const items_renderer = useMemo (() => {
        return activeItems.filter ((m, l) => activeModules.indexOf (l) !== -1).map ((module, j) => {
            {return module.children.map ((cat, i) => {
                return (
                    <div key={i} className="type">
                        <div className="head">{cat.category}</div>
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
            })}
        })
    }, [ activeItems, clickElement, activeModules ]);

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
                                    <input type="text" className="textfield search-field" placeholder="Search into implementers" value={searchFilter} onChange={onSearch} />
                                </div>
                            </div>
                            <div className="cols clearfix">
                                <div className="modules">
                                    <PerfectScrollbar options={cm_options}>
                                        <FadeinFX delay={2}>
                                            {modules_renderer}
                                        </FadeinFX>
                                    </PerfectScrollbar>
                                </div>
                                <div className="items">
                                    <PerfectScrollbar options={cm_options}>
                                        <FadeinFX delay={4}>
                                            {items_renderer}
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
    }, [ modules_renderer, activeItems, items_renderer, hide, onSearch, searchFilter ])

    return main_renderer
}

export default ActorsCatalog;