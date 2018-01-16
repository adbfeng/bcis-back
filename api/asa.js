const { get, post, put } =  require('../util/http')
const { header } = require('../util/config')
const { getCurrent } = require('./control')

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function getAll() {
  return getCurrent().then((res) => {
    return get({
      url: 'https://api.bmob.cn/1/classes/ASA_Course',
      data: {
        limit: 1000,
        include: 'teacher',
        where: '{"session":{"__type":"Pointer","className":"ASA_Control","objectId":"'+ JSON.parse(res).results[0].objectId +'"}}'
      },
      headers: header
    })
  })
}


function update(id, obj) {
  return put({
    url: 'https://api.bmob.cn/1/classes/ASA_Course/' + id,
    data: JSON.stringify(obj),
    headers: header
  })
}

function getAllStudent() {
  return getCurrent().then((res)=>{
    return get({
      url: 'https://api.bmob.cn/1/classes/ASA_Course_Record',
      data:{
        order:'-updatedAt',
        limit:1000,
        where:'{"session":{"__type":"Pointer","className":"ASA_Control","objectId":"' + JSON.parse(res).results[0].objectId + '"}}'
      },
      headers: header
    })
  }).then((res)=>{
    let records = JSON.parse(res).results
    for (let i in records){

      sleep(200 * i).then(()=>{
        return get({
          url: 'https://api.bmob.cn/1/classes/ASA_Course',
          data:{
            where:'{"$relatedTo":{"object":{"__type":"Pointer","className":"ASA_Course_Record","objectId":"' + records[i].objectId + '"},"key":"courses"}}'
          },
          headers: header
        })
      }).then((res)=>{
        let courses = JSON.parse(res).results
        records[i].courses = courses

        if (typeof records[i].payment_info != "undefined") {
          records[i].out_trade_no = records[i].payment_info.out_trade_no
          // records[i].date = newDate.getUTCFullYear() + "-" + (newDate.getUTCMonth() + 1) + "-" + newDate.getUTCDate() + " " + newDate.getUTCHours() + ":" + newDate.getUTCMinutes() + ":" + newDate.getUTCSeconds()
          records[i].date = moment.unix(records[i].payment_info.timestamp).format("YYYY-MM-DD HH:mm:ss")

          // basePost("Pay_Info",
          //     {
          //         price:records[i].fee,
          //         out_trade_no:records[i].out_trade_no,
          //         name:records[i].name,
          //         chinese_name:records[i].chinese_name,
          //         description:'BCIS第二课堂',
          //         date:records[i].date
          //     }
          // )
        }
      })
    }
    return sleep(200*(records.length+5)).then((res)=>{
      return Promise.resolve(records)
    })
  })
}

function getCourseFile() {
  return getAll().then((res)=>{
    var rows = []
    rows.push('title,max,fee,teacher,grade,monday,tuesday,wednesday,thursday,description')

    for (let record of JSON.parse(res).results) {
      var str_arr = ['','','','','','','','','','']

      str_arr[0] = record.title
      str_arr[1] = record.maximum_num
      str_arr[2] = record.fee
      str_arr[3] = record.teacher_name
      str_arr[4] = record.grade

      var days = record.days

      if (days.indexOf('1') != -1) {
        str_arr[5] = 'O'
      }
      if (days.indexOf('2') != -1) {
        str_arr[6] = 'O'
      }
      if (days.indexOf('3') != -1) {
        str_arr[7] = 'O'
      }
      if (days.indexOf('4') != -1) {
        str_arr[8] = 'O'
      }
      str_arr[9] = JSON.stringify(record.description)

      var str = str_arr.join(',')

      rows.push(str)
    }


    return Promise.resolve(rows.join("\n"))
  })
}

function getStudentCourseFile() {
  return getAllStudent().then((res)=>{
    var rows = []
    rows.push('grade,name,chinese_name,monday,tuesday,wednesday,thursday,fee,submitted_fee,out_trade_no,date')

    for (let record of res) {
      var str_arr = ['','','','','','','','','']

      var courses = record.courses
      str_arr[0] = record.grade
      str_arr[1] = record.name
      str_arr[2] = record.chinese_name

      if (courses.length > 0) {
        for (let course of courses) {

          if (course.days.indexOf('1') != -1) {
            str_arr[3] = course.title
          }
          if (course.days.indexOf('2') != -1) {
            str_arr[4] = course.title
          }
          if (course.days.indexOf('3') != -1) {
            str_arr[5] = course.title
          }
          if (course.days.indexOf('4') != -1) {
            str_arr[6] = course.title
          }
        }
      }

      str_arr[7] = record.fee
      str_arr[8] = record.submitted_fee
      str_arr[9] = record.out_trade_no
      str_arr[10] = record.date
      var str = str_arr.join(',')

      rows.push(str)
    }


    return Promise.resolve(rows.join("\n"))
  })
}



module.exports = {
  getAll: getAll,
  update: update,
  getStudentCourseFile:getStudentCourseFile,
  getCourseFile: getCourseFile
}