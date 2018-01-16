const { get, post, put, postWithoutJson } =  require('../util/http')

function sendSMS(phone, content) {
  return get({
    url: 'https://way.jd.com/chuangxin/dxjk',
    data: {
      mobile: phone,
      content: content,
      appkey: process.env.SMS_KEY
    }
  })
}

module.exports = {
  sendSMS: sendSMS
}