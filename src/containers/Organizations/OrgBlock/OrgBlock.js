import React from 'react';
import { Link } from 'react-router-dom';


const orgBlock = (props) => {
    return (
        <div className="project-item sector-block" data-item-id={props.id}>
            <div className="hero clearfix">
                <div className={"icon " + (props.color !== null ? ("bg-color-" + props.color) : "bg-color-1")}>
                    <i className={"fad " + (props.icon ? props.icon : "fa-database")}></i>
                </div>
                <div className="project-status">
                    <div className="head">{props.name}</div>
                    <div className="desc">{props.description.length > 70 ? (props.description.substring (0, 70) + '...') : props.description}</div>
                    {/* <div className="inner">
                        <div className="progressbar">
                            <div className="progressbar-inner" style={{ width: 2 + '%' }}></div>
                        </div>
                    </div> */}
                </div>
            </div>
            <div className="hover-ctrls">
                <div className="ctrls">
                    <div className="ctrls-fx softFadeInUp">
                        <Link onClick={props.clickHandler.bind (this, { action: 'select-organization', itemId: props.id })}
                            className="circle-button" 
                            to={"/organizations/" + props.id + "/clusters"}>
                            <i className="far fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default orgBlock;