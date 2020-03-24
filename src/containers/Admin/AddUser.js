import React, { useMemo, useState, useCallback } from 'react';
// import { Link } from 'react-router-dom';

import SimpleFormField from '../../components/SimpleFormField/SimpleFormField';
import ModelUtil from '../../libs/js/model-util';
import UserModel from '../../modelEntities/User';

import './AddUser.css';


function AddUser (props) {
    const model_schema = UserModel.schema;
    let { data, outcome } = props;
    const [ error, setError ] = useState (null);
    const [ model, setModel ] = useState (data !== null ? data : ModelUtil.getDefaults (model_schema));
    


    const fieldChange = useCallback ((name, value) => {
        setModel ((prevModel) => {
            let m = { ...prevModel };
            m[name] = value;
            return m;
        })
    }, [ ]);

    const backend_error = useCallback ((error) => {
        if (error.response && error.response.data && error.response.data.message)
            setError ('Server: ' + error.response.data.message);
        else
            setError ('We\'re sorry, something went wrong.');
    }, [ setError ]);
    
    const saveUser = useCallback (() => {
        let data = { ...model };
        ModelUtil.checkByModel (model_schema, data).then ((result) => {
            // console.log ('validation', result);
            if (result.valid) {
                setError (null);
                outcome ({
                    action: 'save-user',
                    data: {...model},
                    error: backend_error
                })
            } else
                setError ('Please fill all the required fields.');
        })
    }, [ outcome, model, backend_error, model_schema ]);

    let renderer = useMemo (() => {
        let field_props = { change: fieldChange },
            levels_list = [
                { text: 'Admin (level 0)', value: 0 },
                { text: 'User (level 5)', value: 5 }
            ];

        return (
            <div className="AddUser">
                <div className="panel-content">
                    <div className="heading">{model.id ? 'Edit User' : 'Add User'}</div>
                    {error && (<div className="error-message animated fadeIn">{error}</div>)}
                    <SimpleFormField type="text" label="Username" name="username" value={model.username} {...field_props} />
                    <SimpleFormField type="password" label="Password" name="password" value={model.password} {...field_props} />
                    <SimpleFormField type="text" label="Firstname" name="firstName" value={model.firstName} {...field_props} />
                    <SimpleFormField type="text" label="Lastname" name="lastName" value={model.lastName} {...field_props} />
                    <SimpleFormField type="boolean" label="Enabled" name="enabled" value={model.enabled} {...field_props} />
                    {/* <SimpleFormField type="int" label="Level" name="level" value={model.level} {...field_props} /> */}
                    <SimpleFormField type="select:int" label="Level" name="level" value={model.level} options={levels_list} {...field_props} />
                    <SimpleFormField type="text" label="Git Username" name="gitUsername" value={model.gitUsername} {...field_props} />
                    <SimpleFormField type="password" label="Git Password" name="gitPassword" value={model.gitPassword} {...field_props} />
                </div>
                <div className="panel-ctrls animated softFadeInUp">
                    <button className="btn btn-danger btn-sm" onClick={outcome.bind (this, { action: 'cancel-user-edits' })}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={saveUser}>Confirm</button>
                </div>
            </div>
        )
    }, [ saveUser, fieldChange, outcome, error, model ]);

    return renderer;
}

export default AddUser;