import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { withRouter } from 'react-router';

import Sidebar from './components/Sidebar/Sidebar';
import UserProfile from './containers/UserProfile/UserProfile';


function Layout (props) {
    const [ userprofileActive, setUserprofileActive ] = useState (false);
    const {
        isUserAuthenticated, 
        axiosInstance,
        appBackground,
        appConfirm,
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

    const setUsrProfileStatus = useCallback ((bool) => {
        appLocked (bool);
        setUserprofileActive (bool)
    }, [ appLocked ]);

    const sidebarClick = useCallback ((action, ev) => {
        // console.log ('sidebarClick', action, ev);
        
        if (action === 'logout') {
            ev.stopPropagation ();
            appLogout ();
        }

        else if (action === 'user-profile') {
            setUsrProfileStatus (true)
        }
    }, [ appLogout, setUsrProfileStatus ]);

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

    const userprofile_memo = useMemo (() => {
        const profile_props = {
            user: user,
            axiosInstance: axiosInstance,
            setUsrProfileStatus: setUsrProfileStatus,
            appBackground: appBackground,
            appConfirm: appConfirm,
            fetchUserInfo: fetchUserInfo
        }
        return (
            userprofileActive ? <UserProfile {...profile_props} /> : null
        );
    }, [ user, userprofileActive, setUsrProfileStatus, axiosInstance, appBackground, appConfirm, fetchUserInfo ]);

    useEffect (() => {
        // console.log ('Test.useEffect', isUserAuthenticated, 'user', user, 'routePath', window.location.pathname)
        if (user === null && fetchingUser === false && window.location.pathname !== '/login')
            fetchUserInfo ();
    }, [ isUserAuthenticated, history, fetchUserInfo, fetchingUser, match, user ]);

    return (
        < >
            {sidebar_memo}
            {props.children}
            {userprofile_memo}
        </>
    )
}

export default withRouter (Layout);