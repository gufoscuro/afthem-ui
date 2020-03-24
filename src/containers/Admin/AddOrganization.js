import React, { useMemo, useState, useCallback } from 'react';
// import { Link } from 'react-router-dom';

import SimpleFormField from '../../components/SimpleFormField/SimpleFormField';
import ModelUtil from '../../libs/js/model-util';
import OrganizationModel from '../../modelEntities/Organization';
import MODEL_DEFAULTS from '../../modelEntities/defaults';

import './AddUser.css';


function AddOrganization (props) {
    const model_schema = OrganizationModel.schema;
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

    const save = useCallback ((action) => {
        let data = { ...model };
        ModelUtil.checkByModel (model_schema, data).then ((result) => {
            console.log ('validation', data, result, model_schema);
            if (result.valid) {
                setError (null);
                outcome ({
                    action: action,
                    data: {...model},
                    error: backend_error
                })
            } else
                setError ('Please fill all the required fields.');
        })
    }, [ outcome, model, model_schema, backend_error ]);

    let renderer = useMemo (() => {
        let field_props = { change: fieldChange }

        return (
            <div className="AddUser">
                <div className="panel-content">
                    <div className="heading">{model.id ? 'Edit Organization' : 'Add Organization'}</div>
                    {error && (<div className="error-message animated fadeIn">{error}</div>)}
                    <SimpleFormField type="text" label="Name" name="name" value={model.name} {...field_props} />
                    <SimpleFormField type="text" label="Description" name="description" value={model.description} {...field_props} />
                    <SimpleFormField type="select" label="Timezone" name="timezone" value={model.timezone} options={MODEL_DEFAULTS.timezones} {...field_props} />
                </div>
                <div className="panel-ctrls animated softFadeInUp">
                    <button className="btn btn-danger btn-sm" onClick={outcome.bind (this, { action: 'cancel-org-edits' })}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={save.bind (this, 'save-org')}>Confirm</button>
                </div>
            </div>
        )
    }, [ save, fieldChange, outcome, error, model ]);

    return renderer;
}

export default AddOrganization;