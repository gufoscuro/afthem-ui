import React, { useMemo, useCallback, useEffect } from 'react';
import { withRouter } from 'react-router';

import Sidebar from './components/Sidebar/Sidebar';


function Layout (props) {
    const {
        isUserAuthenticated, 
        axiosInstance,
        appBackground,
        appLocked,
        appAuthenticated,
        fetchingUser,
        fetchUserInfo,
        organization,
        user,
        background,
        busy,
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

    useEffect (() => {
        // console.log ('Test.useEffect', isUserAuthenticated, 'user', user, 'routePath', window.location.pathname)
        if (user === null && fetchingUser === false && window.location.pathname !== '/login')
            fetchUserInfo ();
    }, [ isUserAuthenticated, history, fetchUserInfo, fetchingUser, match, user ]);

    return (
        < >
            {sidebar_memo}
            {props.children}
        </>
    )
}

export default withRouter (Layout);