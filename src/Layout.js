import React, { useMemo, useCallback, useEffect } from 'react';

import Sidebar from './components/Sidebar/Sidebar';


function Layout (props) {
    const {
        authenticated, 
        axiosInstance,
        appBackground,
        appConfirm,
        appLocked,
        appAuthenticated,
        orgHandler,
        clusterHandler,
        fetchingUser,
        fetchUserInfo,
        organization,
        cluster,
        user,
        background,
        busy,
        appview,
        history,
        match
    } = props;
    


    const appLogout = useCallback (() => {
		appBackground (true);
		appLocked (true);
		axiosInstance.get ('/api/login/logout')
			.then ((response) => {
                appBackground (false);
                appLocked (false);
                appAuthenticated (false);
			})
			.catch (e => {
				appBackground (false);
		        appLocked (false);
			})
    }, [ axiosInstance, appBackground, appLocked, appAuthenticated ]);

    const sidebarClick = useCallback ((action, ev) => {
        // console.log ('===>', 'sidebarClick', action);
		if (action === 'logout')
            appLogout ();
    }, [ appLogout ]);

    const sidebar_memo = useMemo (() => {
        const side_props = {
            organization: organization,
            clickHandler: sidebarClick,
            background: background,
            busy: busy,
            user: user
        };
        return (<Sidebar {...side_props} />)
    }, [ organization, sidebarClick, background, busy, user ]);

    const renderer = useMemo (() => {
        const basic_props = {
            axiosInstance: axiosInstance,
            appBackground: appBackground,
            appConfirm: appConfirm,
            appLocked: appLocked,
            appAuthenticated: appAuthenticated,
            orgHandler: orgHandler,
            clusterHandler: clusterHandler,
            organization: organization,
            cluster: cluster,
            user: user,
            history: history,
            fetchUserInfo: fetchUserInfo,
            match: match
        }
        return (
            <>
                {sidebar_memo}
                {appview (basic_props)}
            </>
        )
    }, [ axiosInstance, appBackground, appConfirm, appLocked, orgHandler, clusterHandler, organization, cluster, user, sidebar_memo, appview ]);

    useEffect (() => {
        if (authenticated === false) {
            history.push ('/login');
        } else if (user === null && fetchingUser === false && match.path !== '/login')
            fetchUserInfo ();
    }, [ authenticated, history, fetchUserInfo, match ]);

    return renderer;
}

export default Layout;