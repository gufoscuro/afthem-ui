import React, { Component } from 'react';

import CodeMirror from 'react-codemirror';
// import Aux from '../../hoc/Aux';
import InstrumentsButton from '../../components/InstrumentsButton/InstrumentsButton';
import InstrumentsTab from '../../components/InstrumentsTab/InstrumentsTab';
import FadeinFX from '../../hoc/FadeinFX';
// import ModalPanel from '../../components/ModalPanel/ModalPanel';
// import axios from 'axios';
import yamlUtils from '../../libs/js/yaml-json';

import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/properties/properties';
// import 'codemirror/mode/markdown/markdown';

import 'codemirror/lib/codemirror.css';
import './theme-neo.css';
import './CodeEditor.css';



class CodeEditor extends Component {
    editor = React.createRef ();
    instance = null;
    state = {
        code: '',
        mode: 'yaml',
        name: null,
        saveDisabled: true,
        pushDisabled: true,

        codeViewActive: true,
        visualViewActive: false,
        visualViewDisabled: false
    }
    untouched = ''
    

    componentDidMount () {
        // this.updateCode (this.props.code);
    }

    componentDidUpdate (a, b) {
        
    }

    checkInit = () => {
        if (this.instance === null) {
            if (this.editor.current) {
                this.instance = this.editor.current.getCodeMirror ();
            }
        }
    }

	value = (code) => {
        this.checkInit ();

        if (code !== undefined) {
            if (this.instance) {
                this.instance.doc.setValue (code);
                // this.refresh ();
            }
        } else if (this.instance)
		    return this.instance.doc.getValue ()
	};

	refresh = () => {
        this.checkInit ();
		return this.instance.refresh ()
    };
    
    updateCode = (code) => {
        let has_changes = (code !== this.untouched);

        this.setState ({
            code: code,
            saveDisabled: !has_changes
        })
    }

    clickHandler = (status) => {
        console.log ('instruments click handler', status);

        if (status.action === 'save') {
            if (typeof (this.props.save) === 'function')
                this.props.save (this.value ());
        }

        else if (status.action === 'show-code') {
            if (this.state.codeViewActive === false)
                this.setState ({
                    codeViewActive: true,
                    visualViewActive: false
                });
                this.refresh ();
                setTimeout (() => { this.refresh () }, 10);
        }

        else if (status.action === 'show-visual') {
            if (this.state.visualViewActive === false)
                this.setState ({
                    visualViewActive: true,
                    codeViewActive: false
                });
        }
    }

    hasVisualEditor = (path) => {
        let bool = false;

        if (path.includes ('/flows/'))
            bool = true;

        else if (path.includes ('implementers.yml'))
            bool = true;

        else if (path.includes ('backends.yml'))
            bool = true;

        return bool;
    }

    hasChanges = () => {
        return this.state.code !== this.untouched;
    }

    open = (file) => {
        // console.log ('open', file);
        let editor_mode     = 'yaml',
            visual_editor   = this.hasVisualEditor (file.path),
            splt            = file.path.split ('/');

        if (file.path.endsWith ('.xml'))
            editor_mode = 'xml';
        if (file.path.endsWith ('.properties'))
            editor_mode = 'text/x-ini';

        this.value (file.data);
        this.untouched = this.value ();


        console.log ('visual editor', this.hasVisualEditor (file.path));

        // if (editor_mode === 'yaml') {
        //     let a = yamlUtils.toJSON (this.value ());
        //     console.log ('toJSON', a);
        //     console.log ('toYaml', yamlUtils.toYAML (a));
        // }
        let visual_e_state = {
            visualViewDisabled: !visual_editor,
            // codeViewActive: !visual_editor,
            // visualViewActive: visual_editor
        }

        // if (visual_editor === false && this.state.visualViewActive) {
            
        // } else {
        //     visual_e_state.codeViewActive = true;
        //     visual_e_state.visualViewActive = false;
        // }



        this.setState ({...{
            mode: editor_mode,
            code: file.data,
            saveDisabled: true,
            name: splt[splt.length - 1]
        }, ...visual_e_state});
    }

    render () {
        let options = {
            viewportMargin: Infinity,
            styleActiveLine: true,
            lineWrapping: true,
            lineNumbers: true, 
            theme: 'neo',
            mode: this.state.mode
        },
        instruments_props = {
            clickHandler: this.clickHandler
        }

        return (
            <div className="CodeEditor">
                <div className="Instruments animated slideInDown">
                    <div className="instruments-holder clearfix">
                        <div className="btn-holder view-tabs">
                            <InstrumentsTab label="Code" action="show-code" active={this.state.codeViewActive} {...instruments_props} />
                            <InstrumentsTab label="Visual" action="show-visual" active={this.state.visualViewActive} disabled={this.state.visualViewDisabled} {...instruments_props} />
                        </div>
                        <div className="btn-holder instruments">
                            <InstrumentsButton label="Save" icon="save" action="save" disabled={this.state.saveDisabled} {...instruments_props} />
                            <InstrumentsButton label="Push" icon="code-commit" action="push" disabled={this.state.pushDisabled} {...instruments_props} />
                        </div>
                    </div>
                </div>
                <div className={"EditorArea" + (this.props.active ? ' active' : '')}>
                    <FadeinFX>
                        <div className={"CodeArea" + (this.state.codeViewActive ? ' active' : '')}>
                            <CodeMirror 
                                ref={this.editor} 
                                value={this.state.code} 
                                onChange={this.updateCode.bind (this)} 
                                options={options} />
                        </div>
                        <div className={"VisualArea" + (this.state.visualViewActive ? ' active' : '')}>Visual</div>
                    </FadeinFX>
                </div>
            </div>
        );
    }
}

export default CodeEditor;