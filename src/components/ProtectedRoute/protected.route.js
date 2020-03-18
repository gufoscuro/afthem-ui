import React, { useCallback } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ render: render, ...rest }) => {
    const isAuthenticated = useCallback (() => {
        return Cookies.get ('auth') !== undefined
    }, []);

    return (
        <Route 
            {...rest} 
            render={props => {
                if (isAuthenticated ())
                    return render (props);
                else {
                    return <Redirect to={{
                        pathname: '/login',
                        state: {
                            from: props.location
                        }
                    }} />
                }
            }
        } />
    )
}

export default ProtectedRoute