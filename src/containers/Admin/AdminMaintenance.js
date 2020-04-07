import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';

import FadeinFX from '../../hoc/FadeinFX';
// import ModalPanel from '../../components/ModalPanel/ModalPanel';
// import AddOrganization from './AddOrganization';
// import Dialog from '../../components/ModalPanel/Dialog';


function AdminMaintenance (props) {
    const { appBackground, appConfirm, axiosInstance } = props;
    const [ pullBusy, setPullBusy ] = useState (false);
    const [ error, setError ] = useState (null);

    const pullBaseRepository = useCallback (() => {
        if (pullBusy === false) {
            setPullBusy (true);
            appBackground (true);
            setError (null);
            axiosInstance.post ('/api/maintenance/pullBaseRepository').then (response => {
                appBackground (false)
                setPullBusy (false);
                appConfirm ();
            }).catch (e => {
                if (e && e.response && e.response.data && e.response.data.message)
                    setError (e.response.data.message);
                    
                appBackground (false)
                setPullBusy (false);
            })
        }
    }, [ axiosInstance, appBackground ]);

    return (
        <div className="WithSidebar width75">
            <FadeinFX delay={2}>
                <div className="p-10">
                    <button className="btn btn-sm btn-primary" disabled={pullBusy} onClick={pullBaseRepository}>
                        { pullBusy ? 'Updating' : 'Update base repository' }
                        { pullBusy ? <i className="far fa-sync fa-spin busy-icn"></i> : null }
                    </button>
                    {error && <div className="inline-error animated fadeIn">{error}</div>}
                </div>
            </FadeinFX>
        </div>
    )
}

export default React.memo (AdminMaintenance);