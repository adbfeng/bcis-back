const header = {
  'X-Bmob-Application-Id': process.env.BMOB_APP_ID,
  'X-Bmob-REST-API-Key': process.env.BMOB_API_KEY,
  'Content-Type': 'application/json'
}

module.exports = {
  header: header
}
