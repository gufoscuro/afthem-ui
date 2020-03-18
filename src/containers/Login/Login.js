import React, { useMemo, useCallback } from 'react';


function Login (props) {
    const { appBackground, appConfirm, history, axiosInstance } = props;

    const doLogin = useCallback (() => {
        axiosInstance.post ('/api/login/auth/', {
            username: "johndoe@gmail.com",
	        password: "foobar"
        }).then ((response) => {
            history.push ('/');
        })
    }, [ axiosInstance, history ])
    
    const renderer = useMemo (() => {
        return (
            <div>
                <div>Login</div>
                <button onClick={doLogin}>Login</button>
            </div>
        )
    }, [ doLogin ])

    return renderer;
}

export default Login;