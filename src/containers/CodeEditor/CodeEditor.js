import React, { Component } from 'react';

import CodeMirror from 'react-codemirror';
// import Aux from '../../hoc/Aux';
import InstrumentsButton from '../../components/InstrumentsButton/InstrumentsButton';
import InstrumentsTab from '../../components/InstrumentsTab/InstrumentsTab';
import ImplementersEditor from './ImplementersEditor';
import FlowsEditor from './FlowsEditor';
import BackendsEditor from './BackendsEditor';
import FadeinFX from '../../hoc/FadeinFX';

// import ModalPanel from '../../components/ModalPanel/ModalPanel';

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
        visualViewDisabled: false,
        visualMode: null,
        visualCode: null,
        actorsSchema: null
    }
    untouched = ''
    refreshV_handler
    addImplementer_handler
    

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
	}

	refresh = () => {
        this.checkInit ();
		return this.instance.refresh ()
    }
    
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
                this.codeToVisual ();
        }
    }

    // editorClickHandler = (status) => {
    //     console.log ('editorClickHandler', status)
    // }

    guessEditorType = (path) => {
        let result = {
            visual: false,
            type: null
        }

        if (path.includes ('/flows/')) {
            result.visual = true;
            result.type = 'flow';
        }

        else if (path.includes ('implementers.yml')) {
            result.visual = true;
            result.type = 'implementers';
        }

        else if (path.includes ('backends.yml')) {
            result.visual = true;
            result.type = 'backends';
        }

        return result;
    }

    hasChanges = () => {
        return this.state.code !== this.untouched;
    }

    open = (file, actorsSchema) => {
        // console.log ('open', file);
        let editor_mode     = 'yaml',
            veditor_guess   = this.guessEditorType (file.path),
            visual_editor   = veditor_guess.visual,
            splt            = file.path.split ('/'),
            visualCode      = null;

        if (file.path.endsWith ('.xml'))
            editor_mode = 'xml';
        if (file.path.endsWith ('.properties'))
            editor_mode = 'text/x-ini';

        this.value (file.data);
        this.untouched = this.value ();

        if (visual_editor) {
            visualCode = yamlUtils.toJSON (this.value ());
            // console.log (visualCode)
        }

        if (this.state.visualMode !== veditor_guess.type) {
            this.refreshV_handler = null;
            this.addImplementer_handler = null;
        }

        let visual_e_state = {
            visualViewDisabled: !visual_editor,
            codeViewActive: !visual_editor,
            visualViewActive: visual_editor,
            visualMode: veditor_guess.type,
            visualCode: visualCode,
            actorsSchema: actorsSchema
        }



        this.setState ({...{
            mode: editor_mode,
            code: file.data,
            saveDisabled: true,
            name: splt[splt.length - 1]
        }, ...visual_e_state});

        if (visual_editor)
            this.codeToVisual ();
    }
    

    editorRefreshHook = (handler) => {
        if (typeof (handler) === 'function')
            this.refreshV_handler = handler;
    }

    refreshVisual = (code) => {
        if (typeof (this.refreshV_handler) === 'function')
            this.refreshV_handler (code);
    }

    visualToCode = (code) => {
        // console.log ('code has been updated', code);
        let yaml = yamlUtils.toYAML (code);
        this.updateCode (yaml);
        this.value (yaml)
    }

    codeToVisual = () => {
        let code = this.state.code;
        try {
            // console.log (code);
            code = yamlUtils.toJSON (this.value ());
            this.setState ({
                visualCode: code
            });
            this.refreshVisual (code)
        } catch (e) {
            this.visualToCode (this.state.visualCode);
            console.log ('something wrong while parsing yaml');
        }
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
        basic_props = {
            oid: this.props.oid,
            cid: this.props.cid,
            axiosInstance: this.props.axiosInstance
        },
        editor_props = {
            data: this.state.visualCode,
            update: this.visualToCode,
            addHook: this.addImplementerHook,
            refreshHook: this.editorRefreshHook,
            test: this.state.actorsSchema
        },
        instruments_props = {
            clickHandler: this.clickHandler
        },
        visual_editor;

        if (this.state.visualMode) {
            if (this.state.visualMode === 'implementers') {
                visual_editor = (<ImplementersEditor {...editor_props} {...basic_props} />);
            }
            else if (this.state.visualMode === 'flow') {
                visual_editor = (<FlowsEditor {...editor_props} {...basic_props} />);
            }
            else if (this.state.visualMode === 'backends') {
                visual_editor = (<BackendsEditor {...editor_props} {...basic_props} />);
            }
            else
                visual_editor = "Visual Editor: " + this.state.visualMode;
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
                            {/* <InstrumentsButton label="Push" icon="code-commit" action="push" disabled={this.state.pushDisabled} {...instruments_props} /> */}
                        </div>
                    </div>
                </div>
                <div className={"EditorArea" + (this.props.active ? ' active' : '')}>
                    <div className={"CodeArea" + (this.state.codeViewActive ? ' active' : '')}>
                    <FadeinFX>
                        <CodeMirror 
                            ref={this.editor} 
                            value={this.state.code} 
                            onChange={this.updateCode.bind (this)} 
                            options={options} />
                        </FadeinFX>
                    </div>
                    <div className={"VisualArea" + (this.state.visualViewActive ? ' active' : '')}>
                        {visual_editor}
                    </div>
                </div>
            </div>
        );
    }
}

export default CodeEditor;