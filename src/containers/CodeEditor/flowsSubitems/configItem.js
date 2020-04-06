import React, { useMemo, useCallback } from 'react';

import CodeMirror from 'react-codemirror';
import ListNVEConfig from './listNVEConfig';
import ListVEConfig from './listVEConfig';
import ListConfig from './listConfig';
import MapConfig from './mapConfig';
import SingleValConfig from './singleValConfig';
import { STRING } from '../../../libs/js/utils';
import yamlUtils from '../../../libs/js/yaml-json';

import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/yaml/yaml';


function ConfigItem (props) {
    const { flowElemId, value, onUpdate, editing, elementSchema } = props;
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
                // console.log ('parsed', parsed)
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
                            flowElemId: flowElemId,
                            config: cfg,
                            name: config_key,
                            value: dat,
                            change: onSingleFieldChange,
                            type: cfg !== undefined ? cfg.type : null
                        };

                    // console.log ('config', config_key, dat)
                    
                    if (cfg && cfg.type === 'list[ve]')
                        single_renderers.push (<ListVEConfig key={j} {...prp} />);
                    else if (cfg && cfg.type === 'list[nve]')
                        single_renderers.push (<ListNVEConfig key={j} {...prp} />);
                    else if (cfg && (cfg.type === 'int' || cfg.type === 'boolean' || cfg.type === 'string'))
                        single_renderers.push (<SingleValConfig key={j} {...prp} />);
                    else if (cfg && (cfg.type === 'list[string]' || cfg.type === 'list[int]'))
                        single_renderers.push (<ListConfig key={j} {...prp} />);
                    else if (cfg && (cfg.type === 'map' || cfg.type === 'map[int]'))
                        single_renderers.push (<MapConfig key={j} {...prp} />);
                    else {
                        // console.log ('config', cfg, dat);
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
                <div className="keyval indent-1">
                    <div className="keyval-key">
                        config <i className="sep far fa-long-arrow-right"></i>
                    </div>
                    {single_renderers}
                </div>
            );
        } else {
            return (
                <>
                    <div className="keyval indent-1">
                        <div className="keyval-key">
                            config <i className="sep far fa-long-arrow-right"></i>
                        </div>
                        {Object.keys(value).map ((it, ii) => {
                            let it_val = value[it];
                            return (
                                <div key={ii} className="keyval indent-1">
                                    <div className="keyval-key level-2">{it}</div>
                                    <div className="indent-1 keyval-val keyval-code">{typeof (it_val) === 'string' ? it_val : STRING.tiny (JSON.stringify (it_val))}</div>
                                </div>
                            )
                        })}
                    </div>
                </>
            );
        }
    }, [ editing, value, onCMChange, onSingleFieldChange, onSingleCMChange, elementSchema ]);

    
    return (
        <>
            {renderer}
        </>
    );
}

export default ConfigItem;