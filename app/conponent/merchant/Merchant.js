import React from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';
import MerchantStore from '../../stores/MerchantStore';
import { Table, Checkbox, Modal, Input, Switch, Select, Popconfirm, Spin, Row, Col, Button, message } from 'antd';
import { toJS } from 'mobx';
import { currencyFormat, timeFormat } from '../../utils';
import moment from 'moment'

import SparxoRep from './SparxoRep';
import EditableCell from '../common/EditableCell';
import Collaborator from './Collaborator';
import StripeAccount from './StripeAccount';
import EventsList from "./EventsList";

import "./style.less";


const merchantStore = new MerchantStore()
const Search = Input.Search;
const Option = Select.Option;



@observer
export default class Merchant extends React.Component {
  constructor(props) {
    super(props)
    this.columns = [
      {
        title: "Sparxo Rep",
        dataIndex: "merchant_rep_email_address",
        key: "merchant_rep_email_address",
        render: (text, record, index) => {
          return (<MerchantCell record={record} onClick={() => { this.showModal(record, "sparxoRep") }} />)
        }
      },
      {
        title: "Notes",
        dataIndex: "remark",
        key: "remark",
        render: (text, record, index) => {
          return (
            <EditableCell type={"remark"} record={record} onChange={this.onCellChange(record, 'remark')} />
          )
        }
      },
      {
        title: "Collaborator",
        render: (text, record, index) => {
          return (
            <div>
              <span className="collaborator"
                onClick={() => { this.showModal(record, "collaborator") }}>Edit</span>
            </div>
          )
        }
      },
      {
        title: "AccountID",
        dataIndex: 'id',
        key: "id"
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        sorter: (a, b) => a.email.substr(0, 1).charCodeAt() - b.email.substr(0, 1).charCodeAt()
      },
      {
        title: "First Name",
        dataIndex: "first_name",
        key: "first_name"
      },
      {
        title: "Last Name",
        dataIndex: "last_name",
        key: "last_name"
      },
      {
        title: "Phone Number",
        dataIndex: "phone_number",
        key: "phone_number"
      },
      {
        title: "Date Signed UP",
        dataIndex: "create_time",
        key: "create_time",
        sorter: (a, b) => moment(a.create_time).unix() - moment(b.create_time).unix(),
        render: (text, record, index) => {
          return <span>{timeFormat(text)}</span>
        }
      },
      {
        title: "Website",
        dataIndex: "website",
        key: "website"
      },
      {
        title: "Total Sparxo Fee Processed",
        dataIndex: "sparxo_fee",
        key: "sparxo_fee",
        sorter: (a, b) => a.sparxo_fee - b.sparxo_fee,
        render: (text, record, index) => {
          return <span>{currencyFormat(text)}</span>
        }
      },
      {
        title: "Total Processed",
        dataIndex: "amount",
        key: "amount",
        sorter: (a, b) => a.amount - b.amount,
        render: (text, record, index) => {
          return <span>{currencyFormat(text)}</span>
        }
      },
      {
        title: "Stripe Account",
        render: (text, record, index) => {
          return (
            <div>
              <span className="stripeAccount"
                onClick={() => { this.showModal(record, "stripeAccount") }}>Details</span>
            </div>
          )
        }
      },
      {
        title: "Closest Event",
        dataIndex: "closest_event_begin_time_utc",
        key: "closest_event_begin_time_utc",
        render: (text, record, index) => {
          return <span>{!text ? "null" : timeFormat(text)}</span>
        }
      },
      {
        title: "30 Days Active",
        dataIndex: "has_recent_events",
        key: "has_recent_events",
        render: (text, record, index) => {
          return <span>{text ? "YES" : "NO"}</span>
        }
      },
      {
        title: "Ticket Fee",
        dataIndex: "ticket_sparxo_fee_expression",
        key: "ticket_sparxo_fee_expression",
        render: (text, record, index) => {
          return (
            <EditableCell type={"ticket_sparxo_fee_expression"} record={record} onChange={this.onCellChange(record, "ticketFee")} />
          )
        }
      },
      {
        title: "Donation Fee",
        dataIndex: "donation_sparxo_fee_expression",
        key: "donation_sparxo_fee_expression",
        render: (text, record, index) => {
          return (
            <EditableCell type={"donation_sparxo_fee_expression"} record={record} onChange={this.onCellChange(record, "donationFee")} />
          )
        }
      },
      {
        title: "Number Of Events",
        dataIndex: "events_count",
        key: "events_count",
        sorter: (a, b) => a.events_count - b.events_count,
        render: (text, record, index) => (
          <div>
            <span className="events_count"
              onClick={() => { this.showModal(record, "eventsCount") }}>{text}</span>
          </div>

        )
      },
      {
        title: "Production",
        dataIndex: "is_production",
        key: "is_production",
        render: (text, record, index) => (
          <ProductionCell record={record} onChange={this.onCellChange(record, "production")} />
        )
      },
      {
        title: "Password",
        render: (text, record, index) => (
          <div>
            <span className="password"
              onClick={() => { this.showModal(record, "password") }}>password</span>
          </div>
        )
      },
      {
        title: "Developer",
        dataIndex: "is_developer",
        key: "is_developer",
        render: (text, record, index) => (
          <div>
            <DeveloperCell record={record} onChange={this.onCellChange(record, "developer")} />
          </div>
        )
      }
    ];
    this.state = {
      sparxoRep: false,
      collaborator: false,
      eventsCount: false,
      stripeAccount: false,
      password: false,
      record: ""
    }
  }

