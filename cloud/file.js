var qiniu = require('qiniu')
const { get, postWithoutJson } =  require('./util')

function getQiniuToken() {
    var accessKey = process.env.QINIU_KEY
    var secretKey = process.env.QINIU_SECRET
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

    var options = {
        scope: process.env.QINIU_BUCKET
    }

    var putPolicy = new qiniu.rs.PutPolicy(options)
    return 'UpToken ' + putPolicy.uploadToken(mac)
}

function base64ConvertUrl(base64str) {
    return postWithoutJson({
        url: 'http://upload.qiniu.com/putb64/-1',
        headers: {
            'Authorization': getQiniuToken(),
            'Content-Type': 'application/octet-stream'
        },
        data: base64str
    })
}

module.exports = {
    base64ConvertUrl: base64ConvertUrl
}