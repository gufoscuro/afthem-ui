import React, { useMemo, useState, useCallback } from 'react';
// import { Link } from 'react-router-dom';

import SimpleFormField from '../../components/SimpleFormField/SimpleFormField';
import ModelUtil from '../../libs/js/model-util';
import ClusterModel from '../../modelEntities/Cluster';

import './AddCluster.css';


function AddCluster (props) {
    const model_schema = ClusterModel.schema;
    let { data, outcome } = props;
    const [ error, setError ] = useState (null);
    const [ model, setModel ] = useState (data !== null ? data : ModelUtil.getDefaults (model_schema));
    const [ disabled, setDisabled ] = useState (false)
    


    const fieldChange = useCallback ((name, value) => {
        setModel ((prevModel) => {
            let m = { ...prevModel };
            m[name] = value;
            return m;
        })
    }, [ ]);

    const backend_error = useCallback ((error) => {
        setDisabled (false);
        if (error.response && error.response.data && error.response.data.message)
            setError (error.response.data.message);
        else
            setError ('We\'re sorry, something went wrong.');
    }, [ setError ]);
    
    const saveCluster = useCallback (() => {
        let data = { ...model };
        ModelUtil.checkByModel (model_schema, data).then ((result) => {
            // console.log ('validation', result);
            if (result.valid) {
                setError (null);
                setDisabled (true);
                outcome ({
                    action: 'save-cluster',
                    data: {...model},
                    error: backend_error
                })
            } else {
                setError ('Please fill all the required fields.');
                setDisabled (false);
            }
        })
    }, [ outcome, model, backend_error, model_schema ]);

    let renderer = useMemo (() => {
        let field_props = { change: fieldChange }

        return (
            <div className="AddUser">
                <div className={"panel-content" + (disabled ? ' disabled' : '')}>
                    <div className="heading">{model.id ? 'Edit Cluster' : 'Add Cluster'}</div>
                    {error && (<div className="error-message animated fadeIn">{error}</div>)}
                    <SimpleFormField type="text" label="Name" name="name" value={model.name} {...field_props} />
                    <SimpleFormField type="text" label="Description" name="description" value={model.description} {...field_props} />
                    <SimpleFormField type="text" label="Git Url" name="gitUrl" value={model.gitUrl} {...field_props} />
                    {/* <SimpleFormField type="text" label="Git Username" name="gitUsername" value={model.gitUsername} {...field_props} />
                    <SimpleFormField type="text" label="Git Password" name="gitPassword" value={model.gitPassword} {...field_props} /> */}
                    <div className="disabled-layer"></div>
                </div>
                <div className="panel-ctrls animated softFadeInUp">
                    <button disabled={disabled} className="btn btn-danger btn-sm" onClick={outcome.bind (this, { action: 'cancel-cluster-edits' })}>Cancel</button>
                    <button disabled={disabled} className="btn btn-primary btn-sm" onClick={saveCluster}>Confirm</button>
                </div>
            </div>
        )
    }, [ saveCluster, outcome, error, model, disabled, fieldChange ]);

    return renderer;
}

export default AddCluster;