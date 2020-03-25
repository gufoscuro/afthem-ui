import React, { useMemo, useCallback, useEffect, useState } from 'react';

import SimpleFormField from '../../components/SimpleFormField/SimpleFormField';
import AfthemLogo from '../../libs/img/afthem-logo-bw.png'
import './Login.css';


function Login (props) {
    const { appBackground, appLocked, appAuthenticated, history, axiosInstance, fetchUserInfo } = props;
    const [ model, setModel ] = useState ({ username: '', password: '' });
    const [ error, setError ] = useState (null);
    const [ disabled, setDisabled ] = useState (false)
    const [ loginSuccess, setLoginSuccess ] = useState (false)


    useEffect (() => {
        onMount ();
    }, []);

    const onMount = useCallback (() => {
        appLocked (true);
    }, [ appLocked ]);

    const doLogin = useCallback (() => {
        const data = { ...model };
        if (data.username.trim() !== '' && data.password.trim() !== '') {
            setError (null);
            appBackground (true);
            setDisabled (true);
            axiosInstance.post ('/api/login/auth/', data)
                .catch (error => {
                    appBackground (false);
                    setDisabled (false);
                    setError ('We\'re sorry, something went wrong.')
                })
                .then ((response) => {
                    appBackground (false);
                    if (response.data.token) {
                        setLoginSuccess (true);
                        fetchUserInfo().then (() => {
                            appLocked (false);
                            setTimeout (() => {
                                appAuthenticated (true);
                                if (history && history.location && history.location.state && history.location.state.from)
                                    history.push (history.location.state.from);
                                else
                                    history.push ('/');
                            }, 1000)
                        }).catch (() => {
                            setLoginSuccess (false);
                            setDisabled (false);
                            setError ('Username/Password are incorrect.')
                        })
                    } else {
                        setDisabled (false);
                        setError ('Username/Password are incorrect.')
                    }
                });
        } else {
            setError ('Username/Password can\'t be empty.')
        }
    }, [ axiosInstance, history, model, appLocked, appBackground, fetchUserInfo, appAuthenticated ]);

    const fieldChange = useCallback ((name, value) => {
        setModel ((prevModel) => {
            let m = { ...prevModel };
            m[name] = value;
            return m;
        })
    }, []);

    const fieldKeypress = useCallback ((event) => {
        if (event.key === 'Enter')
            doLogin ();
    }, [ doLogin ]);
    
    const renderer = useMemo (() => {
        let field_props = { change: fieldChange, keypress: fieldKeypress }
        return (
            <div className="Login">
                <div className="login-box">
                    <div className="fx animated softFadeInUp d-1">
                        <div className="left">
                            <div className="error-box">
                                {error && (<div className="error-message animated softFadeInUp">{error}</div>)}
                            </div>
                            <div className="form">
                                <SimpleFormField type="text" label="Username" name="username" value={model.username} {...field_props} />
                                <SimpleFormField type="password" label="Password" name="password" value={model.password} {...field_props} />
                            </div>
                            <button className="btn-sm btn-primary login-btn" onClick={doLogin}>Login</button>
                            {disabled && (<div className="disabled-layer animated fadeIn"></div>)}
                        </div>
                        <div className="right">
                            <div className="logo">
                                <img className={"logo-image" + (loginSuccess ? ' animated rotateOut' : '')} src={AfthemLogo} alt="Logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }, [ doLogin, model, fieldChange, error, disabled, loginSuccess, fieldKeypress ])

    return renderer;
}

export default Login;