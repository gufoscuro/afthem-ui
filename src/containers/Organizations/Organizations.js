import React, { Component } from 'react';
import { withRouter } from 'react-router'
// import { Link } from 'react-router-dom'

import Aux from '../../hoc/Aux';
import FadeinFX from '../../hoc/FadeinFX';
import OrgBlock from './OrgBlock/OrgBlock';

import './Dashboard.css'



class Organizations extends Component {
    state = {
        organizations: [],
        createSector: false,
        createSectorForm: {
            name: "",
            description: ""
        }
    }

    componentDidMount () {
        this.props.appBackground (true);
        this.props.orgHandler (null);
        this.props.axiosInstance.get ('/api/organizations/list/').then ((response) => {
            this.setState ({
                organizations: response.data
            });
            this.props.appBackground (false);
        })
    }

    componentDidUpdate (a, b) {
        
    }

    click_handler = (status) => {
        console.log ('click_handler', status);

        if (status.action === 'select-organization') {
            let hit = null
            this.state.organizations.forEach ((org) => {
                if (status.itemId === org.id)
                    hit = org;
            });
            if (hit)
                this.props.orgHandler (hit);
        }
    }

    
    render () {
        let orgs,
            modal_flow, 
            basic_props = {
                clickHandler: this.click_handler
            };

        if (this.state.organizations.length)
            orgs = this.state.organizations.map ((element, index) =>
                <OrgBlock { ...element } { ...basic_props } {...{ index: index }} key={element.id} />
            );

        return (
            <Aux>
                <div className="Dashboard">
                    <h2 className="heading">Organizations</h2>
                    <FadeinFX>
                        <div className={"items-blocks clearfix  "}>
                            {orgs}
                        </div>
                    </FadeinFX>
                </div>
                {modal_flow}
            </Aux>
        );
    }
};

export default withRouter (Organizations);
