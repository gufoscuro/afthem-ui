import React, { useMemo, useCallback, useEffect, useState } from 'react';

import SimpleFormField from '../../components/SimpleFormField/SimpleFormField';
import AfthemLogo from '../../libs/img/afthem-logo-bw.png'
import './Login.css';


function Login (props) {
    const { appBackground, appConfirm, appLocked, history, axiosInstance } = props;
    const [ model, setModel ] = useState ({ username: '', password: '' });
    const [ error, setError ] = useState (null);
    const [ disabled, setDisabled ] = useState (false)
    const [ loginSuccess, setLoginSuccess ] = useState (false)

    useEffect (() => {
        appLocked (true);
        axiosInstance.post ('/api/login/check/').then ((response) => {
            if (response.data.success)
                history.push ('/');
        });
    }, [])

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
                        setLoginSuccess (true)
                        setTimeout (() => {
                            appLocked (false);
                            history.push ('/');
                        }, 1000)
                    } else {
                        setDisabled (false);
                        setError ('Username/Password are incorrect.')
                    }
                });
        } else {
            setError ('Username/Password can\'t be empty.')
        }
    }, [ axiosInstance, history, model ]);

    const fieldChange = useCallback ((name, value) => {
        setModel ((prevModel) => {
            let m = { ...prevModel };
            m[name] = value;
            return m;
        })
    }, [ ]);
    
    const renderer = useMemo (() => {
        let field_props = { change: fieldChange }
        return (
            <div className="Login">
                <div className="login-box">
                    <div className="fx animated softFadeInUp d-1">
                        <div className="left">
                            {error && (<div className="error-message animated fadeIn">{error}</div>)}
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
    }, [ doLogin, model, fieldChange, error, disabled, loginSuccess ])

    return renderer;
}

export default Login;