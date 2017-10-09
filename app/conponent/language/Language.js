import React from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';
import { Tabs, Select } from 'antd'
import LanguageStore from '../../stores/LanguageStore';
import ENUSDetails from "./ENUSDetails";
import ESESDetails from "./ESESDetails";
import FRCADetails from './FRCADetails'

import "./style.less"

const TabPane = Tabs.TabPane;
const Option = Select.Option;

const languageStore = new LanguageStore()

@observer
export default class Language extends React.Component {
  constructor(props){
    super(props)
    this.state={
      show_EN_Details: false,
      show_ES_Details: false,
      show_FR_Details: false,
      current_Details: ''
    }
  }

  componentWillMount() {
    const { commonStore, location } = this.props;
    var path = location.pathname.split("/")[1];
    commonStore.currentPaht = path;
    languageStore.loadLanguageFiles()
  }

  getOptions = (items) => {
    return items.map(item => {
      return <Option key={item.name}>{item.name}</Option>
    })
  }

  select_en_File = (value) =>{
    this.setState({
      show_EN_Details: true,
      current_Details: value
    })
    languageStore.load_EN_Details(value);
  }
  select_es_File = (value) =>{
    this.setState({
      show_ES_Details: true,
      current_Details: value
    })
    languageStore.load_ES_Details(value);
  }
  select_fr_File = (value) =>{
    this.setState({
      show_FR_Details: true,
      current_Details: value
    })
    languageStore.load_FR_Details(value)
  }

  render() {
    const { commonStore } = this.props;
    const { en_US_Files, es_ES_Files, fr_CA_Files } = languageStore
    const {show_EN_Details,show_ES_Details,show_FR_Details,current_Details} = this.state;
    
    return (
      <div className="main-container language-container">
        <h1>Language</h1>
        <Tabs className="languageTabs">
          <TabPane tab="en-US" key="en-US">
            <Select style={{ width: 220, marginBottom: 20 }}
              size="large"
              onChange={this.select_en_File}>
              {this.getOptions(en_US_Files)}
            </Select>
            {
              show_EN_Details ? <ENUSDetails file={current_Details} languageStore={languageStore} /> : <div></div>
            }
          </TabPane>
          <TabPane tab="es-ES" key="es-ES">
            <Select style={{ width: 220, marginBottom: 20 }}
              size="large"
              onChange={this.select_es_File}>
              {this.getOptions(es_ES_Files)}
            </Select>
            {
              show_ES_Details ? <ESESDetails file={current_Details} languageStore={languageStore} /> : <div></div>
            }
          </TabPane>
          <TabPane tab="fr-CA" key="fr-CA">
            <Select style={{ width: 220, marginBottom: 20 }}
              size="large"
              onChange={this.select_fr_File}>
              {this.getOptions(fr_CA_Files)}
            </Select>
            {
              show_FR_Details ? <FRCADetails file={current_Details} languageStore={languageStore} /> : <div></div>
            }
          </TabPane>
        </Tabs>
      </div>
    )
  }
}