import React from 'react';
// import { Link } from 'react-router-dom';

import SmartTextField from '../../components/SmartTextField/SmartTextField';
// import FadeinFX from '../../hoc/FadeinFX';

import './AddCluster.css';


const addCluster = (props) => {
    let genprops = {
        changeHandler: props.changeHandler,
        clickHandler: props.clickHandler
    }

    if (true || props.editing)
        genprops.editing = true;

    return (
        <div className="AddCluster">
            <div className="panel-content">
                <div className="heading">Add Cluster</div>
                <SmartTextField label="Name" name="name" value={props.form.name} {...genprops} />
                <SmartTextField label="Description" name="description" value={props.form.description} {...genprops} />
                <SmartTextField label="Git Url" name="gitUrl" value={props.form.gitUrl} {...genprops} />
                <SmartTextField label="Git Username" name="gitUsername" value={props.form.gitUsername} {...genprops} />
                <SmartTextField type="password" label="Git Password" name="gitPassword" value={props.form.gitPassword} {...genprops} />
            </div>
            <div className="panel-ctrls animated slideInDown">
                <button className="btn btn-danger btn-sm" onClick={props.clickHandler.bind (this, { action: 'cancel-cluster' })}>Annulla</button>
                <button className="btn btn-primary btn-sm" onClick={props.clickHandler.bind (this, { action: 'save-cluster' })}>Conferma</button>
            </div>
        </div>
    );
}

export default addCluster;