import React, { useState, useCallback } from 'react';

import ModalPanel from '../../components/ModalPanel/ModalPanel';
import PopupMessage from '../ModalPanel/PopupMessage';

const GenericError = (props) => {
    const { heading = 'Error', text = 'Sorry, something went wrong.', onClose } = props;
    const [ active, setActive ] = useState (true);

    const disposeError = useCallback (() => {
        setActive (false);
        if (typeof (onClose) === 'function')
            onClose ();
    }, [ onClose ]);

    return (
        <ModalPanel active={active}>
            <PopupMessage heading={heading} text={text} clickHandler={disposeError} />
        </ModalPanel>
    )
}

export default GenericError;