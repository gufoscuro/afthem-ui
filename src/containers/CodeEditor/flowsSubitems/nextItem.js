import React from 'react';

import ActorSelector from './actorSelector';


function NextItem (props) {
    let next_items = props.definedActors.filter (it => it.indexOf ('sidecar') === -1)

    if (props.editing) {
        return (
            <div className="editor-component-field">
                <div className="keyval indent-1">
                    <div className="keyval-key">
                        next <i className="sep far fa-long-arrow-right"></i>
                    </div>
                    <div className="indent-1">
                        <ActorSelector self={props.flowElemId} list={next_items} name="next" value={props.value} change={props.onChange} />
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="keyval indent-1">
                <div className="keyval-key">
                    next <i className="far fa-long-arrow-right"></i>
                </div>
                <div className="keyval-val indent-1">{props.value}</div>
            </div>
        );
    }
}

export default NextItem;