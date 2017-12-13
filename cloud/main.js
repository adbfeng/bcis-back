import axios from 'axios'

Parse.Cloud.define('sendVerifySMS', function(req, res) {
    let phone = req.params.phone
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
      res.success(result)
    }).catch((err) =>  {
        response.error(err);
    });
});

Parse.Cloud.define('sendVerifySMS', function(req, res) {
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
        response.error(err);
    });
});
