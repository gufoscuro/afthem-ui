import React, { useMemo, useCallback } from 'react';

import CodeMirror from 'react-codemirror';
import ListNVEConfig from './listNVEConfig';
import ListVEConfig from './listVEConfig';
import ListConfig from './listConfig';
import SingleValConfig from './singleValConfig';
import { STRING } from '../../../libs/js/utils';
import yamlUtils from '../../../libs/js/yaml-json';

import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/yaml/yaml';


function ConfigItem (props) {
    const { value, onUpdate, editing, elementSchema } = props;
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
    }, [ value, onUpdate ]);

    const onSingleCMChange = useCallback ((key, data) => {
        let configs = { ...value };

        if (timer)
            clearTimeout (timer);

        timer = setTimeout (() => {
            let parsed = null,
                yaml = data;
            
            try {
                parsed = yamlUtils.toJSON (yaml);
                // configs[key] = parsed;
                // onUpdate ('config', configs);
            } catch (e) {

            }
            if (parsed) {
                configs[key] = parsed;
                // console.log ('onSingleCMChange result:', key, configs)
                onUpdate ('config', configs);
            }
            else
                console.log ('error message somewhere');
        }, 300)
    }, [ value, onUpdate ]);

    const onSingleFieldChange = useCallback ((key, val) => {
        let configs = { ...value };

        // console.log ('onSingleFieldChange', key, val)

        configs[key] = val;
        onUpdate ('config', configs);
    }, [ value, onUpdate ]);


    
    const renderer = useMemo (() => {
        let single_renderers = [],
            cfg_schema = elementSchema ? elementSchema.config : null;

        let options = {
            styleActiveLine: true,
            lineWrapping: true,
            lineNumbers: true, 
            theme: 'neo',
            mode: 'yaml'
        }

        if (editing) {
            if (cfg_schema) {
                Object.keys (value).forEach ((config_key, j) => {
                    let cfg = cfg_schema[config_key],
                        dat = value[config_key],
                        prp = {
                            config: cfg,
                            name: config_key,
                            value: dat,
                            change: onSingleFieldChange,
                            type: cfg !== undefined ? cfg.type : null
                        };

                    
                    if (cfg && cfg.type === 'list[ve]')
                        single_renderers.push (<ListVEConfig key={j} {...prp} />);
                    else if (cfg && cfg.type === 'list[nve]')
                        single_renderers.push (<ListNVEConfig key={j} {...prp} />);
                    else if (cfg && (cfg.type === 'int' || cfg.type === 'boolean' || cfg.type === 'string'))
                        single_renderers.push (<SingleValConfig key={j} {...prp} />);
                    else if (cfg && (cfg.type === 'list[string]' || cfg.type === 'list[int]'))
                        single_renderers.push (<ListConfig key={j} {...prp} />);
                    else {
                        console.log ('config', cfg, dat);
                        single_renderers.push (
                            <div key={j}>
                                <div className="lbl indent-2">{config_key}</div>
                                <CodeMirror 
                                    value={yamlUtils.toYAML (dat)} 
                                    onChange={(src) => { onSingleCMChange (config_key, src) }} 
                                    options={options} />
                            </div>
                        );
                    }
                })
            } else {
                single_renderers = (
                    <CodeMirror 
                        value={yamlUtils.toYAML (value)} 
                        onChange={onCMChange} 
                        options={options} />
                )
            }
            return (
                <>
                    <span className="lbl indent-1">config <i className="sep far fa-long-arrow-right"></i></span>
                    {single_renderers}
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
    }, [ editing, value, onCMChange, onSingleFieldChange, onSingleCMChange, elementSchema ])

    return (
        <>
            {renderer}
        </>
    );
}

export default ConfigItem;