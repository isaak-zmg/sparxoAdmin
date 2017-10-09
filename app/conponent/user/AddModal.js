import React from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react'
import { Button, Row, Col, Input, message, Select } from 'antd';
import { emailValidate } from '../../utils';
import { apiConf } from '../../consts'
import { arrayRemoveByValue } from '../../utils'

const Option = Select.Option

@observer
export default class AddModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: ""
    }
  }

  handleInputChange = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  handleNext = () => {
    const { userStore } = this.props;
    const { inputValue } = this.state;
    if (!inputValue) {
      return message.error("Email can't be null!")
    }
    if (emailValidate(inputValue)) {
      var url_param = {
        email_address: inputValue
      }
      userStore.getAddUserInfo(url_param);
    } else {
      return message.error("Please enter the email in the correct format!")
    }

  }

  render() {
    const { userStore } = this.props;
    const { inputValue } = this.state;
    return (
      <div className="addModal">
        <Row>
          <Col span={4} className="input-label">Email:</Col>
          <Col span={20}>
            <Input size="large"
              disabled={userStore.canEdit}
              defaultValue={userStore.defaultAddValue}
              onChange={this.handleInputChange}
            ></Input>
          </Col>
        </Row>
        {
          userStore.is_next ?
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={this.handleNext}>Next</Button>
              </Col>
            </Row>
            :
            <div>
              {
                userStore.currentUser == null ?
                  <NoExistUser email={inputValue} userStore={userStore} />
                  :
                  <ExistUser userStore={userStore} />
              }
            </div>
        }

      </div>
    )
  }
}


@observer
class ExistUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      role_ids: [],
      password: "",
      defaultSelect: []
    }
  }

  componentWillMount() {
    const { userStore } = this.props;
    const { role_ids, defaultSelect } = this.state;
    var roles = userStore.currentUser.roles;
    roles.forEach(ele => {
      role_ids.push(ele.role_id.toString())
    })
    role_ids.forEach(ele => {
      if (ele == apiConf.role_ids.Admin) {
        defaultSelect.push(ele)
      }
      if (ele == apiConf.role_ids.MerchantRep) {
        defaultSelect.push(ele)
      }
    })
  }

  handleChange = (value) => {
    const { role_ids } = this.state;
    for (var i = 0; i < value.length; i++) {
      if (role_ids.indexOf(value[i]) == -1) {
        role_ids.push(value[i])
      }
    }
    if (value.indexOf('2') == -1 && role_ids.indexOf('2') != -1) {
      arrayRemoveByValue(role_ids, "2")
    }
    if (value.indexOf('5') == -1 && role_ids.indexOf('5') != -1) {
      arrayRemoveByValue(role_ids, "5")
    }
  }

  handleSave = () => {
    const { role_ids } = this.state;
    const { userStore } = this.props
    let postData = {};
    postData = {
      role_ids
    }
    userStore.saveAdd_edit(postData)

  }
  render() {
    const { role_ids, defaultSelect } = this.state;
    const { userStore } = this.props
    return (
      <div>
        <Row>
          <Col span={4} className="input-label">Scope:</Col>
          <Col span={20}>
            <Select mode="multiple"
              size="large"
              style={{ width: '100%' }}
              onChange={this.handleChange}
              defaultValue={defaultSelect}>
              <Option value="2">Admin</Option>
              <Option value="5">MerchantRep</Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.handleSave} loading={userStore.add_loading}>Save</Button>
          </Col>
        </Row>
      </div>
    )
  }
}


@observer
class NoExistUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      passwordValue: "",
      role_ids: []
    }
  }

  handleChange = (value) => {
    const { role_ids } = this.state;
    this.setState({
      role_ids: value
    })
  }

  passwordChange = (e) => {
    this.setState({
      passwordValue: e.target.value
    })
  }

  handleSave = () => {
    const {email,userStore} = this.props;
    const {role_ids,passwordValue} = this.state;
    var postData = {
      email_address: email,
      password:passwordValue,
      role_ids
    }
    userStore.saveAdd(postData)
  }

  render() {
    const { passwordValue, role_ids } = this.state;
    const {userStore} = this.props
    var canSave = passwordValue!=""&&role_ids.length!=0 ? true: false
    return (
      <div>
        <Row>
          <Col span={4} className="input-label">Scope:</Col>
          <Col span={20}>
            <Select mode='multiple'
              size="large"
              style={{ width: '100%' }}
              onChange={this.handleChange}>
              <Option value="2">Admin</Option>
              <Option value="5">MerchantRep</Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="input-label">Password:</Col>
          <Col span={20}>
            <Input onChange={this.passwordChange}></Input>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary"
              onClick={this.handleSave}
              disabled={!canSave}
              loading={userStore.add_loading}
            >Save</Button>
          </Col>
        </Row>
      </div>
    )
  }
}