import React from 'react';
import { NavLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Aux from '../../hoc/Aux';
// import PeriodSelector from '../../../components/PeriodSelector/PeriodSelector';
// import FadeinFX from '../../../hoc/FadeinFX';
import './ClusterSidebar.css';
// import '../../libs/css/perfect-scrollbar.css';
import 'react-perfect-scrollbar/dist/css/styles.css';


const clusterSidebar = (props) => {
    let active          = true,
        organization    = props.organization,
        cluster         = props.cluster,
        base_url        = "/organizations/" + organization.id + "/clusters",
        links,

        file_renderer   = function (name, files) {
            return (
                files.map ((sub_file, idx) => {
                    return <NavLink 
                        key={"sub_" + idx}
                        className="view-selector" 
                        activeClassName="active" 
                        onClick={props.clickHandler} 
                        to={base_url + "/" + cluster.id + "/"+ name +"@" + sub_file.normalizedName}>{sub_file.normalizedName}</NavLink>
                })
            );
        },

        cm_options      = {
            wheelPropagation: false
        }



    if (props.active === false)
        active = false;
    

    if (organization && cluster) {
        links = (
            <Aux>
                <NavLink 
                    exact 
                    className="view-selector" 
                    onClick={props.clickHandler} 
                    to={base_url}>Clusters List</NavLink>

                {props.files.map ((file, index) => {
                    let ii;
                    if (file.isDir) {
                        ii = (
                            <Aux key={index}>
                                <div className="folder-name">{file.normalizedName}</div>
                                <div className="sub-folder">
                                    {file_renderer (file.normalizedName, file.files)}
                                </div>
                            </Aux>
                        );
                    } else {
                        ii = (
                            <NavLink 
                                key={index}
                                className="view-selector" 
                                activeClassName="active" 
                                onClick={props.clickHandler} 
                                to={base_url + "/" + cluster.id + "/" + file.normalizedName}>{file.normalizedName}</NavLink>
                        )
                    }

                    return ii;
                })}
            </Aux>
        );
    }
        
    return (
        <div className={"ClusterSidebar animated softFadeInLeft" + (active ? "" : " d-none")}>
            <div className="icon">
                <div className="disc animate softZoomIn d-4">
                    <i className="fad fa-chart-network"></i>
                </div>
            </div>
            <div className="meta">
                <div className="name">{props.cluster.name}</div>
                <div className="description">{props.cluster.description}</div>
            </div>
            <div className="scroll-area" style={{ height: window.innerHeight - 161 + 'px' }}>
                <PerfectScrollbar options={cm_options}>
                    <div className="ctrls">
                        {links}
                    </div>
                </PerfectScrollbar>
            </div>
        </div>
    );
}

export default clusterSidebar;