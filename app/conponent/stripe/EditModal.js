import React from 'react';
import { render } from 'react-dom';
import { Input, Row, Col, Button } from 'antd';
import {observer} from 'mobx-react';


@observer
export default class EditModal extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      transaction_percent: this.props.record.transaction_percent,
      transacton_fix_fee: this.props.record.transacton_fix_fee
    }
  }

  percentChange = (e) =>{
    this.setState({
      transaction_percent: e.target.value
    })
  }

  feeChange = (e) =>{
    this.setState({
      transacton_fix_fee: e.target.value
    })
  }

  save = () =>{
    const {transaction_percent, transacton_fix_fee} = this.state
    const {record} = this.props;
    var postData = {
      currency: record.currency,
      transaction_percent: transaction_percent,
      transacton_fix_fee: transacton_fix_fee
    }
    record.saveEdit(postData)
  }

  render(){
    const {record} = this.props
    
    return (
      <div className="editModal">
        <Row>
          <Col span={6} className="input-label">Currency</Col>
          <Col span={18}>
          {record.currency}
          </Col>
        </Row>
        <Row>
          <Col span={6} className="input-label">Transaction Percent</Col>
          <Col span={18}>
          <Input size="large"
            defaultValue={record.transaction_percent}
            onChange={this.percentChange}></Input>
          </Col>
        </Row>
        <Row>
          <Col span={6} className="input-label">Transacton Fix Fee</Col>
          <Col span={18}>
          <Input size="large"
            defaultValue={record.transacton_fix_fee}
            onChange={this.feeChange}></Input>
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