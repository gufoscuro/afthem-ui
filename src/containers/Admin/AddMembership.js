import React, { useMemo, useState, useCallback } from 'react';

import FadeinFX from '../../hoc/FadeinFX';
import axios from 'axios';


function AddMembership (props) {
    let { data, outcome } = props;
    const [ users, setUsers ] = useState ([]);
    const [ search, setSearch ] = useState ('');
    const [ selected, setSelected ] = useState (null);
    let timer = null;

    const save = useCallback (() => {
        outcome ({ action: 'save-membership', id: selected });
    }, [ outcome, selected ]);

    const change = useCallback ((event) => {
        setSearch (event.target.value);
        searchUsers (event.target.value);
    }, []);

    const searchUsers = useCallback ((text) => {
        if (timer)
            clearTimeout (timer);

        timer = setTimeout (() => {
            axios.post ('/api/users/list/', {
                search: text
            }).then ((response) => {
                // console.log ('searchUser', response.data)
                setUsers (response.data);
            })
        }, 300);
    }, [ data ]);

    const users_renderer = useMemo (() => {
        return (
            <FadeinFX>
                {users.map ((it) => {
                    return (
                        <div key={it.id} className={"search-item" + (selected === it.id ? ' selected' : '')} 
                            onClick={setSelected.bind (this, it.id)}>
                            <div className="lbl">{it.username}</div>
                            <div className="txt">{it.firstName} {it.lastName}</div>
                        </div>
                    )
                })}
            </FadeinFX>
        )
    }, [ users, selected ]);

    let renderer = useMemo (() => {
        let field_props = { change: change }

        return (
            <div className="AddUser">
                <div className="panel-content">
                    <div className="heading">Select user</div>
                    <div className="search-box">
                        <input className="search-field" type="text" placeholder="Search User" value={search} onChange={e => change (e)} />
                    </div>
                    <div className="results">
                        {users_renderer}
                    </div>
                </div>
                <div className="panel-ctrls animated softFadeInUp">
                    <button className="btn btn-danger btn-sm" onClick={outcome.bind (this, { action: 'cancel-membership' })}>Cancel</button>
                    <button className="btn btn-primary btn-sm" 
                        disabled={!selected} onClick={save.bind (this)}>Confirm</button>
                </div>
            </div>
        )
    }, [ change, save, outcome, search, users_renderer ]);

    return renderer;
}

export default AddMembership;