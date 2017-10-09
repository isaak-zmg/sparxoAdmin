import {observable, computed, action} from 'mobx';
import http from "../api/http";
import { message } from 'antd';
import UserModel from '../models/UserModel';


const urls ={
  account: "/account",
  add: "/account/{0}/roles_and_password"
}

class UserStore {
  @observable users = [];
  @observable is_loading =false;
  @observable addModalStatus = false;
  @observable editModalStatus = false;

  @action loadUsers = (params) =>{
    this.is_loading = true;
    http.api(urls.account).get(params,{})
      .then(res=>{
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        this.users = res.result.items.map(item=>UserModel.fromJS(this, item));
        this.is_loading = false
      })
      .catch(err => message.error(err.message, 4))
  }

  @observable is_next = true;
  @observable canEdit = false;
  @observable is_exist = false;
  @observable defaultAddValue = "";
  @observable currentUser = null;
  @observable add_loading = false;

  @action getAddUserInfo = (params) =>{
    http.api(urls.account).get(params,{})
      .then(res=>{
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        this.currentUser = res.result.items[0]
        this.is_next = false;
        this.canEdit = true;
      })
      .catch(err => message.error(err.message, 4))
  }

  @action saveAdd_edit = (postData) =>{
    this.add_loading = true;
    http.api(urls.add, this.currentUser.id).put({},{},postData)
      .then(res=>{
        if(res.success == false){
          throw new Error(res.error.message)
        }
        http.api(urls.account).get({email_address: this.currentUser.email}, {})
          .then(res=>{
              this.users.forEach(item=>{
                if(item.email === this.currentUser.email){
                  item.reset(res.result.items[0])
                }
              })
              this.add_loading = false;
              this.addModalStatus = false;
              this.is_next = true;
              this.canEdit = false;
          })
      })
      .catch(err => message.error(err.message, 4))
  }

  @action saveAdd = (postData)=>{
    this.add_loading = true;
    http.api(urls.account).post({},{},postData)
      .then(res=>{
        if(res.success == false){
          throw new Error(res.error.message)
        }
        http.api(urls.account).get({role_ids: [2, 5]},{})
          .then(res=>{
            this.users = res.result.items.map(item=>UserModel.fromJS(this, item));
            this.add_loading = false;
            this.addModalStatus = false;
            this.is_next = true;
            this.canEdit = false;
          })
      })
      .catch(err => message.error(err.message, 4))
  }

}

export default UserStore