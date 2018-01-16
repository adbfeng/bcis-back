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

function getTeacher() {
  return get({
    url: 'https://api.bmob.cn/1/classes/_User',
    data: {
      limit: 1000,
      where: '{"role":1}'
    },
    headers: header
  })
}

module.exports = {
  login: login,
  getTeacher: getTeacher
}