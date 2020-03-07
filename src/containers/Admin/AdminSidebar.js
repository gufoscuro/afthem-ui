import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
// import Aux from '../../hoc/Aux';

import '../ClusterDashboard/ClusterSidebar.css';
import 'react-perfect-scrollbar/dist/css/styles.css';


const AdminSidebar = (props) => {
    const { id, view, data } = props;

    const renderer = useMemo (() => {
        let cm_options = { wheelPropagation: false },
            title_renderer,
            links_renderer;

        if (view === 'admin-org') {
            title_renderer = (
                <div className="meta">
                    <div className="name">{data && data.name}</div>
                    <div className="description">{data && data.description}</div>
                </div>
            );
            links_renderer = (
                <div className="scroll-area" style={{ height: window.innerHeight - 161 + 'px' }}>
                    <PerfectScrollbar options={cm_options}>
                        <div className="ctrls">
                            <NavLink 
                                exact 
                                className="view-selector" 
                                to="/admin/organizations">Back to organizations</NavLink>
                            <NavLink 
                                exact 
                                className="view-selector" 
                                to={"/admin/organization/" + id + "/users"}>Associated Users</NavLink>
                            {/* <NavLink 
                                exact 
                                className="view-selector" 
                                to="/admin/organizations">Manage Organizations</NavLink> */}
                        </div>
                    </PerfectScrollbar>
                </div>
            );
        }

        else {
            title_renderer = (
                <div className="meta">
                    <div className="name">Administration</div>
                    <div className="description"></div>
                </div>
            );
            links_renderer = (
                <div className="scroll-area" style={{ height: window.innerHeight - 161 + 'px' }}>
                    <PerfectScrollbar options={cm_options}>
                        <div className="ctrls">
                            <NavLink 
                                exact 
                                className="view-selector" 
                                to="/">Exit Admin</NavLink>
                            <NavLink 
                                exact 
                                className="view-selector" 
                                to="/admin/users">Manage Users</NavLink>
                            <NavLink 
                                exact 
                                className="view-selector" 
                                to="/admin/organizations">Manage Organizations</NavLink>
                        </div>
                    </PerfectScrollbar>
                </div>
            );
        }

        return (
            <div className="ClusterSidebar animated softFadeInLeft">
                <div className="icon">
                    <div className="disc">
                        <i className="fad fa-user-cog"></i>
                    </div>
                </div>
                {title_renderer}
                {links_renderer}
            </div>
        )
    }, [ view, data ]);

        
    return renderer;
}

export default AdminSidebar;