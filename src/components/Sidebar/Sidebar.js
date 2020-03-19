import React from 'react';
import { Link, NavLink } from 'react-router-dom'
import { withRouter } from "react-router"

import Aux from '../../hoc/Aux';
import NavbarButton from '../NavbarButton/NavbarButton';
import './Sidebar.css'


const sidebar = (props) => {
    let sidebar_clss = 'Sidebar',
        org_links,
        org_links_lbls,
        notifications_link,
        busy_layer;
        

    if (props.background)
        sidebar_clss += ' background';

    if (props.organization) {
        org_links = (
            <Aux>
                <NavLink activeClassName="active" to={"/organizations/" + props.organization.id + "/clusters"}>
                    <NavbarButton clsses="animated fadeInDown" icon="chart-network" clickHandler={props.clickHandler} action="clusters-index"/>
                </NavLink>
            </Aux>
        );
        org_links_lbls = (
            <Aux>
                <div className="link-label">
                    <span className="lbl animated fadeInRight">
                        Clusters
                    </span>
                </div>
            </Aux>
        );
    }
    

    if (props.busy) {
        sidebar_clss += ' busy';
        busy_layer = (
            <div className="maintenance-layer"></div>
        );
    }
    

    return (
        <div className={sidebar_clss}>
            <Link to="/">
                <div className="logo">
                    <i className="fad fa-rocket"></i>
                </div>
            </Link>
            <NavLink exact activeClassName="active" to="/">
                <NavbarButton icon="users" clickHandler={props.clickHandler} action="orgs-index"/>
            </NavLink>
            {org_links}

            <div className="bottom">
                <div className="spinner">
                    <i className="fad fa-spinner-third fa-spin"></i>
                </div>
                {notifications_link}

                <NavLink exact activeClassName="active" to="/admin/users">
                    <NavbarButton icon="cog" clickHandler={props.clickHandler} action="admin"/>
                </NavLink>
                <NavbarButton icon="user" clickHandler={props.clickHandler} action="user-profile"/>
            </div>

            <div className="labels-layer animated slideInLeft">
                <div className="logo-label">
                    <div className="lbl animated fadeInRight">
                        AFthemUI
                    </div>
                    <div className="link-label">
                        <span className="lbl animated fadeInRight">
                            Organizations
                        </span>
                    </div>
                </div>
                {org_links_lbls}
            </div>
            {busy_layer}
        </div>
    );
}

export default withRouter (sidebar);