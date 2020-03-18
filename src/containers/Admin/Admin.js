import React, { useMemo } from 'react';

import AdminSidebar from './AdminSidebar';
import AdminUsers from './AdminUsers';
import AdminOrganizations from './AdminOrganizations';

import './Admin.css';

function Admin (props) {
    console.log (props)
    const { match, appBackground, appConfirm } = props;
    const subview = match.params.subview;
    

    const renderer = useMemo (() => {
        let subview_renderer,
            subview_props = {
                ...props
            }

        if (subview === 'users')
            subview_renderer = (<AdminUsers {...subview_props} />);
        else if (subview === 'organizations')
            subview_renderer = (<AdminOrganizations {...subview_props} />);

        return (
            <>
                <AdminSidebar/>
                {subview_renderer}
            </>
        )
    }, [ subview ])

    return renderer;
}

export default Admin;