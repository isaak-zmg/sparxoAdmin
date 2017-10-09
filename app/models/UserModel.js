import { observable, computed, action } from 'mobx';
import fetch from 'isomorphic-fetch';
import { message } from 'antd';
import http from "../api/http";


const urls = {
  account: "/account",
  accountById: "/account/{0}",
  edit: "/account/{0}/roles_and_password"
}

export default class UserModel {
  @observable roles = null;
  @observable edit_loading = false;


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
    this.edit_loading = true;
    http.api(urls.edit, this.id).put({}, {}, postData)
      .then(res => {
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        http.api(urls.account).get({ email_address: this.email }, {})
          .then(res => {
            res.result.items.forEach(item => {
              if (item.email === this.email) {
                this.reset(item);
              }
            });
            this.edit_loading = false;
            this.store.editModalStatus = false;
          })
      })
      .catch(err => message.error(err.message, 4))
  }

  static fromJS(stroe, object) {
    return new UserModel(stroe, object)
  }
}