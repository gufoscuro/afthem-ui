import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';

import FadeinFX from '../../hoc/FadeinFX';
import ModalPanel from '../../components/ModalPanel/ModalPanel';
import AddOrganization from './AddOrganization';
import Dialog from '../../components/ModalPanel/Dialog';


function AdminOrganizations (props) {
    const { appBackground, appConfirm, axiosInstance } = props;
    const [ organizations, setOrganizations ] = useState ([]);
    const [ modalFlow, setModalFlow ] = useState (null);

    useEffect (() => {
        appBackground (true);
        fetchOrgs().then (() => appBackground (false))
    }, []);

    const orgsMap = useMemo (() => {
        return organizations.reduce (function (map, obj) {
            map[obj.id] = obj;
            return map;
        }, { });
    }, [ organizations ]);

    const fetchOrgs = useCallback (() => {
        return new Promise ((resolve, reject) => {
            axiosInstance.post ('/api/organizations/list').then ((response) => {
                setOrganizations (response.data);
                resolve (response.data)
            }).catch (reject)
        })
    }, [ setOrganizations, axiosInstance ]);

    const addOrg = useCallback ((id) => {
        let d = null;

        if (id) {
            if (orgsMap[id] !== undefined)
                d = orgsMap[id];
        }

        // setOrgUsersFlow (null);
        setModalFlow ({ type: 'add-org', data: d });
    }, [ orgsMap ]);

    const askRemoveOrg = useCallback ((id) => {
        // setOrgUsersFlow (null);
        setModalFlow ({
            id: id,
            type: 'remove-org',
            heading: 'Remove Organization',
            text: 'Are you sure you want to remove this organization?'
        });
    }, [ setModalFlow ]);

    const removeOrg = useCallback ((id) => {
        appBackground (true);
        axiosInstance.post ('/api/organizations/remove', {
            id: id
        }).then ((response) => {
            fetchOrgs().then (() => appBackground (false));
            appConfirm ();
        })
    }, [ appBackground, appConfirm, fetchOrgs, axiosInstance ]);

    const addOrgOutcome = useCallback ((status) => {
        if (status.action === 'cancel-org-edits') {
            setModalFlow (null);
        } else {
            appBackground (true);
            axiosInstance.post ('/api/organizations/add', status.data).then ((response) => {
                fetchOrgs().then (() => appBackground (false));
                setModalFlow (null);
                appConfirm ();
            }).catch (status.error)
        }
    }, [ appBackground, appConfirm, fetchOrgs, axiosInstance ]);
    
    const modal_memo = useMemo (() => {
        let m_props,
            modal;

        if (modalFlow) {
            if (modalFlow.type === 'add-org') {
                m_props = {
                    data: modalFlow.data,
                    outcome: addOrgOutcome
                }
                modal = (
                    <ModalPanel active={true} >
                        <AddOrganization { ...m_props } />
                    </ModalPanel>
                );
            }
    
            else if (modalFlow.type === 'remove-org') {
                m_props = { ...modalFlow, ...{
                    clickHandler: (bool) => {
                        if (bool) {
                            removeOrg (modalFlow.id);
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
    }, [ modalFlow, removeOrg, addOrgOutcome ])

    const renderer = useMemo (() => {
        let org_list = (
            <FadeinFX delay={2}>
                <div className="p-10">
                    <div className="generic-add-item space-bottom" onClick={addOrg}>
                        Add Organization
                    </div>
                    {organizations.map ((it) => {
                        return (
                            <div key={it.id} className="generic-item" onClick={e => addOrg (it.id)}>
                                <div className="lbl gap">{it.name}</div>
                                <div className="txt">Description: {it.description}</div>
                                <div className="txt">Timezone: {it.timezone}</div>
                                <div className="txt">Registered: {it.registrationDate}</div>

                                <div className="hover">
                                    <div className="ctrls">
                                        <NavLink className="thin-button" to={"/admin/organization/" + it.id + "/users"}>Manage</NavLink>
                                        <div className="thin-button" onClick={e => { e.stopPropagation (); addOrg (it.id) }}>Edit</div>
                                        <div className="thin-button" onClick={e => { e.stopPropagation (); askRemoveOrg (it.id) }}>Remove</div>
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
                    {org_list}
                    {modal_memo}
                </div>
            </>
        )
    }, [ organizations, addOrg, askRemoveOrg, modal_memo ])

    return renderer;
}

export default AdminOrganizations;