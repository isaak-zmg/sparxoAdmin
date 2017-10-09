import { observable, computed, action } from 'mobx';
import { apiConf, currentUserKey } from '../consts';
import { toPostData, toGetData, getLocal } from '../utils';
import { message } from 'antd';
import commonStore from './CommonStore';
import moment from "moment";
import http from "../api/http";
import MerchantModel from '../models/MerchantModel';


const urls = {
  merchants: "/merchants",
  account: "/account"
}



class MerchantStore {
  merchants = [];
  @observable merchants_acount = 0
  @observable max_result_count = 10;
  @observable has_developer = true;
  @observable merchants_current_page = 1;
  @computed get skip_count() {
    return (this.merchants_current_page - 1) * this.max_result_count;
  }


  @action LoadMerchants(params) {
    commonStore.isfetching = true;
    http.api(urls.merchants).get(params, {}) // url_params, headers
      .then(res => {
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        this.merchants = res.result.items.map(item => MerchantModel.fromJS(this, item));
        this.merchants_acount = res.result.total_count;
        commonStore.isfetching = false;
      })
      .catch(err => message.error(err.message, 4))
  }


  @observable repGroup = [];
  @computed get repGroup_email() {
    return this.repGroup.map(item => {
      return item.email
    })
  }
  @action getRepGroup = (params) => {
    http.api(urls.account).get(params, {})
      .then(res => {
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        this.repGroup = res.result.items;
      })
      .catch(err => message.error(err.message, 4))
  }


  @observable collaboratorGroup = [];  // role_id:3 merchant
  @computed get collaboratorGroup_email(){
    return this.collaboratorGroup.map(item=>item.email)
  }
  @action getCollaboratorGroup = (params)=>{
    http.api(urls.account).get(params,{})
      .then(res=>{
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        this.collaboratorGroup = res.result.items;
      })
      .catch(err => message.error(err.message, 4))
  }
}

export default MerchantStore;
