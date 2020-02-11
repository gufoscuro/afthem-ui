import React, { Component } from 'react';
import { withRouter } from 'react-router'
// import { Link } from 'react-router-dom'

import Aux from '../../hoc/Aux';
import FadeinFX from '../../hoc/FadeinFX';
import ModalPanel from '../../components/ModalPanel/ModalPanel';
// import AddSector from '../../components/Sectors/AddSector';
import OrgBlock from './OrgBlock/OrgBlock';
import axios from 'axios';

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

    createSectorOnChange = (event) => {
        let sector_form = { ...this.state.createSectorForm };

        // console.log ('clientDetailsOnChange', event);
        sector_form[event.target.name] = event.target.value;
        this.setState ({
            createSectorForm: sector_form
        })
    }
    
    componentDidMount () {
        this.props.appBackground (true);
        this.props.orgHandler (null);
        axios.get ('/api/organizations/list/').then ((response) => {
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

        else if (status === 'close-modal-panel') {
            this.setState ({
                createSector: false
            })
        }

        else if (status === 'cancel-add-sector') {
            this.setState ({
                createSector: false
            })
        }
    }

    
    render () {
        let orgs,
            modal_flow, 
            basic_props = {
                clickHandler: this.click_handler
            };

        if (this.state.createSector) {
            modal_flow = (
                <ModalPanel active={true} clickHandler={this.click_handler}>
                    {/* <AddSector 
                        form={this.state.createSectorForm} 
                        clickHandler={this.click_handler} 
                        changeHandler={this.createSectorOnChange} /> */}
                </ModalPanel>
            );
        } else
            modal_flow = (<ModalPanel active={false} />);

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
