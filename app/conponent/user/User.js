import React from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';
import { Button, Table, Tag, Modal, BackTop } from 'antd';
import UserStore from '../../stores/UserStore';
import EditModal from './EditModal';
import AddModal from './AddModal';

import "./style.less"

const userStore = new UserStore();

@observer
export default class User extends React.Component {
  constructor(props) {
    super(props)
    this.columns = [
      {
        title: "",
        key: "id",
        width: 100,
        render: (text, record, index) => {
          return (
            <Button type="primary" onClick={()=>{this.showEditModal(record)}}>Eidt</Button>
          )
        }
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        sorter: (a, b) => a.email.substr(0, 1).charCodeAt() - b.email.substr(0, 1).charCodeAt()
      },
      {
        title: "Scope",
        render: (record) => {
          return (<RolesCell record={record} />)
        }
      },
      {
        title: "Password",
        render: () => <span>*******</span>
      }
    ];
    this.state = {
      record: ""
    }

  }

  componentWillMount() {
    const { commonStore, location } = this.props;
    var path = location.pathname.split("/")[1];
    commonStore.currentPaht = path;
    var url_param = {
      role_ids: [2, 5]
    }
    userStore.loadUsers(url_param)
  }

  showAddModal = (record) =>{
    userStore.addModalStatus = true;
  }
  closeAddModal = () =>{
    userStore.addModalStatus = false;
    userStore.is_next = true;
    userStore.canEdit = false;
  }

  showEditModal = (record) =>{
    userStore.editModalStatus = true;
    this.setState({
      record: record
    })
  }
  closeEditModal = () =>{
    userStore.editModalStatus = false;
    this.setState({
      record: ""
    })
  }

  render() {
    const { commonStore } = this.props;
    let columns = this.columns
    let records = userStore.users.slice();
    let is_loading = userStore.is_loading
    return (
      <div className="main-container user-container">
        <h1>User</h1>
        <Button type="primary"
          icon="user-add"
          className="add-button"
          onClick={this.showAddModal}>Add User</Button>
        {
          records.length == 0 ?
            null
            :
            <Table dataSource={records}
              columns={columns}
              loading={is_loading}
              pagination={false}
              rowKey={record => record.id}></Table>
        }
        <Modal title="add new admin account"
          visible={userStore.addModalStatus}
          onCancel={this.closeAddModal}
          width={"40%"}
          footer={null}
          key={`${this.state.record.id}"-add"`}>
            <AddModal userStore={userStore} />
          </Modal>

          <Modal title="eidt admin account"
          visible={userStore.editModalStatus}
          onCancel={this.closeEditModal}
          width={"40%"}
          footer={null}
          key={`${this.state.record.id}"-edit"`}>
            <EditModal record={this.state.record} />
          </Modal>
      </div>
    )
  }
}

@observer
class RolesCell extends React.Component {
  render() {
    const { record } = this.props

    return <div>
      {
        record.roles.map(item => {
          if (item.role_id == 2) {
            return <Tag color="orange-inverse" key={item.id}>{item.role_name}</Tag>
          }
          if (item.role_id == 5) {
            return <Tag color="pink-inverse" key={item.id}>{item.role_name}</Tag>
          }
          if (item.role_id == 3) {
            return <Tag color="blue-inverse" key={item.id}>{item.role_name}</Tag>
          }
          if (item.role_id == 4) {
            return <Tag color="blue-inverse" key={item.id}>{item.role_name}</Tag>
          }
          if (item.role_id == 6) {
            return <Tag color="green" key={item.id}>{item.role_name}</Tag>
          }
        })
      }
    </div>
  }
}