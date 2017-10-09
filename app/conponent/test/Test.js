import React from 'react'
import {render} from 'react-dom'
import {Table,Modal} from 'antd';
import TestStore from './TestStore'
import { observer } from 'mobx-react';
import SparxoRep from './SparxoRep'

const testStore = new TestStore();


@observer
export default class Test extends React.Component{
  state = {
    repModalVisible: false,
    otherEventsModalVisible: false,
    record: ""
  }

  showRepModal = (record) => {
    this.setState({
      repModalVisible: true,
      record: record
    })
  }

  closeRepModal = () => {
    this.setState({
      repModalVisible: false,
      record: ''
    })
  }

  componentWillMount() {
    testStore.loadData();
  }
  
  render(){
    var str = ""
    const columns = [
      {
        title: "Email",
        dataIndex: 'email',
        key: "id",
        render: (text, record, index) =>{
          return (
            <div>
              <span onClick={()=>{this.showRepModal(record)}}>{text}</span>
            </div>
          )
        }
      }
    ]

    const records = testStore.items.slice();
    if(records.length != 0){
      str = records[0].email;
    }
    
    return <div>
      ${str}
      <Table dataSource={records}
        rowKey="id"
        columns={columns}>
      </Table>
      <Modal title="Sparxo Rep"
          visible={this.state.repModalVisible}
          onCancel={this.closeRepModal}
          footer={null}
          width={600}
          key={`${this.state.record.id}+"rep"`}>
          <SparxoRep record={this.state.record} testStore={testStore}></SparxoRep>
        </Modal>
    </div>
  }

}