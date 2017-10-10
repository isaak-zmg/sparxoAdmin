import React from 'react';
import { render } from 'react-dom';
import { Route, HashRouter, Link, Redirect } from 'react-router-dom';
import { Row, Col } from 'antd';

import Merchant from './merchant/Merchant';
import Header from './Header';
import Sidebar from './Sidebar';
import User from './user/User';
import Language from './language/Language';
import Stripe from './stripe/Stripe';

export default class AppCon extends React.Component {
  render() {
    const { commonStore } = this.props
    return (
      <div className="container">
        <Header commonStore={commonStore} />
        <Row className="main-wrapper">
          <Col xs={24} sm={24} md={6} lg={4}>
            <Sidebar commonStore={commonStore} />
          </Col>
          <Col xs={0} sm={0} md={18} lg={20}>
            <StoreRoute path='/' exact component={Merchant} exact commonStore={commonStore} />
            <StoreRoute path='/merchant' component={Merchant} commonStore={commonStore} />
            <StoreRoute path='/user' component={User} commonStore={commonStore} />
            <StoreRoute path='/language' component={Language} commonStore={commonStore} />
            <StoreRoute path='/stripe' component={Stripe} commonStore={commonStore} />
          </Col>
        </Row>
      </div>
    )
  }
}

const StoreRoute = ({ component: Component, commonStore, ...rest }) => {
  
  return (
    <Route {...rest} render={props => (
      <Component commonStore={commonStore} {...props} />

    )} />
  )
}