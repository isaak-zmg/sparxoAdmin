import React from 'react';
import { render } from "react-dom";
import { observer } from 'mobx-react'
import { AutoComplete, Button, Row, Col, message } from 'antd';
import commonStore from '../../stores/CommonStore';
import { apiConf } from '../../consts'
import { is_exist } from "../../utils";
import $ from 'jquery';


@observer
export default class SparxoRep extends React.Component {
  timer;
  state = {
    rep_email_arr: []
  }


  handlerChange = (value) => {
    const { merchantStore } = this.props
    if (value) {
      var url_param = {
        email_address: value,
        role_ids: [apiConf.role_ids.Admin, apiConf.role_ids.MerchantRep]
      }
      if (this.timer == null) {
        this.timer = setTimeout(function () {
          merchantStore.getRepGroup(url_param);
        }, 700);
      } else {
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
          merchantStore.getRepGroup(url_param);
        }, 700);
      }
    }
  }

  handleSave = () => {
    const { merchantStore, record } = this.props;

    var repSelect = $(".repSelect input");
    var repSelectValue = $.trim(repSelect.val())

    if (!repSelectValue) {
      if (record.merchant_rep_email_address) {
        record.unassigned(record.merchant_rep.id)
      } else {
        return message.warning("Please enter the correct email!")
      }
    } else {
      if (is_exist(repSelectValue, merchantStore.repGroup_email)) {
        var select_rep = merchantStore.repGroup.filter(item => {
          return item.email == repSelectValue
        });
        record.assigned(select_rep[0])
        $(".repSelect input").value = ""
      } else {
        return message.warning("Please enter the correct email!")
      }
    }

  }
  render() {
    const { merchantStore, record } = this.props

    return (
      <div>
        <Row>
          <Col span={2}></Col>
          <Col span={18}>
            <AutoComplete style={{ width: 400 }}
              dataSource={merchantStore.repGroup_email}
              onChange={this.handlerChange}
              className="repSelect"></AutoComplete>
          </Col>
          <Col span={4}>
            <Button type="primary"
              style={{ fontSize: 16 }}
              loading={record.isloading}
              onClick={this.handleSave}>save</Button>
          </Col>
        </Row>
      </div>
    )
  }
}