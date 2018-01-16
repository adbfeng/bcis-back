const { get, post, put, postWithoutJson } =  require('../util/http')
const { header } = require('../util/config')
const { getCurrent } = require('./control')

var crypto = require('crypto')
var js2xmlparser = require("js2xmlparser");
var appid = process.env.appid
var mch_id = process.env.mch_id
var pay_key = process.env.pay_key

function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}


function getPayment() {
  return get({
    url: 'https://api.bmob.cn/1/classes/Confirmed_Pay_Info',
    data: {
      order:'-date',
      limit:1000
    },
    headers: header
  }).then((res) => {
    let result = JSON.parse(res).results
    var rows = []
    rows.push('中文名,英文名,商户订单号,微信订单号,商品名称,交易状态,总金额,退款金额,手续费,提现金额')

    var current_day = result[0].date.substr(0,10)
    var current_num = 0
    var current_total_fee = 0
    var current_commission_fee = 0
    var current_refund_fee = 0

    rows.push([current_day,'','','','','','','','',''].join(','))

    for (let record of result) {
      var str_arr = ['','','','','','','','','','']

      if (record.date.substr(0,10) != current_day) {
        rows.push(['总笔数','订单总金额','总退款金额','手续费总金额','总提现金额','','','','',''].join(','))
        rows.push([current_num,current_total_fee,current_refund_fee,current_commission_fee,current_total_fee - current_refund_fee - current_commission_fee,'','','','',''].join(','))
        rows.push(['','','','','','','','','',''].join(','))
        rows.push(['','','','','','','','','',''].join(','))

        current_day = record.date.substr(0,10)
        rows.push([current_day,'','','','','','','','',''].join(','))
        current_num = 0
        current_total_fee = 0
        current_commission_fee = 0
        current_refund_fee = 0
      }


      current_num++
      current_total_fee += record.total_fee
      current_commission_fee += record.commission_fee
      current_refund_fee += record.refund_fee

      str_arr[0] = record.chinese_name
      str_arr[1] = record.name
      str_arr[2] = record.transaction_id
      str_arr[3] = record.out_trade_no
      str_arr[4] = record.description
      str_arr[5] = record.trade_state
      str_arr[6] = record.total_fee
      str_arr[7] = record.refund_fee
      str_arr[8] = record.commission_fee
      str_arr[9] = record.actual_fee

      var str = str_arr.join(',')

      rows.push(str)
    }

    rows.push(['总笔数','订单总金额','手续费总金额','总提现金额','','','','','',''].join(','))
    rows.push([current_num,current_total_fee,current_commission_fee,current_total_fee - current_commission_fee - current_refund_fee,'','','','','',''].join(','))



    return Promise.resolve(rows.join("\n"))
  })
}

function getPaymentWithNo(out_trade_no) {
  return get({
    url: 'https://api.bmob.cn/1/classes/Pay_Info',
    data: {
      where:'{"out_trade_no":"'+ out_trade_no +'"}'
    },
    headers: header
  }).then((res) => {
    return Promise.resolve(JSON.parse(res).results)
  })
}
function isConfirmedPaymentExist(arr) {
  return get({
    url: 'https://api.bmob.cn/1/classes/Confirmed_Pay_Info',
    data: {
      where:'{"out_trade_no":"'+ arr[6] +'"}'
    },
    headers: header
  }).then((res) => {
    if (JSON.parse(res).results.length > 0) {
      for (let record of JSON.parse(res).results) {
        if (arr[9] == record.trade_state) {
          return Promise.resolve(true)
        }
      }
      return Promise.resolve(false)
    } else {
      return Promise.resolve(false)
    }

  })
}

function refreshPaymentData(bill_date) {
  return new Promise((resolve,reject) =>{
    if (typeof bill_date == 'undefined') {
      bill_date = new Date(new Date().getTime() - 1000 * 3600 * 24).toISOString().substring(0, 10).replace(/-/g,'')
    }
    var bill_type = 'ALL'
    var nonce_str = randomString()

    var sign_str =
      'appid=' + appid + '&' +
      'bill_date=' + bill_date  + '&' +
      'bill_type=' + bill_type  + '&' +
      'mch_id=' + mch_id  + '&' +
      'nonce_str=' + nonce_str + '&' +
      'key=' + pay_key

    var sign = crypto.createHash('md5').update(sign_str).digest('hex').toUpperCase()

    var body = {
      appid: appid,
      bill_date:bill_date,
      bill_type:bill_type,
      mch_id:mch_id,
      nonce_str:nonce_str,
      sign:sign
    }

    var xmlbody = js2xmlparser.parse('xml',body)
    request({
      method:"POST",
      uri: 'https://api.mch.weixin.qq.com/pay/downloadbill',
      body:xmlbody
    },function (err,response,body) {
      if (err || body.startsWith('<xml>')) {
        reject(err)
      } else {
        resolve(body)
      }
    })
  }).then((body)=>{
    //get raw data
    var raw_arr = body.split('\r\n')
    var data_arr = raw_arr.slice(1,raw_arr.length - 3)

    //process raw data
    var processed_arr = []

    for (let obj of data_arr) {
      processed_arr.push(obj.replace(/`/g,'').split(','))
    }

    for (let i in processed_arr) {
      sleep(500 * i).then(()=>{
        console.log(processed_arr[i][6])
        return getPaymentWithNo(processed_arr[i][6])
      }).then((res)=>{
        processed_arr[i][24] = ''
        processed_arr[i][25] = ''
        if (res.length > 0) {
          var record = res[0]
          processed_arr[i][24] = record.name
          processed_arr[i][25] = record.hasOwnProperty("chinese_name") ? record.chinese_name :""
        }

        return isConfirmedPaymentExist(processed_arr[i])

      }).then((res)=>{
        if (!res) {
          post({
            url: 'https://api.bmob.cn/1/classes/Confirmed_Pay_Info',
            data: {
              date:processed_arr[i][0],
              transaction_id:processed_arr[i][5],
              out_trade_no:processed_arr[i][6],
              trade_state:processed_arr[i][9],
              bank_type:processed_arr[i][10],
              fee_type:processed_arr[i][11],
              total_fee:parseFloat(processed_arr[i][12]),
              refund_id:processed_arr[i][14],
              out_refund_no:processed_arr[i][15],
              refund_fee:parseFloat(processed_arr[i][16]),
              refund_status:processed_arr[i][19],
              description:processed_arr[i][20],
              commission_fee:parseFloat(processed_arr[i][22]),
              name:processed_arr[i][24],
              chinese_name:processed_arr[i][25],
              actual_fee:parseFloat(processed_arr[i][12]) - parseFloat(processed_arr[i][16]) - parseFloat(processed_arr[i][22]),
            },
            headers: header
          })
        }
      })
    }
  },(err)=>{

  })

}

module.exports = {
  getPayment:getPayment
}
