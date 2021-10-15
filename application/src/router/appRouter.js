import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Main, Login, OrderForm, ViewOrders } from '../components';
import GuardedRoute from "./GuardedRoute";
import { connect } from "react-redux";

const AppRouter = (props) => {
  return (
    <Router>
      <Route path="/" exact component={Main} />
      <Route path="/login" exact component={Login} />
      {/* <Route path="/order" exact component={OrderForm} />
      <Route path="/order/:id" exact component={OrderForm} />
      <Route path="/view-orders" exact component={ViewOrders} /> */}
      <GuardedRoute path='/order' component={OrderForm} exact token={props.token} />
      <GuardedRoute path='/order/:id' component={OrderForm} exact token={props.token} />
      <GuardedRoute path='/view-orders' component={ViewOrders} exact token={props.token} />


    </Router>
  );
}

// export default AppRouter;
const mapStateToProps = ({ auth }) => ({
	token: auth.token,
});

export default connect(mapStateToProps, null)(AppRouter);
