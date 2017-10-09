import React from 'react';
import { render } from 'react-dom';
import {toJS} from 'mobx'
import {observer} from 'mobx-react'
import { Table, Input, Button } from 'antd';


@observer
export default class ESESDetails extends React.Component{
  constructor(props){
    super(props)
    this.columns = [
      {
        title: "Language Key",
        dataIndex: "key",
        width: '33%',
        key: "key"
      },
      {
        title: "Language Default",
        width: '33%'
      },
      {
        title: "Language Value",
        width: '33%',
        render: (text,record,index) =>{
          const { es_Details } = this.props.languageStore
          return (
            <ValueCell record={record} store={es_Details}  />
          )
        }
      }
    ]
  }

  save = () => {
    const { file,languageStore } =this.props;
    var temp = toJS(languageStore.es_Details);
    var postData = {};
    for (var s in temp) {
      postData[temp[s].key] = temp[s].value;
    }
    console.log(file,postData)
    languageStore.setValue(file,postData)
  }


  render() {
    const { es_Details } = this.props.languageStore;
    const columns = this.columns
    let datasource = toJS(es_Details);
    
    if(!datasource){
      return <div></div>
    }
    return (
      <div className="details">
        <Table columns={columns}
          className="details-table"
          dataSource={datasource}
          loading={this.props.languageStore.fetch_loading}
          pagination={false}></Table>
        <Button onClick={this.save}
          type='primary'
          size='large'
          style={{marginTop:20}}
          loading={this.props.languageStore.save_loading}
        >Save</Button>
      </div>
    )
  }
}

@observer
class ValueCell extends React.Component {
  
  handleChange = (e) => {
    const { record, store } = this.props
    store.forEach(item=>{
      if(item.key == record.key){
        item.value = e.target.value
      }
    })
  }

  render() {
    const { record } = this.props
    return (
      <Input onChange={this.handleChange}
        type="textarea"
        placeholder={record.value}
        autosize />
    )
  }
}