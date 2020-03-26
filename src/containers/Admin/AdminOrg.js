import React, { useMemo, useState, useEffect } from 'react';

import AdminSidebar from './AdminSidebar';
import AdminOrgUsers from './AdminOrgUsers';
import UnauthorizedMessage from '../../components/UnauthorizedMessage/UnauthorizedMessage';

import './Admin.css';

function AdminOrg (props) {
    const { match, appBackground, axiosInstance, user } = props;
    const [ organization, setOrganization ] = useState (null);

    const subview = match.params.subview;
    const oid = match.params.oid;

    
    useEffect (() => {
        appBackground (true);
        axiosInstance.post ('/api/organizations/get/' + oid).then ((response) => {
            setOrganization (response.data);
            appBackground (false)
        })
    }, [ oid, appBackground, axiosInstance ]);

    const renderer = useMemo (() => {
        let enable_render = user !== null && user.level === 0,
            subview_renderer,
            subview_props = {
                ...props,
                org: organization
            }

        if (organization && subview === 'users')
            subview_renderer = (<AdminOrgUsers {...subview_props} />);

        return (
            <>
                {enable_render && <AdminSidebar view="admin-org" id={oid} data={organization} />}
                {enable_render && subview_renderer}
                {enable_render === false && <UnauthorizedMessage/>}
            </>
        )
    }, [ subview, organization, oid, props, user ])

    return renderer;
}

export default AdminOrg;