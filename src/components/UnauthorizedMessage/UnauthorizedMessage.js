import React from 'react';
import { Link } from 'react-router-dom';


import '../../components/ErrorOverlay/ErrorMessages.css';

const UnauthorizedMessage = (props) => {
    return (
        <div className="full-window-holder">
            <div className="middle-height">
                <div className="ErrorMessage">
                    <div className="icon">
                        <div className="disc">
                            <i className="fad fa-lock"></i>
                        </div>
                    </div>
                    <div className="head">Unauthorized</div>
                    <div className="text">You are not authorized to access this area. <Link to="/">Back</Link></div>
                </div>
            </div>
        </div>
    )
}

export default UnauthorizedMessage;

