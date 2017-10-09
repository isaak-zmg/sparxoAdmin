import { observable, computed, action } from 'mobx';
import fetch from 'isomorphic-fetch';
import { message } from 'antd';
import http from "../api/http";


const urls = {
  merchants: "/merchants",
  remark: "/merchants/{0}/remark",
  sparxoFee: "/merchants/{0}/organization_info/ticket_sparxo_fee_expression",
  donationFee: "/merchants/{0}/organization_info/donation_sparxo_fee_expression",
  password: "/merchants/{0}/password",
  production: "/merchants/{0}/paymentmethod/stripe_token_direct/setting/production",
  development: "/merchants/{0}/paymentmethod/stripe_token_direct/setting/development",
  editRole: "/account/{0}/roles_and_password",
  eventsOfMerchant: "/statistics/merchants/{0}/events/transaction",
  sparo_rep: "/account",
  assigned: "/merchantreps/{0}/assigned/{1}", // 0:repID // 1:rerordID
  unassigned: "/merchantreps/{0}/unassigned/{1}",
  collaborators: "/merchants/{0}/collaborators"
  
}

export default class MerchantModel {
  @observable merchant_rep_email_address = null;
  @observable remark = null;
  @observable isfetching_remark = false;
  @observable isfetching_ticket = false;
  @observable isfetching_donation = false;
  @observable isfetching_produciotn = false;
  @observable isfetching_developer = false;
  @observable isloading = false;
  @observable collaborators = [];
  @observable eventsList = [];
  @observable is_production = null;
  @observable roles = null;

  constructor(store,item) {
    this.reset(item);
  }

  reset(item){
    for (var prop in item) {
      this[prop] = item[prop];
    }
  }

  @action editRemark = (postData) => {
    this.isfetching_remark = true;
    http.api(urls.remark, this.id).put({}, {}, postData)
      .then(res => {
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        http.api(urls.merchants).get({ email_address: this.email }, {})
        .then(res => {
          res.result.items.forEach(item => {
            if (item.email === this.email) {
              this.reset(item);
            }
          });
          this.isfetching_remark = false;          
        })
      })
      .catch(err => message.error(err.message, 4))
  }

  @action unassigned = (repID) => {
    this.isloading = true
    http.api(urls.unassigned, repID, this.id).put({}, {})
      .then(res => {
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        this.merchant_rep_email_address = null
        this.isloading = false
      })
      .catch(err => message.error(err.message, 4))
  }

  @action assigned = (rep) => {
    this.isloading = true;
    http.api(urls.assigned, rep.id, this.id).put({}, {}, {})  //query, headers, data
      .then(res => {
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        http.api(urls.merchants).get({ email_address: this.email }, {})
          .then(res => {
            res.result.items.forEach(item => {
              if (item.email === this.email) {
                this.reset(item);
              }
            });
            this.isloading = false
          })
      })
      .catch(err => message.error(err.message, 4))
  }

  @action getCollaborator = () =>{
    http.api(urls.collaborators, this.id).get({},{})
      .then(res=>{
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        this.collaborators = res.result;
        this.isloading = false;
      })
      .catch(err => message.error(err.message, 4))
  }

  @action setCollaborator = (postData) =>{
    this.isloading = true;
    http.api(urls.collaborators, this.id).post({},{},postData)
      .then(res=>{
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        this.getCollaborator()
      })
      .catch(err => message.error(err.message, 4))
  }

  @action delectCollaborator = (query) =>{
    http.api(urls.collaborators, this.id).delete(query,{},{})
      .then(res=>{
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        this.getCollaborator()
      })
      .catch(err => message.error(err.message, 4))
  }

  @action setTicketFee = (postData) =>{
    this.isfetching_ticket = true
    http.api(urls.sparxoFee, this.id).put({},{},postData)
      .then(res=>{
        if (res.success == false) {
          throw new Error(res.error.message)
        }
        http.api(urls.merchants).get({ email_address: this.email }, {})
        .then(res => {
          res.result.items.forEach(item => {
            if (item.email === this.email) {
              this.reset(item);
            }
          });
          this.isfetching_ticket = false
        })
      })
      .catch(err => message.error(err.message, 4))
  }

  @action setDonationFee = (postData) =>{
    this.isfetching_donation = true
    http.api(urls.donationFee, this.id).put({},{},postData)
      .then(res=>{
        if(res.success == false){
          throw new Error(res.error.message)
        }
        http.api(urls.merchants).get({email_address: this.email},{})
          .then(res=>{
            res.result.items.forEach(item=>{
              if(item.email === this.email){
                this.reset(item);
              }
            })
            this.isfetching_donation = false;
          })
      })
      .catch(err => message.error(err.message, 4))
  }

  @action getEventsList = () =>{
    this.isloading = true
    http.api(urls.eventsOfMerchant, this.id).get({},{})
      .then(res=>{
        if(res.success == false){
          throw new Error(res.error.message)
        }
        this.eventsList = res.result.items
        this.isloading = false;
      })
      .catch(err => message.error(err.message, 4))
  }

  @action setDevelopment = () =>{
    this.isfetching_produciotn = true;
    http.api(urls.development, this.id).put({},{},{})
      .then(res=>{
        if(res.success == false){
          throw new Error(res.error.message)
        }
        http.api(urls.merchants).get({email_address: this.email},{})
        .then(res=>{
          res.result.items.forEach(item=>{
            if(item.email === this.email){
              this.reset(item);
            }
          })
          this.isfetching_produciotn = false;
        })
      })
      .catch(err => message.error(err.message, 4))
  }

  @action setProduction = () =>{
    this.isfetching_produciotn = true;
    http.api(urls.production, this.id).put({},{},{})
      .then(res=>{
        if(res.success == false){
          throw new Error(res.error.message)
        }
        http.api(urls.merchants).get({email_address: this.email},{})
        .then(res=>{
          res.result.items.forEach(item=>{
            if(item.email === this.email){
              this.reset(item);
            }
          })
          this.isfetching_produciotn = false;
        })
      })
      .catch(err => message.error(err.message, 4))
  }

  @action setPassword = (postData) =>{
    this.isloading = true;
    http.api(urls.password, this.id).put({},{},postData)
      .then(res=>{
        if(res.success == false){
          throw new Error(res.error.message)
        }
        this.isloading = false;
        message.success("change success!")
      })
      .catch(err => message.error(err.message, 4))
  }

  @computed get is_developer(){
    for(var i =0; i<this.roles.length; i++){
      if(this.roles[i].role_id == 6){
        return true
      }
    }
    return false;
  }

  @action setDeveloper = (postData) =>{
    this.isfetching_developer = true;
    http.api(urls.editRole, this.id).put({},{},postData)
      .then(res=>{
        if(res.success == false){
          throw new Error(res.error.message)
        }
        http.api(urls.merchants).get({email_address: this.email},{})
        .then(res=>{
          res.result.items.forEach(item=>{
            if(item.email === this.email){
              this.reset(item);
            }
          })
          this.isfetching_developer = false;
        })
        
      })
      .catch(err => message.error(err.message, 4))
  }

  static fromJS(store, object){
    return new MerchantModel(store,object)
  }
}