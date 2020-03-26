import React, { useState, useCallback, useMemo } from 'react';

import SimpleFormField from '../../components/SimpleFormField/SimpleFormField';
import ModalPanel from '../../components/ModalPanel/ModalPanel';
import ModelUtil from '../../libs/js/model-util';
import UserModel from '../../modelEntities/User';

import './UserProfile.css';

const UserProfile = (props) => {
    const model_schema = UserModel.schema;
    const { user, setUsrProfileStatus, axiosInstance, appBackground, appConfirm, fetchUserInfo } = props;
    const [ disabled, setDisabled ] = useState (false)
    const [ error, setError ] = useState (null);
    const [ model, setModel ] = useState ({...ModelUtil.getDefaults (model_schema), ...{
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        gitUsername: user.gitUsername,
        gitPassword: user.gitPassword
    }});
    
    const fieldChange = useCallback ((name, value) => {
        setModel ((prevModel) => {
            let m = { ...prevModel };
            m[name] = value;
            return m;
        })
    }, [ ]);
    
    const saveProfile = useCallback (() => {
        let data = { ...model };
        ModelUtil.checkByModel (model_schema, data).then ((result) => {
            console.log ('validation', result, data);
            if (result.valid) {
                setDisabled (true);
                setError (null);
                appBackground (true);
                axiosInstance.post ('/api/users/add', data).then ((response) => {
                    fetchUserInfo ();
                    setUsrProfileStatus (false);
                    appBackground (false);
                    // setDisabled (false);
                    appConfirm ();
                }).catch (error => {
                    appBackground (false);
                    setDisabled (false);
                    if (error.response && error.response.data && error.response.data.message)
                        setError ('Server: ' + error.response.data.message);
                    else
                        setError ('We\'re sorry, something went wrong.');
                })
            } else {
                setError ('Some fields are not correct, can\'t proceed.');
                setDisabled (false);
            }
        })
    }, [ model, model_schema, setError, setDisabled, appBackground, appConfirm, fetchUserInfo, axiosInstance, setUsrProfileStatus ]);

    const renderer = useMemo (() => {
        let field_props = { change: fieldChange };

        return (
            <ModalPanel active={true}>
                <div className="UserProfile">
                    <div className="icon animated fadeInUp d-2">
                        <div className="disc">
                            <i className="fad fa-user"></i>
                        </div>
                        <div className="name">{model.firstName} {model.lastName}</div>
                    </div>
                    <div className="panel-content">
                        {error && (<div className="error-message animated softFadeInUp">{error}</div>)}
                        <SimpleFormField type="text" label="Username" name="username" value={model.username} {...field_props} />
                        <SimpleFormField type="password" label="Password" name="password" value={model.password} {...field_props} />
                        <SimpleFormField type="text" label="Firstname" name="firstName" value={model.firstName} {...field_props} />
                        <SimpleFormField type="text" label="Lastname" name="lastName" value={model.lastName} {...field_props} />
                        <SimpleFormField type="text" label="Git Username" name="gitUsername" value={model.gitUsername} {...field_props} />
                        <SimpleFormField type="password" label="Git Password" name="gitPassword" value={model.gitPassword} {...field_props} />
                        <div className="disabled-layer"></div>
                    </div>
                    <div className="panel-ctrls animated slideInDown">
                        <button disabled={disabled} className="btn btn-danger btn-sm" onClick={setUsrProfileStatus.bind (this, false)}>Cancel</button>
                        <button disabled={disabled} className="btn btn-primary btn-sm" onClick={saveProfile}>Save Changes</button>
                    </div>
                </div>
            </ModalPanel>
        )
    }, [ fieldChange, model, error, saveProfile, setUsrProfileStatus, disabled ]);

    return renderer;
}

export default UserProfile;