import React, { Component } from 'react';
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

import Aux from '../../hoc/Aux';
import FadeinFX from '../../hoc/FadeinFX';
import ModalPanel from '../../components/ModalPanel/ModalPanel';
import AddCluster from './AddCluster';
import ClusterBlock from './ClusterBlock';
import Dialog from '../../components/ModalPanel/Dialog';

import '../Organizations/Dashboard.css'



class Clusters extends Component {
    state = {
        clusters: [],
        createCluster: false,
        dialog: null
    }
    

    askRemoveCluster = (status) => {
        let dialog = {
            heading: 'Remove Cluster?',
            text: 'Are you sure you want to remove the cluster "' + status.name + '"?',
            clickHandler: this.removeClusterHandler,
            data: {
                id: status.id
            }
        }

        this.setState ({
            dialog: dialog
        })
    }

    removeClusterHandler = (bool) => {
        if (bool === true) {
            let dialog_data = { ...this.state.dialog }
            if (dialog_data && dialog_data.data && this.props.organization) {
                this.props.appBackground (true);
                this.props.axiosInstance.post ('/api/clusters/remove/' + dialog_data.data.id, {
                    oid: this.props.organization.id
                }).then ((response) => {
                    this.fetchClusters ();
                    this.props.appBackground (false);
                    this.props.appConfirm ();
                    this.setState ({
                        dialog: null
                    })
                }).catch (() => {
                    this.props.appBackground (false);
                    this.setState ({
                        dialog: null
                    })
                })
            }
        } else {
            this.setState ({
                dialog: null
            })
        }
    }

    editCluster = (id) => {
        let dialog = {
            heading: 'Nope!',
            text: 'Sorry, not done yet',
            clickHandler: this.editClusterHandler,
            data: {
                id: id
            }
        }

        this.setState ({
            dialog: dialog
        })
    }

    editClusterHandler = (bool) => {
        this.setState ({
            dialog: null
        })
    }

    fetchClusters = () => {
        const match = this.props.match

        this.props.appBackground (true);
        this.props.axiosInstance.get ('/api/clusters/list/' + match.params.id).then ((response) => {
            // console.log (response.data)
            this.setState ({
                clusters: response.data
            });
            this.props.appBackground (false);
        })
    }

    createClusterOutcome = (status) => {
        if (status.action === 'cancel-cluster-edits') {
            this.setState ({ createCluster: false });
        } else {
            const cluster_data = { ...status.data };
            this.props.appBackground (true);
            this.props.axiosInstance.post ('/api/clusters/add/' + this.props.organization.id, cluster_data).then ((response) => {
                this.fetchClusters ();
                this.props.appBackground (false);
                this.props.appConfirm ();
                this.setState ({ createCluster: false })
            }).catch (e => {
                status.error (e);
                this.props.appBackground (false);
            })
        }
    }
    
    componentDidMount () {
        this.props.clusterHandler (null);
        this.fetchClusters ();
    }

    componentDidUpdate (a, b) {
        
    }

    click_handler = (status) => {
        console.log ('click_handler', status);

        if (status.action === 'select-cluster') {
            let hit = null
            this.state.clusters.forEach ((cluster) => {
                if (status.itemId === cluster.id)
                    hit = cluster;
            });
            if (hit)
                this.props.clusterHandler (hit);
        }

        else if (status.action === 'create-cluster') {
            this.setState ({
                createCluster: true
            })
        }

        else if (status.action === 'cancel-cluster') {
            this.setState ({
                createCluster: false
            })
        }

        else if (status.action === 'save-cluster') {
            this.saveCluster ();
        }

        else if (status.action === 'remove-cluster') {
            this.askRemoveCluster (status);
        }

        else if (status.action === 'edit-cluster') {
            this.editCluster (status.id);
        }
    }

    
    render () {
        let clusters,
            add_cluster,
            modal_flow,
            basic_props = {
                organization: this.props.organization,
                clickHandler: this.click_handler
            };

        if (this.state.createCluster) {
            let m_props = {
                data: null,
                outcome: this.createClusterOutcome
            }
            modal_flow = (
                <ModalPanel active={true} clickHandler={this.click_handler}>
                    <AddCluster { ...m_props } />
                </ModalPanel>
            );
        } else
            modal_flow = (<ModalPanel active={false} />);


        if (this.state.dialog) {
            modal_flow = (
                <ModalPanel active={true} clickHandler={this.click_handler}>
                    <Dialog {...this.state.dialog} />
                </ModalPanel>
            );
        }

        if (this.state.clusters.length)
            clusters = this.state.clusters.map ((element, index) =>
                <ClusterBlock { ...element } { ...basic_props } {...{ index: index }} key={element.id} />
            );

        add_cluster = (
            <div className="project-item add-item sector-block">
                <div className="hero clearfix">
                    <div className="icon bg-color-disabled">
                        {/* <i className="far fa-plus"></i> */}
                    </div>
                    <div className="project-status">
                        <div className="head">Create</div>
                        <div className="desc">A new cluster</div>
                    </div>
                </div>
                <div className="hover-ctrls">
                    <div className="ctrls">
                        <div className="ctrls-fx softFadeInUp">
                            <div onClick={this.click_handler.bind (this, { action: 'create-cluster' })} className="circle-button">
                                <i className="far fa-plus"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        

        return (
            <Aux>
                <div className="Dashboard">
                    <h2 className="heading">
                        <Link to="/">
                            Organization {this.props.organization ? (': ' + this.props.organization.name) : ''}
                        </Link>
                        <span className="spacer-path">/</span>
                        <span>Clusters</span>
                    </h2>
                    <FadeinFX>
                        <div className={"items-blocks clearfix  "}>
                            {clusters}
                            {add_cluster}
                        </div>
                    </FadeinFX>
                </div>
                {modal_flow}
            </Aux>
        );
    }
};

export default withRouter (Clusters);
