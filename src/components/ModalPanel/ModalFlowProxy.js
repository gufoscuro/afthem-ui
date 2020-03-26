import React, { useState, useCallback, useMemo } from 'react';

import ModalPanel from '../../components/ModalPanel/ModalPanel';

const ModalFlow = (props) => {
    

    const renderer = useMemo (() => {
        let field_props = { change: fieldChange };

        return (
            <ModalPanel active={true}>
                
            </ModalPanel>
        )
    }, [ fieldChange, model, error, saveProfile, setUsrProfileStatus, disabled ]);

    return renderer;
}

export default ModalFlow;