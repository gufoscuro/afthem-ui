import React from 'react';


function KeyvalItem (props) {
    let render;
    

    if (props.value instanceof Array) {
        return props.value.map ((it, index) => {
            return KeyvalItem ({
                name: props.name,
                value: it,
                index: props.name + index,
                editing: props.editing,
                onChange: props.onChange
            })
        })
    }

    else if (props.value instanceof Object && props.value.value === undefined) {
        return Object.keys (props.value).map ((it, index) => {
            return KeyvalItem ({
                name: it,
                value: props.value[it],
                index: it + index,
                editing: props.editing,
                onChange: props.onChange
            })
        })
    }

    else {
        let val = typeof (props.value) === 'object' ? props.value.value : props.value
        if (props.editing) {
            render = (
                <div className="editor-component-field">
                    <span className="lbl">{props.name}: <i className="sep far fa-long-arrow-right"></i></span>
                    <input type="text" name={props.name} value={val} onChange={(e) => { props.onChange (e, { type: 'keyval' }) }}/>
                </div>
            );
        } else {
            render = (
                <div className="keyval indent-2">{props.name} <i className="far fa-long-arrow-right"></i>
                    {val}
                </div>
            );
        }

        return (
            <div key={props.index}>
                <div className="keyval indent-1">{props.name}</div>
                {render}
            </div>
        );
    }
}

export default KeyvalItem;