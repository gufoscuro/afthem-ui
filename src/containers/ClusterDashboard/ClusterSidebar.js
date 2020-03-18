import React, { useMemo, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import ClusterControl from './ClusterControl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Aux from '../../hoc/Aux';

import './ClusterSidebar.css';
import 'react-perfect-scrollbar/dist/css/styles.css';


const ClusterSidebar = (props) => {
    const { organization, cluster, clickHandler, files } = props;

    let base_url        = "/organizations/" + organization.id + "/clusters",
        active          = props.active || true;
    

    const links = useMemo (() => {
        return (
            <Aux>
                

                {organization && cluster && files.map ((file, index) => {
                    let ii;
                    if (file.isDir) {
                        ii = (
                            <Aux key={index}>
                                <div className="folder-name">{file.normalizedName}</div>
                                <div className="sub-folder">
                                    {file.files.map ((sub_file, idx) => {
                                        return (
                                            <NavLink 
                                                key={"sub_" + idx}
                                                className={"view-selector " + (sub_file.repo ? sub_file.repo.status : '')} 
                                                activeClassName="active" 
                                                onClick={props.clickHandler} 
                                                to={base_url + "/" + cluster.id + "/"+ file.normalizedName +"@" + sub_file.normalizedName}>
                                                {sub_file.normalizedName}

                                                {sub_file.normalizedName !== 'default' && (
                                                    <div className="remove-btn" 
                                                        onClick={e => clickHandler (e, {
                                                            action: 'remove', 
                                                            filename: sub_file.normalizedName,
                                                            nextUrl: base_url + "/" + cluster.id + "/"+ file.normalizedName +"@default"
                                                        })}>
                                                        <i className="far fa-trash"></i>
                                                    </div>
                                                )}
                                            </NavLink>
                                        )
                                    })}
                                    <div className="view-selector" 
                                        onClick={e => clickHandler (e, {
                                            action: 'create-flow',
                                            nextUrl: base_url + "/" + cluster.id + "/"+ file.normalizedName +"@"
                                        })}>+ Create Flow</div>
                                </div>
                            </Aux>
                        );
                    } else {
                        ii = (
                            <NavLink 
                                key={index}
                                className={"view-selector " + (file.repo ? file.repo.status : '')}
                                activeClassName="active" 
                                onClick={props.clickHandler} 
                                to={base_url + "/" + cluster.id + "/" + file.normalizedName}>{file.normalizedName}</NavLink>
                        )
                    }

                    return ii;
                })}
            </Aux>
        )
    }, [ organization, cluster, files, clickHandler ]);
    
    const renderer = useMemo (() => {
        let cm_options      = {
            wheelPropagation: false
        };

        return (
            <div className={"ClusterSidebar animated softFadeInLeft" + (active ? "" : " d-none")}>
                <div className="icon">
                    <div className="disc animate softZoomIn d-4">
                        <i className="fad fa-chart-network"></i>
                    </div>
                </div>
                <div className="meta">
                    <div className="name">{cluster.name}</div>
                    <div className="description">{cluster.description}</div>
                </div>
                <div className="general-ctrls">
                    <ClusterControl click={clickHandler} url={base_url} icon="arrow-left" label="Back" />
                    <ClusterControl click={clickHandler} icon="code-commit" label="Commit" action="commit" />
                </div>
                <div className="scroll-area" style={{ height: window.innerHeight - 191 + 'px' }}>
                    <PerfectScrollbar options={cm_options}>
                        <div className="ctrls">
                            {links}
                        </div>
                    </PerfectScrollbar>
                </div>
            </div>
        )
    }, [ active, cluster, organization, links ]);

        
    return renderer;
}

export default ClusterSidebar;