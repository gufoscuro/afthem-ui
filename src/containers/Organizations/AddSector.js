import React from 'react';
// import { Link } from 'react-router-dom';

import SmartTextField from '../../components/SmartTextField/SmartTextField';
import FadeinFX from '../../hoc/FadeinFX';

import './AddSector.css';


const addSector = (props) => {
    let genprops = {
        changeHandler: props.changeHandler,
        clickHandler: props.clickHandler
    }

    if (true || props.editing)
        genprops.editing = true;

    return (
        <div className="AddSector">
            <div className="panel-content">
                <div className="heading">Aggiungi Settore</div>
                {/* <input type="text" placeholder="Nome" name="name" value="" /> */}
                <SmartTextField label="Nome" name="name" value={props.form.name} {...genprops} />
                <SmartTextField label="Description" name="description" value={props.form.description} {...genprops} />
                {/* <SmartTextField label="Ragione Sociale" name="social_r" value={props.form.social_r} {...genprops} /> */}
            </div>
            <div className="panel-ctrls animated slideInDown">
                <button className="btn btn-danger btn-sm" onClick={props.clickHandler.bind (this, 'cancel-add-sector')}>Annulla</button>
                <button className="btn btn-primary btn-sm" onClick={props.clickHandler.bind (this, 'save-sector')}>Conferma</button>
            </div>
        </div>
    );
}

export default addSector;