import React, { Component } from 'react';

import './ErrorOverlay.css';

class ErrorOverlay extends Component {
    state = {
        active: false,
        closing: false
    }

    static getDerivedStateFromProps (props, state) {
        let new_state = {}

        if (props.active === true)
            new_state.active = true;

        if (props.active === false && state.active === true) {
            new_state.active = false;
            new_state.closing = true;
        }

        return new_state;
    }

    closeFlow = () => {
        if (this.state.closing === true)
            setTimeout (() => {
                this.setState ({ closing: false });
            }, 300);
    }

    render () {
        let clsses = [],
            close_trigger;

        if (this.state.active === true) {
            clsses.push ('fadeIn');
            clsses.push ('active');
        } else if (this.state.closing === true) {
            clsses.push ('fadeOut');
            clsses.push ('active');
            this.closeFlow ();
        }

        // if (this.props.clickHandler) {
        //     close_trigger = (
        //         <div className="basic-button" onClick={this.props.clickHandler.bind (this, 'close-modal-panel')}>
        //             <i className="far fa-times"></i>
        //         </div>
        //     );
        // }

        return (
            <div className={"ErrorOverlay animated " + clsses.join (" ")}>
                <div className="ErrorModal">
                    <div className="fx animated softFadeInUp">
                        <div className="panel-triggers">
                            {close_trigger}
                        </div>
                        <div className="target">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorOverlay;