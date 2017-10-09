import {observable, computed, action} from 'mobx';
import http from "../api/http";
import { message } from 'antd';
import {parseJson} from '../utils'

const urls = {
  langFiles: "/admin/ui/langfiles",
  langFilesDetail: "/admin/ui/langfiles/{0}"
}

class LanguageStore {
  @observable languageFiles = [];
  @observable en_Details = [];
  @observable es_Details = [];
  @observable fr_Details = [];
  @observable save_loading = false;
  @observable fetch_loading = false;


  @action loadLanguageFiles = () =>{
    http.api(urls.langFiles).get({},{})
      .then(res=>{
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        this.languageFiles = res.result;
      })
      .catch(err => message.error(err.message, 4))
  }

  @computed get en_US_Files(){
    return this.languageFiles.filter(item=>{
      return item.name.indexOf("en-US") != -1
    })
  }
  @computed get es_ES_Files(){
    return this.languageFiles.filter(item=>{
      return item.name.indexOf("es-ES") != -1
    })
  }
  @computed get fr_CA_Files(){
    return this.languageFiles.filter(item=>{
      return item.name.indexOf("fr-CA") != -1
    })
  }

  @action load_EN_Details = (file) =>{
    this.fetch_loading = true;
    http.api(urls.langFilesDetail, file).get({},{})
      .then(res=>{
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        this.en_Details = parseJson(res.result)
        this.fetch_loading = false;
      })
      .catch(err => message.error(err.message, 4))
  }
  @action load_ES_Details = (file) =>{
    this.fetch_loading = true;
    http.api(urls.langFilesDetail, file).get({},{})
      .then(res=>{
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        this.es_Details = parseJson(res.result)
        this.fetch_loading = false;
      })
      .catch(err => message.error(err.message, 4))
  }
  @action load_FR_Details = (file) =>{
    this.fetch_loading = true;
    http.api(urls.langFilesDetail, file).get({},{})
      .then(res=>{
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        this.fr_Details = parseJson(res.result)
        this.fetch_loading = false;
      })
      .catch(err => message.error(err.message, 4))
  }

  @action setValue = (file,postData) =>{
    this.save_loading = true;
    http.api(urls.langFilesDetail,file).put({},{},postData)
      .then(res=>{
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        this.save_loading=false;
      })
      .catch(err => message.error(err.message, 4))
  }
}

export default LanguageStore;


