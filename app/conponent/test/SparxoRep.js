import React from 'react';
import { render } from "react-dom";
import { observer } from 'mobx-react'
import { Input, Button, Row, Col, message } from 'antd';
import $ from 'jquery';

@observer
export default class SparxoRep extends React.Component{
  handleSave = () =>{
    const {testStore,record} = this.props;
    testStore.delete(record.id)
  }

  handlerChange = () =>{
   
    // var repSelect = $(".repSelect");
    // var repSelectValue = $.trim(repSelect.val())
    
  }

  render() {
    const { merchantStore } = this.props
    return (
      <div>
        <Row>
          <Col span={2}></Col>
          <Col span={18}>
            <Input style={{ width: 400 }}
              onChange={this.handlerChange}
              className="repSelect"></Input>
          </Col>
          <Col span={4}>
            <Button type="primary"
              style={{ fontSize: 16 }}
              onClick={this.handleSave}>save</Button>
          </Col>
        </Row>
      </div>
    )
  }
}