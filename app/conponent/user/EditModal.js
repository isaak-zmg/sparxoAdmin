import React from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react'
import { Row, Col, Input, Select, Button } from 'antd';
import { apiConf } from '../../consts'
import { arrayRemoveByValue } from '../../utils'

const Option = Select.Option

@observer
export default class EditModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      role_ids: [],
      password: "",
      defaultSelect: []
    }
  }

  componentWillMount() {
    const { role_ids, defaultSelect } = this.state;
    const { roles } = this.props.record;
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

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  save = () => {
    const { role_ids, password } = this.state;
    const { record } = this.props;
    let postData = {}
    if(!password){
      postData = {
        role_ids
      }
      record.saveEdit(postData)
    }else{
      postData = {
        role_ids,
        password
      }
      record.saveEdit(postData)
    }
  }

  render() {
    const { record } = this.props;
    const { role_ids, defaultSelect } = this.state;
    return (
      <div className="editModal">
        <Row>
          <Col span={4} className="input-label">Email:</Col>
          <Col span={20}>{record.email}</Col>
        </Row>
        <Row>
          <Col span={4} className="input-label">Scope:</Col>
          <Col span={20}>
            <Select mode='multiple'
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
          <Col span={4} className="input-label">Password:</Col>
          <Col span={20}>
            <Input onChange={this.handlePasswordChange}></Input>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary"
              onClick={this.save}
              loading={record.edit_loading}>Save</Button>
          </Col>
        </Row>
      </div>
    )
  }
}