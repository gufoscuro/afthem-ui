import React, { useState, useMemo, useCallback } from 'react';

import CodeMirror from 'react-codemirror';
import { STRING } from '../../../libs/js/utils';
import yamlUtils from '../../../libs/js/yaml-json';

import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/yaml/yaml';


function ConfigItem (props) {
    const { value, onUpdate, editing } = props;
    let timer = null

    const onCMChange = useCallback ((data) => {
        if (timer)
            clearTimeout (timer);

        timer = setTimeout (() => {
            let parsed = null,
                yaml = data;
            try {
                parsed = yamlUtils.toJSON (yaml)
            } catch (e) {

            }
            if (parsed) {
                console.log ('parsed', parsed)
                onUpdate ('config', parsed);
            }
            else
                console.log ('error message somewhere');
        }, 300)
    }, [ value, onUpdate ])
    
    const renderer = useMemo (() => {
        let options = {
            styleActiveLine: true,
            lineWrapping: true,
            lineNumbers: true, 
            theme: 'neo',
            mode: 'yaml'
        }

        if (editing) {
            return (
                <>
                    <span className="lbl">config <i className="sep far fa-long-arrow-right"></i></span>
                    <CodeMirror 
                        value={yamlUtils.toYAML (value)} 
                        onChange={onCMChange} 
                        options={options} />
                </>
            );
        } else {
            return (
                <>
                    <div className="keyval indent-1">config <i className="sep far fa-long-arrow-right"></i></div>
                    {Object.keys(value).map ((it, ii) => {
                        let it_val = value[it];
                        return (
                            <div key={ii} className="keyval indent-2">
                                <div>{it}</div>
                                <div className="indent-1">{typeof (it_val) === 'string' ? it_val : STRING.tiny (JSON.stringify (it_val))}</div>
                            </div>
                        )
                    })}
                </>
            );
        }
    }, [ editing, value ])

    return (
        <>
            {renderer}
        </>
    );
}

export default ConfigItem;