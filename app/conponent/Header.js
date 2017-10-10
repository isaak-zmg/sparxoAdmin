import React from 'react';
import { render } from 'react-dom';
import { Row, Col } from 'antd';

export default class Header extends React.Component {


  render() {
    const { commonStore } = this.props
    if(!commonStore.currentUser){
      return null
    }

    return (
      <div className="header">
        <Row>
          <Col xs={24} sm={24} md={12} lg={12}>
            <a className="logo">
              <img src={require("../images/new_logo.png")} alt="logo" />
              <span>Sparxo Admin</span>
            </a>
          </Col>
          <Col xs={0} sm={0} md={12} lg={12}>
            <div className="login_info">
              <span>{commonStore.currentUser.first_name}</span>
              <span style={{ marginLeft: "10px" }}>welcome!</span>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}