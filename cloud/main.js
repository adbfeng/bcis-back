var axios = require('axios')

Parse.Cloud.define('hello', function(req, res) {
    res.success('Hello World')

});

Parse.Cloud.define('sendVerifySMS', function(req, res) {
    console.log(req.params)
    var phone = req.params.phone
    console.log(phone)
    console.log(process.env.BMOB_APP_ID)
    console.log(process.env.BMOB_API_KEY)

    axios({
        method: 'post',
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
        console.log(result)
        res.success(result)
    }).catch((err) =>  {
        res.error(err);
    });
});

Parse.Cloud.define('verifySMS', function(req, res) {
    let phone = req.params.phone
    let code = req.params.code
    axios({
        method: 'post',
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
