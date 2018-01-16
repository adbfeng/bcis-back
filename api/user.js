const { get, post } =  require('../util/http')
const { header } = require('../util/config')
function login(username, password) {
  return get({
    url: 'https://api.bmob.cn/1/login',
    data: {
      username: username,
      password: password
    },
    headers: header
  })
}

module.exports = {
  login: login
}