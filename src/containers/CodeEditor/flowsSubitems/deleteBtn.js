import React  from 'react';

const deleteBtn = (props) => {
    return (
        <div onClick={props.remove.bind (this, props.position)} className={"delete-btn" + (props.disabled ? ' disabled' : '')}>
            <i className="far sorter-icn fa-trash"></i>
        </div>
    );
}

export default deleteBtn;