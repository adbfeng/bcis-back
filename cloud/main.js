const asa = require('../api/asa')
const user = require('../api/user')
const mail = require('../util/mail')
const pay = require('../api/pay')
const sms = require('../api/sms')
Parse.Cloud.define('getAllCourses', function(req, res) {
  asa.getAll().then((result) => {
    res.success(result.results)
  }).catch((err) =>  {
    res.error(err)
  });
});

Parse.Cloud.define('updateASA', function(req, res) {
  asa.update(req.params.id, req.params.obj).then((result) => {
    res.success(result.results)
  }).catch((err) => {
    res.error(err)
  })
});

Parse.Cloud.define('downloadStudentCourse', function (req, res) {
  var params = req.params
  console.log(params)
  var email = params.email
  var subject = params.subject
  var body = params.body
  var filename = params.filename
  asa.getStudentCourseFile().then((str)=>{
    return mail.sendMailWithFile(email,subject,body,filename,str)
  }).then((ress)=>{
    res.success(ress)
  })
})

Parse.Cloud.define('downloadCourse', function (req, res) {
  var params = req.params

  var email = params.email
  var subject = params.subject
  var body = params.body
  var filename = params.filename
  asa.getCourseFile().then((str)=>{
    return mail.sendMailWithFile(email,subject,body,filename,str)
  }).then((ress)=>{
    res.send(ress)
  })
})


Parse.Cloud.define('sendMail', function (req, res) {
  var params = req.params

  var email = params.email
  var subject = params.subject
  var body = params.body
  mail.sendMail(email,subject,body).then((ress)=>{
    res.success(ress)
  })
})

Parse.Cloud.define('downloadPay', function (req, res) {
  pay.getPayment().then((str)=>{
    mail.sendMailWithFile('ireneou@bcis.net.cn',"付款信息",'付款信息','pay_info.csv',str)
    return mail.sendMailWithFile('jaygao@bcis.net.cn',"付款信息",'付款信息','pay_info.csv',str)
  }).then((ress)=>{
    res.success(ress)
  })
})

Parse.Cloud.define('login', function(req, res) {
  let username = req.params.username
  let password = req.params.password
  user.login(username, password).then((result) => {
    res.success(result)
  }).catch((err) =>  {
    res.error(err)
  });
});

Parse.Cloud.define('sendSMS', function(req, res) {
  let phone = req.params.phone
  let content = req.params.content
  sms.sendSMS(phone, content).then((result) => {
    res.success(result)
  }).catch((err) =>  {
    res.error(err)
  });
});
