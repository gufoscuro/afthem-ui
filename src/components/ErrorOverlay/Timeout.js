import React from 'react';

import ModalPanel from '../../components/ModalPanel/ModalPanel';
import PopupMessage from '../ModalPanel/PopupMessage';

const Timeout = (props) => {
    return (
        <ModalPanel active={true}>
            <PopupMessage 
                heading="Request Timeout" 
                text="The server is taking very long to respond, therefore the request will be terminated." 
                clickHandler={() => { window.location.reload () }} />
        </ModalPanel>
    )
}

export default Timeout;