  componentWillMount() {
    const { commonStore, location } = this.props;
    var path = location.pathname.split("/")[1];
    commonStore.currentPaht = path;
    var url_params = {
      has_developer: merchantStore.has_developer
    }
    merchantStore.LoadMerchants(url_params);
  }

  changeShowRecordNum = (value) => {
    merchantStore.max_result_count = value;

  }

  is_showDeveloper = (value) => {
    merchantStore.has_developer = value;
    var url_params = {
      has_developer: merchantStore.has_developer
    }
    merchantStore.LoadMerchants(url_params);
  }

  handlePageChange = (value) => {
    merchantStore.merchants_current_page = value;
    //merchantStore.LoadMerchants();  //分页获取数据
  }


  showModal = (record, type) => {
    this.setState({
      record: record,
      [type]: true
    })
  }
  closeModal = (type) => {
    this.setState({
      [type]: false
    })
  }



  search = (value) => {
    if (value) {
      var url_params = {
        has_developer: merchantStore.has_developer,
        email_address: value
      }
      merchantStore.LoadMerchants(url_params)
    }
  }

  onCellChange = (record, type) => {
    let postData = {};
    return (value) => {
      switch (type) {
        case "remark":
          postData = {
            remark: value
          }
          return record.editRemark(postData)
        case "ticketFee":
          postData = {
            ticket_sparxo_fee_expression: value
          }
          return record.setTicketFee(postData)
        case "donationFee":
          postData = {
            donation_sparxo_fee_expression: value
          }
          return record.setDonationFee(postData)
        case "production":
          if (record.is_production) {
            return record.setDevelopment()
          } else {
            return record.setProduction();
          }
          return record.setDonationFee(postData)
        case "developer":
          if (record.is_developer) {
            var temp = record.roles.filter(item => {
              if (item.role_id != 6) {
                return item.role_id
              }
            })
            var temp1 = temp.map(item => {
              return item.role_id
            })
            var postData = {
              role_ids: temp1
            }
            return record.setDeveloper(postData)
          } else {
            var temp = record.roles.map(item => {
              return item.role_id
            })
            temp.push(6)
          }
          var postData = {
            role_ids: temp
          }
          return record.setDeveloper(postData)
        default:
          return
      }
    }
  }

