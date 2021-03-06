// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var schedule = require('node-schedule');

var databaseUri = process.env.DATABASE_URI || 'mongodb://localhost:27017'
var serverUrl = process.env.SERVER_URL || 'http://localhost:1337/api'
var appId = process.env.APP_ID || 'myAppId'
var masterKey = process.env.MASTER_KEY || 'myMasterKey'//Add your master key here. Keep it secret!
var user = process.env.USERNAME || 'user12'
var password = process.env.PASSWORD || 'pass2'
var apiPath = process.env.PARSE_MOUNT || '/api';
var allowInsecureHTTP = process.env.ALLOW_INSECURE_HTTP || true
var appName = process.env.APP_NAME || "BCIS"
require('dotenv').config()
var pay = require('./api/pay')

var api = new ParseServer({
  databaseURI: (databaseUri || 'mongodb://localhost:27017/') + appName,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: appId,
  masterKey: masterKey, //Add your master key here. Keep it secret!
  serverURL: serverUrl // Don't forget to change to https if needed
});



var app = express();

app.use(apiPath, api);



var ParseDashboard = require('parse-dashboard');

var options = { allowInsecureHTTP: allowInsecureHTTP };

var dashboard = new ParseDashboard({
    "apps": [
        {
            "serverURL": serverUrl,
            "appId": appId,
            "masterKey": masterKey,
            "appName": appName
        }
    ],
    "users": [
        {
            "user":user,
            "pass":password
        }
    ]
},options);

app.use('/dashboard', dashboard);


var port = process.env.PORT || 1337;

var httpServer = require('http').createServer(app);

httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

schedule.scheduleJob('59 12 * * *', () => {
  pay.refreshPaymentData()
}) // run everyday at midnight



