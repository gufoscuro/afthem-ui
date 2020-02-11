import React from 'react';
import { Link } from 'react-router-dom';


const clusterBlock = (props) => {
    return (
        <div className="project-item sector-block" data-item-id={props.id}>
            <div className="hero clearfix">
                <div className={"icon " + (props.color !== null ? ("bg-color-" + props.color) : "bg-color-1")}>
                    <i className={"fad " + (props.icon ? props.icon : "fa-chart-network")}></i>
                </div>
                <div className="project-status">
                    <div className="head">{props.name}</div>
                    <div className="desc">{props.description.length > 70 ? (props.description.substring (0, 70) + '...') : props.description}</div>
                </div>
            </div>
            <div className="hover-ctrls">
                <div className="ctrls">
                    <div className="ctrls-fx softFadeInUp">
                        <button className="circle-button" onClick={props.clickHandler.bind (this, {
                                action: 'edit-cluster',
                                id: props.id
                            })}>
                            <i className="far fa-pencil"></i>
                        </button>
                        <button className="circle-button" onClick={props.clickHandler.bind (this, {
                                action: 'remove-cluster',
                                id: props.id,
                                name: props.name
                            })}>
                            <i className="far fa-trash"></i>
                        </button>
                        <Link onClick={props.clickHandler.bind (this, { action: 'select-cluster', itemId: props.id })}
                            className="circle-button" 
                            to={"/organizations/" + props.organization.id + "/clusters/" + props.id + "/implementers"}>
                            <i className="far fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default clusterBlock;