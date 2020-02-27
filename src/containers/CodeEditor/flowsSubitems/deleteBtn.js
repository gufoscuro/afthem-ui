import React  from 'react';

const deleteBtn = (props) => {
    return (
        <div className={"delete-btn" + (props.disabled ? ' disabled' : '')}>
            <i onClick={props.remove.bind (this, props.position)} className="far sorter-icn fa-trash"></i>
        </div>
    );
}

export default deleteBtn;