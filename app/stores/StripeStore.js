import {observable, computed, action} from 'mobx';
import http from "../api/http";
import { message } from 'antd';
import StripeModel from '../models/StripeModel'

const urls ={
  fee_setting: "/payments/stripe/fee_settings"
}

export default class StripeStore {
  stripeMethods = [];
  @observable is_fetching = false;
  @observable editModalStatus = false;

  @action loadStripeMethods = () =>{
    this.is_fetching = true;
    http.api(urls.fee_setting).get({},{})
      .then(res=>{
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        this.stripeMethods = res.result.map(item=>StripeModel.fromJS(this,item));
        this.is_fetching = false;
      })
      .catch(err => message.error(err.message, 4))
  }
}