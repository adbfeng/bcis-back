const {sendVerifySMS, verifySMS, sendSMS} = require('./user')
const {base64ConvertUrl} = require('./file')

Parse.Cloud.define('sendVerifySMS', function(req, res) {
    var phone = req.params.phone
    sendVerifySMS(phone).then((result) => {
        res.success(result)
    }).catch((err) =>  {
        res.error(err);
    });
});

Parse.Cloud.define('verifySMS', function(req, res) {
    let phone = req.params.phone
    let code = req.params.code
    verifySMS(phone, code).then((result) => {
        res.success(result)
    }).catch((err) =>  {
        res.error(err);
    });
});

Parse.Cloud.define('sendSMS', function(req, res) {
    let phone = req.params.phone
    let content = req.params.content
    send(phone, content).then((result) => {
        res.success(result)
    }).catch((err) =>  {
        res.error(err);
    });
});

Parse.Cloud.define('base64ConvertUrl', function(req, res) {
    let base64 = req.params.base64

    base64ConvertUrl(base64).then((result) => {
        // res.success('http://p1fdfofzn.bkt.clouddn.com/' + result.hash)
        res.success('http://p1fdfofzn.bkt.clouddn.com/' + JSON.parse(result).hash)
    }).catch((err) =>  {
        res.error(err);
    });
});
