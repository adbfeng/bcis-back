const { get, post, put } =  require('../util/http')
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
function update(id, obj) {
  return put({
    url: 'https://api.bmob.cn/1/classes/ASA_Control/' + id,
    data: JSON.stringify(obj),
    headers: header
  })
}

module.exports = {
  getCurrent: getCurrent,
  update: update
}