import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'

import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
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
        background: false,
        confirm: false,
        organization: null,
		cluster: null,
		sidebar_busy: false,
		user_nfo: null
    }
	confirm_timer = null
	axiosInstance = axios.create ({
		headers: { 'X-Custom-Header': 'afthem-ui' }
	})


	constructor (props) {
		super (props);
		this.axiosInstance.interceptors.response.use ((response) => response, (error, n) => {
			const { status, data, config } = error.response;
			if (status === 401)
				window.location.href = '/login';
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
		
		this.axiosInstance.get ('/api/login/check').then ((res) => {
			this.axiosInstance.get ('/api/users/load').then ((response) => {
				this.setState ({ user_nfo: response.data })
			})
		})
    }

    componentWillUnmount () {
        // window.removeEventListener ('resize', this.updateDimensions);
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

	sidebar_clickhandler = (action, ev) => {
		console.log ('===>', 'sidebar_clickhandler', action);

		
	}

	render () {
		let app_clsses 	= "App",
			basic_props = {
				axiosInstance: this.axiosInstance,
                appBackground: this.app_background,
				appConfirm: this.app_confirm,
				appLocked: this.app_locked,
                orgHandler: this.organization_handler,
                clusterHandler: this.cluster_handler,
                organization: this.state.organization,
                cluster: this.state.cluster
			},
			side_props = {
                organization: this.state.organization,
				clickHandler: this.sidebar_clickhandler,
				background: this.state.background,
				busy: this.state.sidebar_busy,
				user: this.state.user_nfo
			};

		if (this.state.sector)
			app_clsses += " color-scheme-" + this.state.sector.color;

		return (
			<Router>
				<div className={app_clsses}>
					<Sidebar {...side_props} />
					<main>
						<Route exact path="/login" render={(props) => <Login {...props} {...basic_props} /> } />
						
						<ProtectedRoute exact path="/" render={props =>
							<Organizations {...props} {...basic_props} />
						}/>
						<ProtectedRoute exact path="/organizations/:id/clusters" render={props =>
							<Clusters {...props} {...basic_props} />
						}/>
                        <ProtectedRoute exact path="/organizations/:id/clusters/:cid/:subview" render={props =>
							<ClusterDashboard {...props} {...basic_props} />
						}/>


						<ProtectedRoute exact path="/admin/:subview" render={props => 
							<Admin {...props} {...basic_props} />
						}/>
						<ProtectedRoute path="/admin/organization/:oid/:subview" render={props => 
							<AdminOrg {...props} {...basic_props} /> 
						}/>
						

                        {/* <Route exact path="/dnd">
							<DnD />
						</Route> */}
					</main>

                    <Confirm active={this.state.confirm} />
					

					{/* <ErrorOverlay active={true}>
						<MaintenanceMode />
					</ErrorOverlay> */}
				</div>
			</Router>
		);
	}
}

export default App;
