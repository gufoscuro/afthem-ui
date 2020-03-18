import React, { useMemo, useState, useCallback } from 'react';

import SimpleFormField from '../../components/SimpleFormField/SimpleFormField';
// import ModelUtil from '../../libs/js/model-util';
// import ClusterModel from '../../modelEntities/Cluster';


function AddFlow (props) {
    let { outcome } = props;
    const [ error, setError ] = useState (null);
    const [ name, setName ] = useState ('');
    const [ disabled, setDisabled ] = useState (false)
    


    const fieldChange = useCallback ((name, value) => {
        setName (value.toLowerCase())
    }, [ ]);

    const backend_error = useCallback ((error) => {
        setDisabled (false);
        if (error.response && error.response.data && error.response.data.message)
            setError ('Server: ' + error.response.data.message);
        else
            setError ('We\'re sorry, something went wrong.');
    }, [ setError ]);
    
    const save = useCallback (() => {
        if (name.trim() !== '') {
            setError (null);
            setDisabled (true);
            outcome ({
                action: 'confirm',
                data: {
                    name: name
                },
                error: backend_error
            })
        } else {
            setError ('The name can\'t be empty.');
            setDisabled (false);
        }
    }, [ outcome, name ]);

    let renderer = useMemo (() => {
        let field_props = { change: fieldChange }

        return (
            <div className="BasicPanel">
                <div className={"panel-content" + (disabled ? ' disabled' : '')}>
                    <div className="heading">Create Flow</div>
                    {error && (<div className="error-message animated fadeIn">{error}</div>)}
                    <SimpleFormField type="text" label="Name" name="name" value={name} {...field_props} />
                    <div className="disabled-layer"></div>
                </div>
                <div className="panel-ctrls animated softFadeInUp">
                    <button disabled={disabled} className="btn btn-danger btn-sm" onClick={outcome.bind (this, { action: 'cancel' })}>Cancel</button>
                    <button disabled={disabled} className="btn btn-primary btn-sm" onClick={save}>Confirm</button>
                </div>
            </div>
        )
    }, [ save, name, outcome, error, disabled ]);

    return renderer;
}

export default AddFlow;