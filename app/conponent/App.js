import React from 'react';
import { render } from 'react-dom';
import { Route, HashRouter, Link, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';
import commonStore from '../stores/CommonStore';
import { getLocal } from '../utils';
import { currentUserKey } from '../consts';


import AppCon from './AppCon'
import Login from './login/Login';
import Test from './test/Test'

import './style.less';


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
          <Route path='/test' exact component={Test}></Route>
          <PrivateRoute path="/" component={AppCon} commonStore={commonStore} />
        </div>
      </HashRouter>
    )
  }
}

const PrivateRoute = ({ component: Component,commonStore, ...rest }) => {
  
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