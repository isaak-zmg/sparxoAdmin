import React from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';
import { apiConf } from '../../consts'
import { Row, Col, AutoComplete, Button, Input, Icon, message } from 'antd';
import $ from 'jquery';
import { is_exist } from "../../utils";



@observer
export default class Collaborator extends React.Component {
  timer;

  componentWillMount() {
    const { record } = this.props;
    record.getCollaborator();
  }

  handlerChange = (value) => {
    const { merchantStore } = this.props;
    if (value) {
      var url_param = {
        email_address: value,
        role_ids: [apiConf.role_ids.Merchant]
      }
      if (this.timer == null) {
        this.timer = setTimeout(() => {
          merchantStore.getCollaboratorGroup(url_param)
        }, 700)
      } else {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          merchantStore.getCollaboratorGroup(url_param)
        }, 700)
      }
    }
  }

  handleAdd = () => {
    const { merchantStore, record } = this.props;
    var select_value = $.trim($(".select input").val())
    if (!select_value) {
      message.warn("can't be null")
    } else {
      if (select_value === record.email) {
        message.error("can't add yourself!")
      } else {
        var postData = {
          collaborator_id: ""
        }
        if (is_exist(select_value, merchantStore.collaboratorGroup_email)) {
          var select_temp = merchantStore.collaboratorGroup.filter(item => {
            return item.email == select_value
          })
          postData.collaborator_id = select_temp[0].id
          record.setCollaborator(postData)
        } else {
          return message.warning("Please enter the correct email!")
        }
      }
    }
  }

  render() {
    const { record, merchantStore } = this.props

    return (
      <div className="collaborator-modal">
        <Row className="row">
          <Col span={6} className="left-span">Main</Col>
          <Col span={18} className="right-span">{record.email}</Col>
        </Row>
        <Row className="row">
          <Col span={6} className="left-span">Children</Col>
          <Col span={18} className="right-span">
            <Row>
              <Col span={20}>
                <AutoComplete style={{ width: '100%' }}
                  onChange={this.handlerChange}
                  dataSource={merchantStore.collaboratorGroup_email}
                  className="select">
                </AutoComplete>
              </Col>
              <Col span={4}>
                <Button style={{ marginLeft: 10 }}
                  onClick={this.handleAdd}
                  loading={record.isloading}>Add</Button>
              </Col>
            </Row>
          </Col>
        </Row>
        {
          record.collaborators.length > 0 ?
            <Row>
              <Col span={6}></Col>
              <Col span={18}>
                <Listviews record={record} items={record.collaborators}></Listviews>
              </Col>
            </Row>
            :
            null
        }

      </div>
    )
  }
}

@observer
class Listviews extends React.Component {
  handleDelete = (item) =>{
    const {record} = this.props;
    var url_param ={
      collaboratorId: item.id
    }
    record.delectCollaborator(url_param)
  }

  render() {
    const { items, record } = this.props;
    return (<ul className="collaborator-list">
      {items.map(item => <li key={item.id}>
        <span>{item.email}</span>
        <a className="badge" onClick={()=>{this.handleDelete(item)}}>×</a>
      </li>)}
    </ul>)
  }
}
