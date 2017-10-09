import React from 'react';
import { render } from 'react-dom';

import { Form, Icon, Input, Button, Message } from 'antd';
const FormItem = Form.Item;

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props)
  }

  handleSubmit = (e) => {
    const { store } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        store.login(values);
      }
    })
  }
  handleTestClick = () =>{
    const { store } = this.props;
    store.test();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { store } = this.props;

    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {
              getFieldDecorator('username', {
                rules: [{ required: true, Message: 'Please input your username!' }]
              })(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                  placeholder="Username"
                  size="large" />
                )
            }
          </FormItem>
          <FormItem>
            {
              getFieldDecorator('password', {
                rules: [{ required: true, message: "Please input your password!" }]
              })(
                <Input prefix={<Icon type='lock' style={{ fontSize: 13 }} />}
                  type='password'
                  placeholder="Password" />
                )
            }
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button">Log in</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}