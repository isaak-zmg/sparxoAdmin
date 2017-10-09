import React from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';
import LoginForm from './LoginForm'
import { Form } from 'antd';
import { Redirect } from 'react-router-dom';


import './style.less';



@observer
export default class Login extends React.Component {
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { commonStore } = this.props;
    const WrappedLoginForm = Form.create()(LoginForm);

    if (commonStore.currentUser) {
      return (
        <Redirect to={from} />
      )
    }

    return (
      <div className="login-container">
        <div className="login-wraper">
          <div className='login-logo'>
            <img src="../../images/new_logo.png" alt="" />
            <h1>Sparxo</h1>
          </div>
          <WrappedLoginForm store={commonStore} />
        </div>
      </div>
    )
  }
}