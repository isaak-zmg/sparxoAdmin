import React from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';
import StripeStore from '../../stores/StripeStore';
import { Button, Table, Modal } from 'antd'
import EditModal from './EditModal'
import './style.less'

const stripeStore = new StripeStore();

@observer
export default class Stripe extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      record: ""
    }
    this.columns = [
      {
        title: "Currency",
        dataIndex: "currency",
        key: "currency"
      },
      {
        title: "Transaction Percent",
        dataIndex: "transaction_percent",
        key: "transaction_percent",
        render: (text,record,index)=>(<PercentCell record={record} />)
      },
      {
        title: "Transacton Fix Fee",
        dataIndex: "transacton_fix_fee",
        key: "transacton_fix_fee",
        render: (text,record,index)=>(<FeeCell record={record} />)
      },
      {
        title: "",
        render: (text, record, index) => {
          return <Button type="primary" icon="edit" onClick={()=>{this.showEditModal(record)}}></Button>
        }
      }
    ]
  }

  componentWillMount() {
    const { commonStore, location } = this.props;
    var path = location.pathname.split("/")[1];
    commonStore.currentPath = path;
    stripeStore.loadStripeMethods();
  }

  showEditModal = (record) =>{
    stripeStore.editModalStatus = true;
    this.setState({
      record: record
    })
  }
  closeEditModal = () =>{
    stripeStore.editModalStatus = false;
    this.setState({
      record: ""
    })
  }

  render() {
    const { commonStore } = this.props;
    const items = stripeStore.stripeMethods;

    let columns = this.columns
    return (
      <div className="main-container">
        <h1>Stripe Setting</h1>
        <Table dataSource={items}
          columns={columns}
          pagination={false}
          loading={stripeStore.is_fetching}
          rowKey="currency"></Table>

          <Modal title="Set Stripe Fee Setting"
            visible={stripeStore.editModalStatus}
            onCancel={this.closeEditModal}
            width={800}
            footer={null}
            key={`${this.state.record.currency}"-edit"`}>
              <EditModal record={this.state.record}></EditModal>
          </Modal>
      </div>
    )
  }
}


@observer
class PercentCell extends React.Component{
  render(){
    const {record} = this.props
    debugger
    return (<span>{record.transaction_percent}</span>)
  }
}

@observer
class FeeCell extends React.Component{
  render(){
    const {record} = this.props
    debugger
    return (<span>{record.transacton_fix_fee}</span>)
  }
}