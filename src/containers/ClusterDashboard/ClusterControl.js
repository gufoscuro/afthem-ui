import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import './ClusterControl.css';


const ClusterControl = (props) => {
    const { icon, label, click, url, action } = props;
    const content = useMemo (() => {
        return (
            <>
                <i className={"far fa-"+ props.icon +" icn"}></i> {props.label}
            </>
        )
    }, [ icon, label ]);
    
    const renderer = useMemo (() => {
        let r;
        if (url !== undefined) {
            return (<div className="cluster-control"><NavLink exact onClick={click} to={url}>{content}</NavLink></div>);
        } else {
            return (<div className="cluster-control" onClick={e => click (e, { action: action })}>{content}</div>);
        }
    }, [ url, label, content, click, action ])

    return renderer;
}

export default ClusterControl;