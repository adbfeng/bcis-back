const { get, post } =  require('./util')

Parse.Cloud.define('sendVerifySMS', function(req, res) {
    var phone = req.params.phone
    post({
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
    }).then((result) => {
        res.success(result)
    }).catch((err) =>  {
        res.error(err);
    });
});

Parse.Cloud.define('verifySMS', function(req, res) {
    let phone = req.params.phone
    let code = req.params.code
    post({
        url: 'https://api.bmob.cn/1/verifySmsCode/' + code,
        data: {
            mobilePhoneNumber: phone
        },
        headers: {
            'X-Bmob-Application-Id': process.env.BMOB_APP_ID,
            'X-Bmob-REST-API-Key': process.env.BMOB_API_KEY,
            'Content-Type': 'application/json'
        }
    }).then((result) => {
        res.success(result)
    }).catch((err) =>  {
        res.error(err);
    });
});
