import React from 'react';


const fadeinFX = (props) => {
    let d_class = '';

    if (props.delay !== undefined)
        d_class = ' d-' + props.delay;

    return (
        <div className={"basic-fx animated softFadeInUp " + (props.classes ? props.classes : "") + d_class}>
            {props.children}
        </div>
    );
}

export default fadeinFX;