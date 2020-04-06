import React, { useCallback, useMemo, useState, useEffect } from 'react';

import DeleteBtn from './deleteBtn';

function MapConfig (props) {
    const { name, value, change, type } = props;
    const [ model, setModel ] = useState (Object.keys (value).map ((it, j) => {
        return { key: it, value: value[it] }
    }));
    
    
    useEffect (() => {
        let a = [ ...model ],
            m = { };

        a.forEach (it => {
            if (it.key.trim() !== '')
                m[it.key] = it.value;
        });
        change (name, m);
    }, [ model ]);

    const onKeyChange = useCallback ((index, val) => {
        setModel (prevModel => {
            let a = [ ...prevModel ];
            a[index].key = val;
            return a;
        })
    }, [ type ]);

    const onValueChange = useCallback ((index, val) => {
        setModel (prevModel => {
            let a = [ ...prevModel ];
            a[index].value = val;
            return a;
        })
    }, [ type ]);

    const addItem = useCallback (() => {
        setModel (prevModel => {
            let a = [ ...prevModel ],
                n = type === 'map[int]' ? 0 : '';

            a.push ({
                id: Math.random (),
                key: 'newkey',
                value: n
            });

            return a;
        })
    }, [ type ]);

    const removeItem = useCallback ((index) => {
        setModel (prevModel => {
            let a = [ ...prevModel ];
            a.splice (index, 1);
            return a;
        })
    }, [  ]);

    const renderer = useMemo (() => {
        return (
            <div className="keyval indent-1">
                <div className="keyval-key">{name}</div>
                <div className="indent-1 keyval-list">
                    {(model instanceof Array) && model.map ((it, jj) => {
                        return (
                            <div key={jj} className="editor-component-sortable">
                                <div className="editor-component-field">
                                    <div className="sortable-lbl">key</div>
                                    <input type="text" name="key" value={it.key} 
                                        placeholder="key"
                                        onChange={(e) => onKeyChange (jj, e.target.value)} />
                                </div>
                                <div className="editor-component-field">
                                    <div className="sortable-lbl">value</div>
                                    <input type="text" name="value" value={it.value} 
                                        placeholder="value"
                                        onChange={(e) => onValueChange (jj, e.target.value)} />
                                </div>
                                <div className="item-ctrls">
                                    <DeleteBtn position={jj} remove={removeItem} />
                                </div>
                            </div>
                        );
                    })}
                    <div onClick={addItem.bind (this)} className="editor-add-subcomponent pad-left">+ Add item</div>
                </div>
            </div>
        )
    }, [ name, model, onValueChange, onKeyChange, removeItem, addItem ]);


    return renderer;
}

export default MapConfig;