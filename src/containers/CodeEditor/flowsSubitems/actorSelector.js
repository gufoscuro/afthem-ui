import React from 'react';


function ActorSelector (props) {
    const { name, value, list, change, self } = props;
    let base_opt;

    // console.log ('ActorSelector', list, value)

    if (list.length === 0 && value === undefined)
        base_opt = (
            <option disabled>No defined {name} yet</option>
        );
    else if (list.indexOf (value) === -1)
        list.push (value);

    return (
        <select name={name} onChange={change} value={value}>
            {base_opt}
            {list.filter (opt => opt !== self).map (opt => <option key={name + '_opt_' + opt} value={opt}>{opt}</option>)}
        </select>
    );
}

export default ActorSelector;