
function getToday() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }
  return yyyy + "-" + mm + '-' + dd
}


function getWeekNum(date) {
  var date = new Date(date)

  var first_day = new Date(date.getFullYear(), 0, 1)

  var first_week_day = (first_day.getDay() == 0 ? 7 : first_day.getDay()) - 1

  var dayMS = 24 * 60 * 60 * 1000

  var weekMS = dayMS * 7

  var ms_diff = date.getTime() - first_day.getTime() + first_week_day * dayMS

  var weekNum = Math.floor(ms_diff / weekMS)

  return weekNum
}