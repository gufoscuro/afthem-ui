import React, { useMemo } from 'react';

import AdminSidebar from './AdminSidebar';
import AdminUsers from './AdminUsers';
import AdminOrganizations from './AdminOrganizations';
import UnauthorizedMessage from '../../components/UnauthorizedMessage/UnauthorizedMessage';

import './Admin.css';

function Admin (props) {
    const { match, user, history } = props;
    const subview = match.params.subview;

    const renderer = useMemo (() => {
        let enable_render = user !== null && user.level === 0,
            subview_renderer,
            subview_props = {
                ...props
            }

        if (subview === 'users')
            subview_renderer = (<AdminUsers {...subview_props} />);
        else if (subview === 'organizations')
            subview_renderer = (<AdminOrganizations {...subview_props} />);

        return (
            <>
                {enable_render && <AdminSidebar/>}
                {enable_render && subview_renderer}
                {enable_render === false && <UnauthorizedMessage/>}
            </>
        )
    }, [ subview, props, user ])

    return renderer;
}

export default Admin;