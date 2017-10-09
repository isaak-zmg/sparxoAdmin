import React from 'react';
import { render } from 'react-dom';
import { Route, HashRouter, Link, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';
import commonStore from '../stores/CommonStore';
import { getLocal } from '../utils';
import { currentUserKey } from '../consts';
import { Row, Col } from 'antd';

import Login from './login/Login';
import Merchant from './merchant/Merchant';
import Header from './Header';
import Sidebar from './Sidebar';
import User from './user/User';
import Language from './language/Language';
import Stripe from './stripe/Stripe';
import Test from './test/Test'

import './style.less';

//const commonStore = new CommonStore();

@observer
export default class App extends React.Component {

  constructor(props) {
    super(props)

  }

  componentWillMount() {
    const User = getLocal(currentUserKey);
    if (User) {
      commonStore.currentUser = User.currentUser;
      commonStore.accessToken = User.accessToken;
    }
  }

  render() {
    return (
      <HashRouter>
        <div>
          <Route path='/login' render={(props) => <Login commonStore={commonStore} {...props} />}></Route>
          {
            commonStore.currentUser ?
              <div className="container">
                <Header commonStore={commonStore} />
                <Row className="main-wrapper">
                  <Col xs={24} sm={24} md={6} lg={4}>
                    <Sidebar commonStore={commonStore} />
                  </Col>
                  <Col xs={0} sm={0} md={18} lg={20}>
                    <PrivateRoute path='/' component={Merchant} exact />
                    <PrivateRoute path='/merchant' component={Merchant} />
                    <PrivateRoute path='/user' component={User} />
                    <PrivateRoute path='/language' component={Language} />
                    <PrivateRoute path='/stripe' component={Stripe} />
                    <Route path='/test' exact component={Test}></Route>
                  </Col>
                </Row>
              </div>
              :
              null
            }
          
        </div>
      </HashRouter>
    )
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (
      commonStore.currentUser
        ?
        (
          <Component commonStore={commonStore} {...props} />
        )
        :
        (
          <Redirect to={{
            pathname: '/login'
          }} />
        )
    )} />
  )
}