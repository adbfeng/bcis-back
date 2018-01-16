const { get, post } =  require('../util/http')
const { header } = require('../util/config')
function getCurrent() {
  return get({
    url: 'https://api.bmob.cn/1/classes/ASA_Control',
    data: {
      limit: 1000,
      order: '-updatedAt'
    },
    headers: header
  })
}

module.exports = {
  getCurrent: getCurrent
}