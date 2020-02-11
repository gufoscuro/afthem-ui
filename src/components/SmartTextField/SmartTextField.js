import React from 'react';


const smartTextField = (props) => {
    // console.log ('smartTextField', props)
    let type = 'text';

    if (props.type)
        type = props.type;

    return (
        <div className="text-field-holder clearfix">
            <div className="label">{props.label}</div>
            <div className="text">
                {props.editing ? (
                    <input type={type} 
                        className="textfield" 
                        onChange={props.changeHandler.bind (this)} 
                        name={props.name} 
                        value={props.value} 
                        placeholder={props.label} 
                        autoComplete="off" />
                ) : props.value}
            </div>

            {/* <div className="hover-layer">
                <div className="hover-ctrls">
                    <div className="thin-button" onClick={props.clickHandler} action="edit">
                        Modifica
                    </div>
                </div>
            </div> */}
        </div>
    );
}

export default smartTextField;