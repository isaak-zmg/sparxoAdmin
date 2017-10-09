import commonStore from './stores/CommonStore';
import moment from 'moment';


export const setLocal = (Key, data) => {
  localStorage[Key] = JSON.stringify(data);
}

export const getLocal = key => {
  const value = localStorage[key];
  if (value) {
    return JSON.parse(value)
  }
  return null;
}

export const toPostData = (header, postData) => {
  return {
    method: "POST",
    headers: header,
    body: Object.entries(postData).map(item => `${item[0]}=${item[1]}`).join('&')
  }
}

export const toGetData = (header, ...args) => {
  return {
    method: "GET",
    headers: header
  }
}

export const is_exist = (context, group) => {
  for(var i=0; i<group.length; i++){
    if(context === group[i]){
      return true
    }
  }
  return false
}

export const currencyFormat = (value) =>{
  return "$" + (value / 100).toFixed(2);
}

export const timeFormat = (value) =>{
  return moment(value).format("MM/DD/YY HH:mm")
}

export const dayFormat = (value) =>{
  return moment(value).format("MM/DD/YYYY")
}

export const arrayRemoveByValue = (array,val) => {
  for(var i=0; i<array.length; i++) {
    if(array[i] == val) {
      array.splice(i, 1);
    }
  }
  return array
}
export const emailValidate = (value) =>{
  var pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
  return pattern.test(value);
}

export const parseJson = (items) =>{
  var arr = [];
  var re = eval("(" + items + ")");
  for(var name in re){
    arr.push({
      key: name,
      value: re[name]
    })
  }
  return arr
}
