import React, { useCallback } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ render: render, ...rest }) => {
    // console.log ('protectedroute', {...rest})
    return (
        <Route 
            {...rest} 
            render={props => {
                console.log ({...rest})
                if (Cookies.get ('auth') !== undefined)
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