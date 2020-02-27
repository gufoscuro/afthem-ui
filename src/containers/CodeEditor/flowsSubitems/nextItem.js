import React from 'react';


function NextItem (props) {
    let next_items = props.definedActors.filter (it => it.indexOf ('sidecar') === -1)

    if (props.editing) {
        return (
            <div className="editor-component-field">
                <div className="lbl indent-1">next <i className="sep far fa-long-arrow-right"></i></div>
                <div className="indent-2">
                    <select name="next" onChange={props.onChange} defaultValue={props.value}>
                        {next_items.map (opt => <option key={'opt_' + opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            </div>
        );
    } else {
        return (
            <div className="keyval indent-1">next <i className="far fa-long-arrow-right"></i>
                <div className="keyval indent-1">{props.value}</div>
            </div>
        );
    }
}

export default NextItem;