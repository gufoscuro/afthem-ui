import React, { useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';

import NavbarButton from '../NavbarButton/NavbarButton';
import { STRING } from '../../libs/js/utils';
import './Sidebar.css'


const Sidebar = (props) => {
    const { background, busy, organization, clickHandler, user } = props;
    

    const top_links = useMemo (() => {
        let org_links;
        if (organization) {
            org_links = (
                <NavLink activeClassName="active" to={"/organizations/" + organization.id + "/clusters"}>
                    <NavbarButton clsses="animated fadeInDown" icon="chart-network" clickHandler={clickHandler} action="clusters-index"/>
                </NavLink>
            );
        }

        return (
            <>
                <Link to="/">
                    <div className="logo">
                        <i className="fad fa-rocket"></i>
                    </div>
                </Link>
                <NavLink exact activeClassName="active" to="/">
                    <NavbarButton icon="users" clickHandler={clickHandler} action="orgs-index"/>
                </NavLink>
                {org_links}
            </>
        )
    }, [ organization, clickHandler ]);

    const bottom_links = useMemo (() => {
        return (
            <div className="bottom">
                <div className="spinner">
                    <i className="fad fa-spinner-third fa-spin"></i>
                </div>

                {user && user.level === 0 && 
                    (<NavLink exact activeClassName="active" to="/admin/users">
                        <NavbarButton icon="cog"/>
                    </NavLink>)}
                <NavbarButton icon="user" clickHandler={clickHandler} action="user-profile"/>
            </div>
        )
    }, [ user, clickHandler ]);

    const labels_panel = useMemo (() => {
        let org_links_lbls,
            full_un     = user ? (user.firstName + ' ' + user.lastName) : 'User Profile',
            user_name   = STRING.tiny (full_un, 17);
        
        if (organization) {
            org_links_lbls = (
                <NavLink className="link-label lbl animated fadeIn d-1" 
                    activeClassName="active" to={"/organizations/" + organization.id + "/clusters"}>
                    Clusters
                </NavLink>
            );
        }

        return (
            <div className="labels-layer animated slideInLeft">
                <div className="logo-label lbl no-hover animated fadeIn d-1">
                    AFthemUI
                </div>

                <NavLink className="link-label lbl animated fadeIn d-1" exact activeClassName="active" to="/">
                    Organizations
                </NavLink>
                {org_links_lbls}

                <div className="bottom">
                    {user && user.level === 0 && 
                        (<NavLink className="link-label lbl animated fadeIn d-1" exact activeClassName="active" to="/admin/users">
                            Admin Panel
                        </NavLink>)}
                    <div className="link-label profile-link lbl animated fadeIn d-1" 
                        onClick={e => { return (user ? clickHandler ('user-profile', e) : null) }} title={full_un}>
                        {user_name}
                        <i className="far fa-power-off logout" onClick={e => clickHandler ('logout', e)}></i>
                    </div>
                </div>
            </div>
        )
    }, [ organization, user, clickHandler ]);

    const renderer = useMemo (() => {
        let sidebar_clss = 'Sidebar',
            busy_layer;

        if (busy) {
            sidebar_clss += ' busy';
            busy_layer = (
                <div className="maintenance-layer"></div>
            );
        }

        if (background)
            sidebar_clss += ' background';

        return (
            <div className={sidebar_clss}>
                {top_links}
                {bottom_links}
                {labels_panel}
                {busy_layer}
            </div>
        )    
    }, [ background, busy, top_links, bottom_links, labels_panel ]);
    

    return renderer;
}

export default Sidebar;