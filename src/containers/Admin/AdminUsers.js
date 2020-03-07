import React, { useMemo, useEffect, useState, useCallback } from 'react';

import FadeinFX from '../../hoc/FadeinFX';
import ModalPanel from '../../components/ModalPanel/ModalPanel';
import AddUser from './AddUser';
import Dialog from '../../components/ModalPanel/Dialog';
import axios from 'axios';


function AdminUsers (props) {
    const { appBackground, appConfirm } = props;
    const [ users, setUsers ] = useState ([]);
    const [ modalFlow, setModalFlow ] = useState (null);

    
    useEffect (() => {
        appBackground (true);
        fetchUsers().then (() => appBackground (false))
    }, []);
    
    const usersMap = useMemo (() => {
        return users.reduce (function (map, obj) {
            map[obj.id] = obj;
            return map;
        }, { });
    }, [  users ]);

    const fetchUsers = useCallback (() => {
        return new Promise ((resolve, reject) => {
            axios.post ('/api/users/list').then ((response) => {
                setUsers (response.data);
                resolve (response.data)
            }).catch (reject)
        })
    }, [ setUsers ])

    const addUser = useCallback ((id) => {
        let d = null;

        if (id) {
            if (usersMap[id] !== undefined)
                d = usersMap[id];
        }

        setModalFlow ({ type: 'add-user', data: d });
    }, [ usersMap ]);

    const askRemoveUser = useCallback ((id) => {
        setModalFlow ({
            id: id,
            type: 'remove-user',
            heading: 'Remove User',
            text: 'Are you sure you want to remove this user?'
        });
    }, [ setModalFlow ]);

    const removeUser = useCallback ((id) => {
        appBackground (true);
        axios.post ('/api/users/remove', {
            id: id
        }).then ((response) => {
            fetchUsers().then (() => appBackground (false));
            appConfirm ();
        })
    }, [ appBackground, appConfirm, fetchUsers ]);

    const addUserOutcome = useCallback ((status) => {
        if (status.action === 'cancel-user-edits') {
            setModalFlow (null);
        } else {
            appBackground (true);
            axios.post ('/api/users/add', status.data).then ((response) => {
                fetchUsers().then (() => appBackground (false));
                setModalFlow (null);
                appConfirm ();
            }).catch (status.error)
        }
    }, [ appBackground, appConfirm, fetchUsers ]);
    
    const modal_memo = useMemo (() => {
        let m_props,
            modal;

        if (modalFlow) {
            if (modalFlow.type === 'add-user') {
                m_props = {
                    data: modalFlow.data,
                    outcome: addUserOutcome
                }
                modal = (
                    <ModalPanel active={true} >
                        <AddUser { ...m_props } />
                    </ModalPanel>
                );
            }
    
            else if (modalFlow.type === 'remove-user') {
                m_props = { ...modalFlow, ...{
                    clickHandler: (bool) => {
                        if (bool) {
                            removeUser (modalFlow.id);
                            setModalFlow (null);
                        } else
                            setModalFlow (null);
                    }
                }}
                modal = (
                    <ModalPanel active={true} >
                        <Dialog { ...m_props } />
                    </ModalPanel>
                );
            }
        } else
            modal = (<ModalPanel active={false}></ModalPanel>);

        return modal;
    }, [ modalFlow, removeUser ])

    const renderer = useMemo (() => {
        let users_list = (
            <FadeinFX delay={2}>
                <div className="p-10">
                    <div className="generic-add-item space-bottom" onClick={addUser}>
                        Add User
                    </div>
                    {users.map ((it, index) => {
                        return (
                            <div key={it.id} className="generic-item">
                                <div className="lbl gap">Username: {it.username}</div>
                                <div className="txt">Full name: {it.firstName} {it.lastName}</div>
                                <div className="txt">Enabled: {it.enabled ? 'yes' : 'no'}</div>
                                <div className="txt">Level: {it.level === 0 ? 'Admin' : it.level}</div>

                                <div className="hover">
                                    <div className="ctrls">
                                        {/* <button className="circle-button" onClick={() => addUser (it.id)}>
                                            <i className="far fa-pencil"></i>
                                        </button>
                                        <button className="circle-button danger" onClick={() => askRemoveUser (it.id)}>
                                            <i className="far fa-trash"></i>
                                        </button> */}
                                        <div className="thin-button" onClick={() => addUser (it.id)}>Edit</div>
                                        <div className="thin-button" onClick={() => askRemoveUser (it.id)}>Remove</div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </FadeinFX>
        );
        
        return (
            <>
                <div className="WithSidebar width75">
                    {users_list}
                    {modal_memo}
                </div>
            </>
        )
    }, [ users, modalFlow, addUser ])

    return renderer;
}

export default AdminUsers;