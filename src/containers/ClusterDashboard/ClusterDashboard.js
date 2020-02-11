import React, { Component } from 'react';
import { withRouter } from 'react-router'
// import { Link, Route } from 'react-router-dom'

import Aux from '../../hoc/Aux';
// import FadeinFX from '../../hoc/FadeinFX';
import ClusterSidebar from './ClusterSidebar';
import CodeEditor from '../CodeEditor/CodeEditor';
import ModalPanel from '../../components/ModalPanel/ModalPanel';
import Dialog from '../../components/ModalPanel/Dialog';
import axios from 'axios';

import '../Organizations/Dashboard.css';
import './ClusterDashboard.css';



class ClusterDashboard extends Component {
    state = {
        files: [],
        currentSubview: null,
        editingId: null,
        editingFile: null,
        editorType: null,
        editorFormat: null,
        editorActive: false,

        dialog: null
    }
    initd       = false
    nextUrl     = null
    clusterMap  = { }
    editorRef   = React.createRef ();
    

    componentDidMount () {
        // const match = this.props.match;

        // this.setSubview (match.params.subview);
        this.fetchClusterData ()
    }

    componentDidUpdate (a, b) {
        const match = this.props.match;
        this.setSubview (match.params.subview, false);
    }

    setSubview = (subview) => {
        const current = this.state.currentSubview;

        if (subview !== current) {
            let file_id         = this.clusterMap[subview.replace (/flow@/g, '')],
                editor_type     = 'text',
                editor_format   = 'yml';

            // console.log ('==> subview change', subview, file_id)
            if (subview.startsWith ('flow@'))
                editor_type = 'flow';
            else if (subview === 'implementers' || subview === 'backends')
                editor_type = subview;
            else {
                editor_type = 'text';
            }

            // setTimeout (() => {}, 300)
            
            this.setState ({
                currentSubview: subview,
                editorType: editor_type,
                editorFormat: editor_format
            });
            
            if (file_id) {
                // this.setState ({ editorActive: false });
                if (this.initd) {
                    this.fetchFileData (file_id);
                } else {
                    this.initd = true;
                    setTimeout (() => {
                        this.fetchFileData (file_id);
                    }, 400);
                }
            }
        }
    }

    askDiscardChanges = (status) => {
        let dialog = {
            heading: 'Discard Changes?',
            text: 'Are you sure you want to discard the unsaved changes?',
            clickHandler: this.discardChangesHandler
        }

        this.setState ({
            dialog: dialog
        })
    }

    discardChangesHandler = (confirm) => {
        if (confirm) {
            // console.log ('navigate to', this.nextUrl);
            this.props.history.push (this.nextUrl)
        }
        this.setState ({
            dialog: null
        });
    }

    fetchClusterData = () => {
        const match = this.props.match

        this.props.appBackground (true);
        axios.post ('/api/clusters/fileIndex/', {
            id: match.params.id,
            cid: match.params.cid
        }).then ((response) => {
            if (response.data.files !== undefined) {
                response.data.files.forEach ((it) => {
                    this.clusterMap[it.normalizedName] = it.id;
                    if (it.isDir) {
                        it.files.forEach ((dit) => {
                            this.clusterMap[it.normalizedName + '@' + dit.normalizedName] = dit.id;
                        })
                    }
                });
                this.setState ({
                    files: response.data.files,
                    currentSubview: null
                });
                this.setSubview (match.params.subview);
            }
            this.props.appBackground (false);
        })
    }

    fetchFileData = (id) => {
        this.props.appBackground (true);
        axios.post ('/api/clusters/fileData/' + id).then ((response) => {
            // console.log (response.data);
            this.props.appBackground (false);
            
            this.setState ({
                editingId: id,
                editingFile: response.data,
                editorActive: true
            });

            if (this.editorRef.current) {
                this.editorRef.current.open (response.data);
                this.editorRef.current.refresh ();
            }

            // setTimeout (() => {
            //     this.setState ({ editorActive: true });
            //     if (this.editorRef.current) {
            //         this.editorRef.current.open (response.data);
            //         this.editorRef.current.refresh ();
            //     }
            // }, 300)
        })
    }

    saveFileData = (data) => {
        // console.log ('saveFileData', data)
        this.props.appBackground (true);
        axios.post ('/api/clusters/saveFile/' + this.state.editingId, {
            data: data
        }).then ((response) => {
            // console.log (response.data);
            this.props.appBackground (false);
            this.props.appConfirm ();
            
            if (this.editorRef.current) {
                let editing_file = {
                    path: this.state.editingFile.path,
                    data: data
                }

                this.editorRef.current.open (editing_file)
            }
        })
    }

    click_handler = (status) => {
        console.log ('click_handler', status);

    }

    sidebar_link_click = (event) => {
        if (this.editorRef.current) {
            if (this.editorRef.current.hasChanges ()) {
                this.nextUrl = event.target.getAttribute ('href');
                event.preventDefault ();
                this.askDiscardChanges ();
            }
        }
    }

    
    render () {
        let sidebar_props = {
                clickHandler: this.sidebar_link_click,
                organization: this.props.organization,
                cluster: this.props.cluster,
                files: this.state.files
            },
            modal_flow,
            editor_props = {
                save: this.saveFileData,
                active: this.state.editorActive
            },
            sidebar = (sidebar_props.organization && sidebar_props.cluster) ? <ClusterSidebar { ...sidebar_props } /> : '',
            editor_renderer;

        if (this.state.currentSubview) {
            editor_renderer = (
                <div className="WithSidebar">
                    <CodeEditor code={this.state.editingFile} ref={this.editorRef} {...editor_props} />
                </div>
            )
        }


        if (this.state.dialog) {
            modal_flow = (
                <ModalPanel active={true} clickHandler={this.click_handler}>
                    <Dialog {...this.state.dialog} />
                </ModalPanel>
            );
        }


        return (
            <Aux>
                {sidebar}
                {editor_renderer}
                {modal_flow}
            </Aux>
        );
    }
};

export default withRouter (ClusterDashboard);
