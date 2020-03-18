import React, { useMemo, useState, useEffect } from 'react';

import AdminSidebar from './AdminSidebar';
import AdminOrgUsers from './AdminOrgUsers';

import './Admin.css';

function AdminOrg (props) {
    const { match, appBackground, axiosInstance } = props;
    const [ organization, setOrganization ] = useState (null);

    const subview = match.params.subview;
    const oid = match.params.oid;

    
    // console.log ('AdminOrg', subview, oid);
    useEffect (() => {
        appBackground (true);
        axiosInstance.post ('/api/organizations/get/' + oid).then ((response) => {
            setOrganization (response.data);
            appBackground (false)
        })
    }, [ oid ]);

    const renderer = useMemo (() => {
        let subview_renderer,
            subview_props = {
                ...props,
                org: organization
            }

        if (organization && subview === 'users')
            subview_renderer = (<AdminOrgUsers {...subview_props} />);
        // else if (subview === 'organizations')
        //     subview_renderer = (<AdminOrganizations {...subview_props} />);

        return (
            <>
                <AdminSidebar view="admin-org" id={oid} data={organization} />
                {subview_renderer}
            </>
        )
    }, [ subview, organization ])

    return renderer;
}

export default AdminOrg;