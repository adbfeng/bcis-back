var request = require('request')
var Promise = require('promise')

function get(obj) {
  return new Promise((resolve, reject) => {
    request({
      method:"GET",
      uri: obj.url,
      headers: obj.headers,
      qs: obj.data
    },function (err,response,body) {
      if (err) {
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}
function put(obj) {
  console.log(obj)
  return new Promise((resolve, reject) => {
    request({
      method:"PUT",
      uri: obj.url,
      headers: obj.headers,
      body: obj.data
    },function (err,response,body) {
      if (err) {
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}
function post(obj) {
  return new Promise((resolve, reject) => {
    request({
      method:"POST",
      uri: obj.url,
      json: true,   // <--Very important!!!
      headers: obj.headers,
      body: obj.data
    },function (err,response,body) {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(body))
      }
    })
  })
}

function postWithoutJson(obj) {
  return new Promise((resolve, reject) => {
    request({
      method:"POST",
      uri: obj.url,
      headers: obj.headers,
      body: obj.data
    },function (err,response,body) {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(body))
      }
    })
  })
}


module.exports = {
  get: get,
  post: post,
  put: put,
  postWithoutJson: postWithoutJson
}
