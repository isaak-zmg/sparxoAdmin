import { observable, computed, action } from "mobx";
import fetch from 'isomorphic-fetch';
import { apiConf, currentUserKey } from '../consts';
import { toPostData, toGetData, setLocal } from '../utils';
import { message } from 'antd';

class CommonStore {
  @observable currentUser = null;
  @observable accessToken = '';
  @observable isfetching = false;
  @observable isloading =false;

  @action login(values) {
    var temp_values = Object.assign({}, values, {
      grant_type: 'password'
    })
    fetch(`${apiConf.login_path}`, toPostData(
      {
        "content-type": "application/x-www-form-urlencoded",
        "authorization": "Basic MTo4ODA4YWM4MS1kZDFkLTQ2MmQtODIwMi00NWZjZmY4N2U2YTA="
      },
      temp_values))
      .then(res => res.json())
      .then(res => {
        if (res.success == false) {
          throw new Error(res.error.message);
        }
        if (res.error) {
          throw new Error(res.error);
        }
        this.accessToken = res.access_token;
      })
      .then(() => {
        fetch(`${apiConf.root}${apiConf.current_user}`, toGetData({
          "authorization": `Bearer ${this.accessToken}`
        }))
          .then(res => res.json())
          .then(res => {
            if (res.success == false) {
              throw new Error(res.error.message)
            }
            this.currentUser = res.result;
            const User = {
              currentUser:this.currentUser,
              accessToken:this.accessToken
            }
            setLocal(currentUserKey, User)
          })
      })
      .catch(err => message.error(err.message, 4)) //提示延迟4秒结束
  };


  @observable currentPah = ""

  @action test() {
    fetch(`${apiConf.root}${apiConf.current_user}`, toGetData({
      "authorization": `Bearer ${this.accessToken}`
    }))
      .then(res => res.json())
      .then(res => {
      })
  }
}

export default new CommonStore;