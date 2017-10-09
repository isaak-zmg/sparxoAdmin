import React from "react";
import { render } from "react-dom";
import { Table } from "antd"

export default class StripeAccount extends React.Component {
  columns = [
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency"
    },
    {
      title: "Stripe Account",
      dataIndex: "connect_account",
      key: "connect_account",
      render: (text, record, index) => {
        return <span>{!text ? "null" : text}</span>
      }
    }
  ]

  render() {
    const { record } = this.props;
    const columns = this.columns
    return <div>
      <Table dataSource={record.stripe_payment_method_settings}
        columns={columns}
        rowKey="currency"
        size="middle"
        bordered></Table>
    </div>
  }
}