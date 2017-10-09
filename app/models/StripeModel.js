import { observable, computed, action } from 'mobx';
import fetch from 'isomorphic-fetch';
import { message } from 'antd';
import http from "../api/http";


const urls = {
  edit: "/payments/stripe/fee_settings/{0}",
  fee_setting: "/payments/stripe/fee_settings"
}

export default class StripeModel {
  @observable edit_loading = false;
  @observable transaction_percent = "";
  @observable transacton_fix_fee = ""

  constructor(store, item) {
    this.reset(item);
    this.store = store;
  }
  reset(item) {
    for (var prop in item) {
      this[prop] = item[prop];
    }
  }

  @action saveEdit = (postData) => {
    this.edit_loading = true
    http.api(urls.edit, this.currency).post({}, {}, postData)
      .then(res => {
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        http.api(urls.fee_setting).get({}, {})
          .then(res => {
            res.result.forEach(item => {
              if (item.currency == this.currency) {
                this.reset(item)
              }
            })
            this.edit_loading = false
          })
      })
      .catch(err => message.error(err.message, 4))
  }

  static fromJS(store, object) {
    return new StripeModel(store, object)
  }
}