import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// import { Route, Redirect } from 'react-router-dom';

import './App.css';

import Organizations from './containers/Organizations/Organizations';
import Clusters from './containers/Clusters/Clusters';
import ClusterDashboard from './containers/ClusterDashboard/ClusterDashboard';
import Admin from './containers/Admin/Admin';
import AdminOrg from './containers/Admin/AdminOrg';
import Confirm from './components/ModalPanel/Confirm';
import Login from './containers/Login/Login';
import SmartRoute from './components/ProtectedRoute/SmartRoute';
import Timeout from './components/ErrorOverlay/Timeout';
import Layout from './Layout';
// import TestList from './containers/TestList/TestList';

// import Sidebar from './components/Sidebar/Sidebar';

// import ErrorOverlay from './components/ErrorOverlay/ErrorOverlay';
// import MaintenanceMode from './components/ErrorOverlay/MaintenanceMode';

import storage from './libs/js/storage';
import Cookies from 'js-cookie';
import axios from 'axios';

class App extends Component {
	state = {
		isUserAuthenticated: true,
        background: false,
		confirm: false,
		timeout: false,
        organization: null,
		cluster: null,
		sidebar_busy: false,
		fetching_user: false,
		user_nfo: null
    }
	confirm_timer = null
	axiosInstance = axios.create ({
		headers: { 'X-Custom-Header': 'afthem-ui' }
	})


	constructor (props) {
		super (props);
		this.axiosInstance.defaults.timeout = 10000;
		this.axiosInstance.interceptors.response.use ((response) => response, (error, n) => {
			if (error.response !== undefined) {
				const { status } = error.response;
				if (status === 401) {
					this.setState ({
						background: false,
						isUserAuthenticated: false,
						user_nfo: null
					})
				}
			} else {
				this.setState ({
					background: false,
					timeout: true,
					sidebar_busy: true
				})
			}

			return Promise.reject (error);
		});
	}


	componentDidMount () {
        let organization    = storage.get ('organization'),
            cluster         = storage.get ('cluster');

		if (organization)
            this.setState ({ organization: organization });
            
        if (cluster)
			this.setState ({ cluster: cluster });
	}
	
	app_authenticated = bool => this.setState ({ isUserAuthenticated: bool });

	app_background = bool => this.setState ({ background: bool });

	app_locked = bool => this.setState ({ sidebar_busy: bool });

    app_confirm = () => {
        if (this.confirm_timer) {
            clearTimeout (this.confirm_timer);
            this.confirm_timer = null;
        }

        this.setState ({ confirm: true });
        this.confirm_timer = setTimeout (() => {
            this.setState ({ confirm: false });
        }, 1000);
	}
	
	

	organization_handler = (organization) => {
		if (organization && organization !== undefined) {
			this.setState ({ organization: organization });
			storage.set ('organization', organization)
		} else {
			this.setState ({ organization: null });
			storage.remove ('organization')
		}
    }
    
    cluster_handler = (cluster) => {
        if (cluster && cluster !== undefined) {
			this.setState ({ cluster: cluster });
			storage.set ('cluster', cluster)
		} else {
			this.setState ({ cluster: null });
			storage.remove ('cluster')
		}
	}

	fetchUserInfo = () => {
        this.setState ({ fetching_user: true })
        return new Promise ((resolve, reject) => {
			if (Cookies.get ('auth') === undefined) {
				this.setState ({ isUserAuthenticated: false, fetching_user: false });
				reject ();
			} else
				this.axiosInstance.get ('/api/users/load').then ((payload) => {
					this.setState ({
						isUserAuthenticated: true,
						fetching_user: false,
						user_nfo: payload.data
					});
					resolve ();
				}).catch (reject);
        })
    };

	sidebar_clickhandler = (action, ev) => {
		console.log ('===>', 'sidebar_clickhandler', action);

		// if (action === 'logout')
		// 	this.app_logout ();
	}

	render () {
		let basic_props = {
				isUserAuthenticated: this.state.isUserAuthenticated,
				axiosInstance: this.axiosInstance,
                appBackground: this.app_background,
				appConfirm: this.app_confirm,
				appLocked: this.app_locked,
				appAuthenticated: this.app_authenticated,
                orgHandler: this.organization_handler,
				clusterHandler: this.cluster_handler,
				fetchingUser: this.state.fetching_user,
				fetchUserInfo: this.fetchUserInfo,
                organization: this.state.organization,
				cluster: this.state.cluster,
				user: this.state.user_nfo
			},
			route_p = {
				isUserAuthenticated: this.state.isUserAuthenticated
			},
			side_props = {
                background: this.state.background,
				busy: this.state.sidebar_busy

				// organization: this.state.organization,
				// clickHandler: this.sidebar_clickhandler,
				// user: this.state.user_nfo
			};


		return (
			<Router>
				<div className={"App" + (this.state.sidebar_busy ? ' locked' : '')}>
					<Layout {...basic_props} {...side_props}>
						<SmartRoute exact path="/login" {...route_p} render={props =>
							<Login {...basic_props} {...side_props} {...props} />
						} />
						
						<SmartRoute exact path="/" authenticated {...route_p} render={props =>
							<Organizations {...basic_props} {...side_props} {...props} />
						} />


						<SmartRoute exact path="/organizations/:id/clusters" authenticated {...route_p} render={props =>
							<Clusters {...props} {...basic_props} {...side_props} />
						} />
						<SmartRoute exact path="/organizations/:id/clusters/:cid/:subview" authenticated {...route_p} render={props =>
							<ClusterDashboard {...props} {...basic_props} {...side_props} />
						} />


						<SmartRoute exact path="/admin/:subview" authenticated {...route_p} render={props =>
							<Admin {...props} {...basic_props} {...side_props} />
						} />
						<SmartRoute exact path="/admin/organization/:oid/:subview" authenticated {...route_p} render={props =>
							<AdminOrg {...props} {...basic_props} {...side_props} />
						} />



						{/* <SmartRoute exact path="/test" {...route_p}>
							<TestList />
						</SmartRoute> */}

						<Confirm active={this.state.confirm} />
						{this.state.timeout && <Timeout/>}
					</Layout>
				</div>
			</Router>
		);
	}
}

export default App;
