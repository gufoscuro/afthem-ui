import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'

import './App.css';

import Layout from './Layout';
import Organizations from './containers/Organizations/Organizations';
import Clusters from './containers/Clusters/Clusters';
import ClusterDashboard from './containers/ClusterDashboard/ClusterDashboard';
import Admin from './containers/Admin/Admin';
import AdminOrg from './containers/Admin/AdminOrg';
import Confirm from './components/ModalPanel/Confirm';
import Login from './containers/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/protected.route';

// import ErrorOverlay from './components/ErrorOverlay/ErrorOverlay';
// import MaintenanceMode from './components/ErrorOverlay/MaintenanceMode';

import storage from './libs/js/storage';
import axios from 'axios';

class App extends Component {
	state = {
		authenticated: true,
        background: false,
        confirm: false,
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
		this.axiosInstance.interceptors.response.use ((response) => response, (error, n) => {
			const { status } = error.response;
			if (status === 401) {
				this.setState ({
					authenticated: false,
					user_nfo: null
				});
			}
			// if (status === 401)
			// 	window.location.href = '/login';
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
	
	app_authenticated = (bool) => {
		this.setState ({ authenticated: false });
	}

	app_background = (bool) => {
        this.setState ({ background: bool });
    }

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
	
	app_locked = (bool) => {
		this.setState ({ sidebar_busy: bool });
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
            this.axiosInstance.get ('/api/users/load').then ((payload) => {
                this.setState ({
					fetching_user: false,
					user_nfo: payload.data
				});
                resolve ();
            }).catch (reject);
        })
    };

	sidebar_clickhandler = (action, ev) => {
		console.log ('===>', 'sidebar_clickhandler', action);

		if (action === 'logout')
			this.app_logout ();
	}

	render () {
		let basic_props = {
				authenticated: this.authenticated,
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
			side_props = {
                background: this.state.background,
				busy: this.state.sidebar_busy
			};


		return (
			<Router>
				<div className="App">
					<Route exact path="/login" render={(props) => 
						<Layout {...props} {...basic_props} {...side_props} 
							appview={lprops => <Login {...lprops} />} />
					} />
					
					<ProtectedRoute exact path="/" render={props =>
						<Layout {...props} {...basic_props} {...side_props} 
							appview={lprops => <Organizations {...lprops} />} />
						
					}/>
					<ProtectedRoute exact path="/organizations/:id/clusters" render={props =>
						<Layout {...props} {...basic_props} {...side_props} 
							appview={lprops => <Clusters {...lprops} />} />
					}/>
					<ProtectedRoute exact path="/organizations/:id/clusters/:cid/:subview" render={props =>
						<Layout {...props} {...basic_props} {...side_props} 
							appview={lprops => <ClusterDashboard {...lprops} />} />
					}/>


					<ProtectedRoute exact path="/admin/:subview" render={props => 
						<Layout {...props} {...basic_props} {...side_props} 
							appview={lprops => <Admin {...lprops} />} />
					}/>
					<ProtectedRoute path="/admin/organization/:oid/:subview" render={props => 
						<Layout {...props} {...basic_props} {...side_props} 
							appview={lprops => <AdminOrg {...lprops} /> } />
					}/>
					

					{/* <Route exact path="/dnd">
						<DnD />
					</Route> */}

                    <Confirm active={this.state.confirm} />
				</div>
			</Router>
		);
	}
}

export default App;
