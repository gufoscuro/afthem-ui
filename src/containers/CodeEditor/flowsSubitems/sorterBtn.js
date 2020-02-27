import React  from 'react';

const sorterBtn = (props) => {
    const old_pos = props.position;
    const new_pos = props.type === 'up' ? old_pos - 1 : old_pos + 1;
    const disabled = new_pos < 0 || new_pos >= props.max;

    let clsses = []

    if (props.type === 'up')
        clsses.push ('fa-arrow-up');
    else
        clsses.push ('fa-arrow-down');

    return (
        <div className={"sorter-btn" + (disabled ? ' disabled' : '')} onClick={props.move.bind (this, old_pos, new_pos)}>
            <i className={"far sorter-icn " + clsses.join (' ')}></i>
        </div>
    );
}

export default sorterBtn;