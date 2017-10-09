import React from 'react';
import { render } from 'react-dom';
import {toJS} from "mobx"
import {observer} from 'mobx-react'
import { Table } from "antd";
import moment from 'moment'
import {dayFormat,currencyFormat} from '../../utils'


@observer
export default class EventsList extends React.Component {
  constructor(props) {
    super(props)
    this.columns = [
      {
        title: "Event Begin Date",
        dataIndex: "begin_time_utc",
        key: "begin_time_utc",
        sorter: (a, b) => moment(a.begin_time_utc).unix() - moment(b.begin_time_utc).unix(),
        render: (text, record, index)=>{
          return <span>{dayFormat(text)}</span> 
        }
      },
      {
        title: "Event End Date",
        dataIndex: "end_time_utc",
        key: "end_time_utc",
        sorter: (a, b) => moment(a.end_time_utc).unix() - moment(b.end_time_utc).unix(),
        render: (text, record, index)=>{
          return <span>{dayFormat(text)}</span> 
        }
      },
      {
        title: "Event Name",
        dataIndex: "event_name",
        key: "event_name"
      },
      {
        title: "Total Transactions",
        dataIndex: "transactions_count",
        key: "transactions_count",
        sorter: (a, b) => a.transactions_count - b.transactions_count,
      },
      {
        title: "Total Tickets Sold",
        dataIndex: "sold_quantity",
        key: "sold_quantity",
        sorter: (a, b) => a.sold_quantity - b.sold_quantity,
        render: (text, record, index)=>{
          return <span>{text}</span> 
        }
      },
      {
        title: "Ticket Sparxo Fee Collected",
        dataIndex: "sparxo_fee",
        key: "sparxo_fee",
        sorter: (a, b) => a.sparxo_fee - b.sparxo_fee,
        render: (text, record, index)=>{
          return <span>{currencyFormat(text)}</span> 
        }
      },
      {
        title: "Total Processed",
        dataIndex: "amount",
        key: "amount",
        sorter: (a, b) => (a.amount) * 1 - (b.amount) * 1,
        render: (text, record, index)=>{
          return <span>{currencyFormat(text)}</span> 
        }
      }
    ]
  }

  componentWillMount() {
    const { record } = this.props;
    record.getEventsList();
  }

  render() {
    const { record } = this.props;
    let columns = this.columns;
    //if(record.eventsList)
    return (
      <div>
        <Table columns={columns}
          dataSource={toJS(record.eventsList)}
          loading={record.isloading}
          rowKey="event_id"
          size="middle"
          scroll={{ x: 1200 }}></Table>
      </div>
    )
  }
}