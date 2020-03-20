import React, { Component } from 'react';
import { withRouter } from 'react-router'
// import { Link, Route } from 'react-router-dom'

import Aux from '../../hoc/Aux';
// import FadeinFX from '../../hoc/FadeinFX';
import ClusterSidebar from './ClusterSidebar';
import CodeEditor from '../CodeEditor/CodeEditor';
import ModalPanel from '../../components/ModalPanel/ModalPanel';
import AddFlow from './AddFlow';
import AddCommit from './AddCommit';
import Dialog from '../../components/ModalPanel/Dialog';

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

        dialog: null,
        actorsSchema: null,
        createFlow: false,
        commitChanges: false
    }
    initd       = false
    nextfilenm  = null
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
        this.props.axiosInstance.post ('/api/clusters/fileIndex/', {
            oid: match.params.id,
            cid: match.params.cid
        }).then ((response) => {
            if (response.data.cluster)
                this.props.clusterHandler (response.data.cluster);
            if (response.data.organization)
                this.props.orgHandler (response.data.organization);

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

    fetchActorsSchema = () => {
        const match = this.props.match;
        return new Promise ((resolve, reject) => {
            if (this.state.actorsSchema === null) {
                this.props.axiosInstance.post ('/api/clusters/getImplementers/', {
                    id: match.params.id,
                    cid: match.params.cid
                }).then ((response) => {
                    let ac_map = { };
                    response.data.implementers.forEach ((it) => {
                        let data    = response.data.actors[it.class];
                        console.log ()
                        if (data !== undefined) {
                            ac_map[it.typeid] = { ...it, ...data };
                        } else
                            console.warn ('AfthemUI: Missing schema match:', it.typeid);
                    });

                    resolve (ac_map);
                })
            } else
                resolve (this.state.actorsSchema);
        })
    }

    fetchFileData = (id) => {
        this.props.appBackground (true);
        this.props.axiosInstance.post ('/api/clusters/fileData/' + id).then ((response) => {
            // console.log (response.data);
            this.props.appBackground (false);
            this.fetchActorsSchema().then ((schema) => {
                this.setState ({
                    editingId: id,
                    editingFile: response.data,
                    editorActive: true,
                    actorsSchema: schema
                })

                if (this.editorRef.current) {
                    this.editorRef.current.open (response.data, schema);
                    this.editorRef.current.refresh ();
                }
            })
        })
    }

    saveFileData = (data) => {
        // console.log ('saveFileData', data)
        this.props.appBackground (true);
        this.props.axiosInstance.post ('/api/clusters/saveFile/' + this.state.editingId, {
            data: data
        }).then ((response) => {
            // console.log (response.data);
            this.props.appBackground (false);
            this.props.appConfirm ();
            this.fetchClusterData ();
            
            if (this.editorRef.current) {
                let editing_file = {
                    path: this.state.editingFile.path,
                    data: data
                }

                this.editorRef.current.open (editing_file)
            }
        })
    }

    askRemoveFlow = (status) => {
        let dialog = {
            heading: 'Remove Flow?',
            text: 'Are you sure you want to remove this flow?',
            clickHandler: this.removeFlowHandler
        }

        this.setState ({
            dialog: dialog
        })
    }

    removeFlowHandler = (confirm) => {
        if (confirm) {
            const match = this.props.match;
            this.props.appBackground (true);
            this.props.axiosInstance.post ('/api/clusters/removeFlow/', {
                id: match.params.id,
                cid: match.params.cid,
                filename: this.nextfilenm
            }).then ((response) => {
                this.props.history.push (this.nextUrl)
                this.props.appBackground (false);
                this.props.appConfirm ();
                this.nextUrl = null;
                this.nextfilenm = null;
                this.fetchClusterData ();
            })
            
        } else {
            this.nextUrl = null;
            this.nextfilenm = null;
        }
        this.setState ({
            dialog: null
        });
    }

    createFlowHandler = (status) => {
        // console.log ('createFlowHandler', status)
        if (status.action === 'confirm') {
            const match = this.props.match;
            this.props.appBackground (true);
            this.props.axiosInstance.post ('/api/clusters/createFlow/', {
                id: match.params.id,
                cid: match.params.cid,
                filename: status.data.name
            }).then ((response) => {
                this.props.history.push (this.nextUrl + status.data.name)
                this.props.appBackground (false);
                this.props.appConfirm ();
                this.nextUrl = null;
                this.nextfilenm = null;
                this.fetchClusterData ();
                this.setState ({ createFlow: false });
            }).catch (e => {
                status.error (e);
                this.props.appBackground (false);
            });
        } else {
            this.setState ({ createFlow: false });
            this.nextUrl = null;
            this.nextfilenm = null;
        }
    }

    commitChangesHandler = (status) => {
        // console.log ('commitChangesHandler', status)
        if (status.action === 'confirm') {
            const match = this.props.match;
            this.props.appBackground (true);
            this.props.axiosInstance.post ('/api/clusters/commit/', {
                id: match.params.id,
                cid: match.params.cid,
                message: status.data.message
            }).then ((response) => {
                this.props.appBackground (false);
                this.props.appConfirm ();
                this.fetchClusterData ();
                this.setState ({ commitChanges: false });
            }).catch (e => {
                status.error (e);
                this.props.appBackground (false);
            })
        } else
            this.setState ({ commitChanges: false });
    }

    click_handler = (status) => {
        console.log ('click_handler', status);

    }

    sidebar_link_click = (event, data) => {
        if (data !== undefined) {
            // console.log (data)
            if (data.action === 'remove') {
                event.preventDefault ();
                event.stopPropagation ();
                this.nextUrl = data.nextUrl;
                this.nextfilenm = data.filename;
                this.askRemoveFlow ();
            }

            else if (data.action === 'create-flow') {
                event.preventDefault ();
                this.setState ({ createFlow: true });
                this.nextUrl = data.nextUrl
            }

            else if (data.action === 'commit') {
                this.setState ({ commitChanges: true });
                // this.askCommitChanges ();
            }
        }
        
        
        else if (this.editorRef.current) {
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
            basic_props = {
                oid: this.props.match.params.id,
                cid: this.props.match.params.cid,
                axiosInstance: this.props.axiosInstance
            },
            editor_props = {
                save: this.saveFileData,
                active: this.state.editorActive
            },
            sidebar = (sidebar_props.organization && sidebar_props.cluster) ? <ClusterSidebar { ...sidebar_props } /> : '',
            editor_renderer;

        if (this.state.currentSubview) {
            editor_renderer = (
                <div className="WithSidebar">
                    <CodeEditor code={this.state.editingFile} ref={this.editorRef} {...editor_props} {...basic_props} />
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

        else if (this.state.createFlow) {
            modal_flow = (
                <ModalPanel active={true} clickHandler={this.click_handler}>
                    <AddFlow outcome={this.createFlowHandler} />
                </ModalPanel>
            );
        }

        else if (this.state.commitChanges) {
            modal_flow = (
                <ModalPanel active={true} clickHandler={this.click_handler}>
                    <AddCommit outcome={this.commitChangesHandler} />
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
