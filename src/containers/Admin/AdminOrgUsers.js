import React, { useMemo, useState, useEffect, useCallback } from 'react';

import ModalPanel from '../../components/ModalPanel/ModalPanel';
import Dialog from '../../components/ModalPanel/Dialog';
import AddMembership from './AddMembership';
import FadeinFX from '../../hoc/FadeinFX';

import './AdminOrgUsers.css'

function OrgUsersEditor (props) {
    const { org, appBackground, appConfirm, axiosInstance } = props;
    const [ users, setUsers ] = useState ([]);
    const [ modalFlow, setModalFlow ] = useState (null);
    

    const fetchUsers = useCallback (() => {
        return new Promise ((resolve, reject) => {
            axiosInstance.post ('/api/organizations/associatedUsers/' + org.id).then ((response) => {
                setUsers (response.data);
                resolve (response.data)
            })
        })
    }, [ org, axiosInstance ]);

    const removeMembership = useCallback ((id) => {
        appBackground (true)
        axiosInstance.post ('/api/organizations/removeMembership/', {
            uid: id,
            oid: org.id
        }).then ((response) => {
            fetchUsers ().then (usrs => appBackground (false));
            appConfirm ();
        })
    }, [ org, axiosInstance, appBackground, appConfirm, fetchUsers ]);

    const askRemoveMembership = useCallback ((id) => {
        setModalFlow ({
            id: id,
            type: 'remove-usr',
            heading: 'Remove user association',
            text: 'Are you sure you want to remove this user from this organization?'
        });
    }, [ setModalFlow ]);

    const addMembership = useCallback ((id) => {
        setModalFlow ({ type: 'add-member' });
    }, [ ]);

    const saveMembership = useCallback ((id) => {
        appBackground (true)
        axiosInstance.post ('/api/organizations/addMembership/', {
            uid: id,
            oid: org.id
        }).then ((response) => {
            fetchUsers ().then (usrs => appBackground (false));
            appConfirm ();
        })
    }, [ org, appBackground, appConfirm, fetchUsers, axiosInstance ]);

    const addMembershipOutcome = useCallback ((status) => {
        // console.log ('addMembershipOutcome', status);

        if (status.action === 'cancel-membership') {
            setModalFlow (null)
        }

        else if (status.action === 'save-membership') {
            setModalFlow (null);
            saveMembership (status.id);
        }
    }, [ saveMembership ]);

    useEffect (() => {
        appBackground (true)
        fetchUsers ().then (usrs => appBackground (false))
    }, [ appBackground, fetchUsers ]);

    const modal_memo = useMemo (() => {
        let m_props,
            modal;

        if (modalFlow) {
            if (modalFlow.type === 'add-member') {
                m_props = {
                    data: org,
                    outcome: addMembershipOutcome,
                    axiosInstance: axiosInstance
                }
                modal = (
                    <ModalPanel active={true} >
                        <AddMembership { ...m_props } />
                    </ModalPanel>
                );
            } else if (modalFlow.type === 'remove-usr') {
                m_props = { ...modalFlow, ...{
                    clickHandler: (bool) => {
                        if (bool) {
                            removeMembership (modalFlow.id);
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
    }, [ modalFlow, removeMembership, addMembershipOutcome, axiosInstance, org ]);

    const renderer = useMemo (() => {
        return (
            <div className="WithSidebar width75">
                <div className="p-10">
                    <div className="generic-add-item space-bottom" onClick={addMembership}>
                        Add membership
                    </div>
                    {users.length ? (
                        <FadeinFX>
                            {users.map ((it) => {
                                return (
                                    <div key={it.id} className="generic-item">
                                        <div className="lbl">{it.username}</div>
                                        <div className="txt">Name: {it.firstName} {it.lastName}</div>

                                        <div className="hover">
                                            <div className="ctrls">
                                                <div className="thin-button" onClick={e => askRemoveMembership (it.id)}>Remove Membership</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </FadeinFX>
                    ) : null}
                </div>
                {modal_memo}
            </div>
        )
    }, [ users, modal_memo, askRemoveMembership, addMembership ])

    return renderer;
}

export default OrgUsersEditor;