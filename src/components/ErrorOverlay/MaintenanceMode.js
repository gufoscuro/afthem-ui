import React from 'react';

import './ErrorMessages.css';


const maintenanceMode = (props) => {
    return (
        <div className="ErrorMessage maintenance">
            <div className="icon">
                <div className="disc">
                    <i className="fad fa-wrench"></i>
                    {/* <i className="far fa-sync fa-spin"></i> */}
                </div>
            </div>
            <div className="head">Manuntenzione</div>
            <div className="text">E' in corso un intervento di manutenzione alla web application. Sarà nuovamente disponibile tra pochi minuti.</div>
        </div>
    );
}

export default maintenanceMode;