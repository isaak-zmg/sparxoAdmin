import React from 'react';
import { render } from 'react-dom';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import {observer} from 'mobx-react';

const SubMenu = Menu.SubMenu;


@observer
export default class Sidebar extends React.Component {
  constructor(props) {
    super(props)

  }

  state = {
    selectKey: this.props.commonStore.currentPath,
    defaultOpenKeys: []
  }


  render() {
    if (this.state.selectKey == "language" || this.state.selectKey == "stripe") {
      this.state.defaultOpenKeys = ['sub2']
    } else {
      this.state.defaultOpenKeys = ['sub1']
    }
    const {commonStore} = this.props;
    debugger
    return (
      <div className="sidebar">
        <Menu mode="inline"
          defaultSelectedKeys={[this.state.selectKey]}
          defaultOpenKeys={this.state.defaultOpenKeys}>
          <SubMenu key="sub1" title={<span><Icon type="appstore" />Manage</span>}>
            <Menu.Item key="merchant"><Link to="/merchant"><Icon type="user" />Merchant</Link></Menu.Item>
            <Menu.Item key="user"><Link to="/user"><Icon type="user-add" />User</Link></Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title={<span><Icon type="setting" />Setting</span>}>
            <Menu.Item key="language"><Link to="/language"><Icon type="copy" />Language</Link></Menu.Item>
            <Menu.Item key="stripe"><Link to="/stripe"><Icon type="bank" />Stripe</Link></Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    )
  }
}