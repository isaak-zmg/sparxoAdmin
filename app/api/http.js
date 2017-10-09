import { apiConf } from '../consts';
import format from 'string-format';
import fetch from 'isomorphic-fetch';
import commonStore from '../stores/CommonStore';

class http {
  url;
  _headers = { "authorization": `Bearer ${commonStore.accessToken}` };
  _headers_type_JSON = { "authorization": `Bearer ${commonStore.accessToken}`, "content-type": "application/json" }
  constructor(url) {
    this.url = url;
  }


  get(query, headers) {
    var url = addUrlParam(this.url, query)
    return fetch(url, {
      headers: Object.assign({}, this._headers, headers)
    })
      .then(res => {
        return res.json()
      })
  }

  put(query, headers, data) {
    var url = addUrlParam(this.url, query)
    return fetch(url, {
      method: 'PUT',
      headers: Object.assign({}, this._headers_type_JSON, headers),
      body: JSON.stringify(data)
    })
      .then(res => {
        return res.json()
      })
  }
  post(query, headers, data) {
    var url = addUrlParam(this.url, query)
    return fetch(url, {
      method: "POST",
      headers: Object.assign({}, this._headers_type_JSON, headers),
      body: JSON.stringify(data)
    })
      .then(res => {
        return res.json()
      })
  }

  delete(query,headers,postData) {
    var url = addUrlParam(this.url, query)
    return fetch(url,{
      method: "DELETE",
      headers: Object.assign({},this._headers,headers),
      body: JSON.stringify(postData)
    })
      .then(res=>{
        return res.json()
      })
  }

  static api(url, ...params) {
    var baseUrl = apiConf.root;
    if (/^\//.test(url)) {
      url = url.replace(/^\//, '');
    }
    if (/\/$/.test(baseUrl)) {
      baseUrl = baseUrl.replace(/\/$/, '');
    }
    if (arguments.length == 2) {
      url = format(url, params)
    } else if (arguments.length == 3) {
      url = format(url, params[0], params[1])
    }

    return new http(baseUrl + "/" + url);
  }
}

export default http;

const addUrlParam = (url, obj) => {
  if (obj) {
    for (var i in obj) {
      url += (url.indexOf("?") == -1 ? "?" : "&");
      url += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
    }
  }

  return url;
}