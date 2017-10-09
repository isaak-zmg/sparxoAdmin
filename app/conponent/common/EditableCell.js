import React from 'react';
import { render } from 'react-dom';
import { Input, Icon, Spin } from 'antd'
import { observer } from 'mobx-react';
import './style.less'

@observer
export default class EditableCell extends React.Component {
  state = {
    post_Value: this.props.record[this.props.type],
    editable: false
  }

  edit = () => {
    this.setState({ editable: true })
  }

  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ post_Value: value })
  }

  check = () => {
    this.setState({ editable: false })
    if (this.props.onChange) {
      this.props.onChange(this.state.post_Value);
    }
  }



  render() {
    const { editable } = this.state
    const { record, type } = this.props

    const getFetchingStatus = () => {
      switch (type) {
        case "remark":
          return record.isfetching_remark;
        case "ticket_sparxo_fee_expression":
          return record.isfetching_ticket;
        case "donation_sparxo_fee_expression":
          return record.isfetching_donation
        default:
          return null
      }
    }

    return (
      <div className='editable-cell'>
        <Spin spinning={getFetchingStatus()}>
          {
            editable ?
              <div className="editable-cell-input-wrapper">
                <Input defaultValue={record[type]}
                  onChange={this.handleChange}
                  onPressEnter={this.check}></Input>
                <Icon type="check"
                  className="editable-cell-icon-check"
                  onClick={this.check}></Icon>
              </div>
              :
              <div className="editable-cell-text-wrapper">

                {record[type] == "" || !record[type] ? "null" : record[type]}
                <Icon type="edit"
                  className="editable-cell-icon"
                  onClick={this.edit}></Icon>
              </div>
          }
        </Spin>
      </div>
    )
  }
}