import React from 'react';
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const GuardedRoute = ({ component: Component, token, ...rest }) => {
console.log(token, ' the token', Component)

    return (
        <Route {...rest} render={(props) => (
            token
                ? <Component {...props} />
                : <Redirect to={{pathname: '/Login', state: { from: props.location}}} />
        )} />
    )
}


// export default GuardedRoute;
const mapStateToProps = ({ auth }) => ({
	token: auth.token,
});

export default connect(mapStateToProps, null)(GuardedRoute);
