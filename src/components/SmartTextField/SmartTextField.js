import React from 'react';


const smartTextField = (props) => {
    // console.log ('smartTextField', props)
    let type = props.type || 'text';

    return (
        <div className="text-field-holder clearfix">
            <div className="label">{props.label}</div>
            <div className="text">
            <input type={type} 
                className="textfield" 
                onChange={props.changeHandler.bind (this)} 
                name={props.name} 
                value={props.value} 
                placeholder={props.label} 
                autoComplete="off" />
            </div>
        </div>
    );
}

export default smartTextField;