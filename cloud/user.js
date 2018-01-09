const { get, post } =  require('./util')

function sendVerifySMS(phone) {
    return post({
        url: 'https://api.bmob.cn/1/requestSmsCode',
        data: {
            mobilePhoneNumber: phone,
            template: 'szamigo'
        },
        headers: {
            'X-Bmob-Application-Id': process.env.BMOB_APP_ID,
            'X-Bmob-REST-API-Key': process.env.BMOB_API_KEY,
            'Content-Type': 'application/json'
        }
    })
}

function verifySMS(phone, code) {
    return post({
        url: 'https://api.bmob.cn/1/verifySmsCode/' + code,
        data: {
            mobilePhoneNumber: phone
        },
        headers: {
            'X-Bmob-Application-Id': process.env.BMOB_APP_ID,
            'X-Bmob-REST-API-Key': process.env.BMOB_API_KEY,
            'Content-Type': 'application/json'
        }
    })
}

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
    sendVerifySMS: sendVerifySMS,
    sendSMS: sendSMS,
    verifySMS: verifySMS
}