  render() {
    const { commonStore } = this.props;
    const columns = this.columns;
    let records = merchantStore.merchants.slice();
    if (!records) {
      return (<div></div>)
    }

    if (records.length != 0) {
      var pagination = {
        total: merchantStore.merchants_acount,
        pageSize: merchantStore.max_result_count,
        size: "large",
        onChange: this.handlePageChange.bind(this)
      }
    }


    return (
      <div className="main-container merchant-container">
        <h1>Merchant</h1>
        <div>
          <div className="table-operations">
            <label>
              show
              <Select defaultValue="10" style={{ width: 60, marginLeft: 5, marginRight: 5 }} onChange={this.changeShowRecordNum}>
                <Option value="10">10</Option>
                <Option value="25">25</Option>
                <Option value="50" >50</Option>
                <Option value="100">100</Option>
              </Select>
              records
            </label>
            <label htmlFor="" style={{ marginLeft: 40 }}>
              <Switch style={{ marginRight: 5 }} defaultChecked={merchantStore.has_developer} onChange={this.is_showDeveloper}></Switch>
              show Developer
            </label>
            <Search placeholder="email"
              style={{ width: 250, float: 'right' }}
              onSearch={this.search}></Search>
          </div>
          <Table dataSource={records}
            columns={columns}
            rowKey="id"
            size="middle"
            scroll={{ x: 1450 }}
            loading={commonStore.isfetching}
            pagination={pagination}
            bordered></Table>
        </div>

        <Modal title="Sparxo Rep"
          visible={this.state.sparxoRep}
          onCancel={() => { this.closeModal("sparxoRep") }}
          footer={null}
          width={600}
          key={`${this.state.record.id}+"rep"`}>
          <SparxoRep record={this.state.record} merchantStore={merchantStore}></SparxoRep>
        </Modal>

        <Modal title="Organize Setting"
          visible={this.state.collaborator}
          onCancel={() => { this.closeModal("collaborator") }}
          footer={null}
          width={680}
          key={`${this.state.record.id}+"collaborator"`}>
          <Collaborator record={this.state.record} merchantStore={merchantStore}></Collaborator>
        </Modal>

        <Modal title="Stripe Account"
          visible={this.state.stripeAccount}
          onCancel={() => { this.closeModal("stripeAccount") }}
          footer={null}
          width={680}
          key={`${this.state.record.id}+"stripeAccount"`}>
          <StripeAccount record={this.state.record} />
        </Modal>

        <Modal title="Number Of Events"
          visible={this.state.eventsCount}
          onCancel={() => { this.closeModal("eventsCount") }}
          footer={null}
          width={"80%"}
          key={`${this.state.record.id}+"eventsCount"`}>
          <EventsList record={this.state.record} />
        </Modal>

        <Modal title="Password"
          visible={this.state.password}
          onCancel={() => { this.closeModal("password") }}
          footer={null}
          width={"30%"}
          key={`${this.state.record.id}+"password"`}>
          <PasswordCell record={this.state.record} />
        </Modal>
      </div>
    )
  }
}


@observer
class MerchantCell extends React.Component {

  render() {
    var record = this.props.record;
    var text = record.merchant_rep_email_address;
    return <div>
      <span className="sparxo_rep"
        onClick={this.props.onClick}>{!text ? "null" : text}</span>
    </div>
  }
}

@observer
class ProductionCell extends React.Component {
  render() {
    const { record } = this.props
    return (
      <Spin spinning={record.isfetching_produciotn}>
        <Popconfirm title="Are you sure to change?"
          okText="Yes"
          cancelText="No"
          onConfirm={this.props.onChange}>
          <Checkbox checked={record.is_production} />
        </Popconfirm>
      </Spin>
    )
  }
}

@observer
class DeveloperCell extends React.Component {
  render() {
    const { record } = this.props;
    return (
      <Spin spinning={record.isfetching_developer}>
        <Popconfirm title="Are you sure to change?"
          okText="Yes"
          cancelText="No"
          onConfirm={this.props.onChange}>
          <Checkbox checked={record.is_developer} />
        </Popconfirm>
      </Spin>
    )
  }
}


@observer
class PasswordCell extends React.Component {
  state = {
    password: ""
  }
  handleChange = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  handleClick = () => {
    const { password } = this.state;
    const { record } = this.props;
    if (!password) {
      return message.warn("can't be null!")
    } else {
      var postData = {
        password: password
      }
      record.setPassword(postData)
    }
  }

  render() {
    const { record } = this.props
    return (
      <div>
        <Row>
          <Col span={20}>
            <Input onChange={this.handleChange}></Input>
          </Col>
          <Col span={4}>
            <Button style={{ marginLeft: 20 }}
              onClick={this.handleClick}
              loading={record.isloading}>Save</Button>
          </Col>
        </Row>
      </div>
    )
  }
}