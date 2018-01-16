var Promise = require('promise')
var nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'jaygao@bcis.net.cn', // generated ethereal user
    pass: 'Chris722435'  // generated ethereal password
  }
})



function sendMail(mail,subject,body) {


  // setup email data with unicode symbols
  let mailOptions = {
    from: '<jaygao@bcis.net.cn>', // sender address
    to: mail, // list of receivers
    subject: subject, // Subject line
    text: body, // plain text body
  };

  return new Promise((resolve,reject)=>{
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error)
      } else {
        resolve(info)
      }
    });
  })
  // send mail with defined transport object

}

function sendMailWithFile(mail,subject,body,filename,str) {

  // setup email data with unicode symbols
  let mailOptions = {
    from: '<jaygao@bcis.net.cn>', // sender address
    to: mail, // list of receivers
    subject: subject, // Subject line
    text: body, // plain text body
    attachments:[{
      filename: filename,
      content: str
    }]
  };

  return new Promise((resolve,reject)=>{
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error)
      } else {
        resolve(info)
      }
    });
  })

  // send mail with defined transport object

}

module.exports = {
  sendMail: sendMail,
  sendMailWithFile: sendMailWithFile
}