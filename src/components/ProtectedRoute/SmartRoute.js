import React, { useCallback } from 'react';
import { Route, Redirect } from 'react-router-dom';


const SmartRoute = ({ render: render, ...rest }) => {
    const { authenticated, isUserAuthenticated } = rest;
    
    return (
        <Route 
            {...rest} 
            render={props => {
                // console.log ('=====> SmartRoute: protectedRoute?', authenticated, 'isUserAuth', isUserAuthenticated);
                if (authenticated) {
                    if (isUserAuthenticated)
                        return render (props);
                    else {
                        return <Redirect to={{
                            pathname: '/login',
                            state: {
                                from: props.location
                            }
                        }} />
                    }
                } else {
                    return render (props);
                }
            }
        } />
    )
}

export default SmartRoute