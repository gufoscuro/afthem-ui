import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'

import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Organizations from './containers/Organizations/Organizations';
import Clusters from './containers/Clusters/Clusters';
import ClusterDashboard from './containers/ClusterDashboard/ClusterDashboard';
// import ErrorOverlay from './components/ErrorOverlay/ErrorOverlay';
// import MaintenanceMode from './components/ErrorOverlay/MaintenanceMode';
import Confirm from './components/ModalPanel/Confirm';
// import DnD from './Dnd';

import storage from './libs/js/storage';
// import axios from 'axios';

class App extends Component {
	state = {
        background: false,
        confirm: false,
        organization: null,
        cluster: null
    }
    confirm_timer = null


	componentDidMount () {
        let organization    = storage.get ('organization'),
            cluster         = storage.get ('cluster');

		if (organization)
            this.setState ({ organization: organization });
            
        if (cluster)
            this.setState ({ cluster: cluster });

        // window.addEventListener ('resize', this.updateDimensions);
    }

    componentWillUnmount () {
        // window.removeEventListener ('resize', this.updateDimensions);
    }

	app_background = (bool) => {
        // console.log ('app_background', bool)
		if (bool === true)
			this.setState ({ background: true });
		else
			this.setState ({ background: false })
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
                appBackground: this.app_background,
                appConfirm: this.app_confirm,
                orgHandler: this.organization_handler,
                clusterHandler: this.cluster_handler,
                organization: this.state.organization,
                cluster: this.state.cluster
			},
			side_props = {
                organization: this.state.organization,
				clickHandler: this.sidebar_clickhandler,
				background: this.state.background
			};

		if (this.state.sector)
			app_clsses += " color-scheme-" + this.state.sector.color;

		return (
			<Router>
				<div className={app_clsses}>
					<Sidebar {...side_props} />
					<main>
						<Route exact path="/">
							<Organizations {...basic_props} />
						</Route>
                        <Route exact path="/organizations/:id/clusters">
							<Clusters {...basic_props} />
						</Route>
                        <Route exact path="/organizations/:id/clusters/:cid/:subview">
							<ClusterDashboard {...basic_props} />
						</Route>

                        {/* <Route exact path="/dnd">
							<DnD />
						</Route> */}
					</main>

                    <Confirm active={this.state.confirm} />
					

					{/* <ErrorOverlay active={this.state.maintenance}>
						<MaintenanceMode />
					</ErrorOverlay> */}
				</div>
			</Router>
		);
	}
}

export default App;
