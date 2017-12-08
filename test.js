var Parse = require('parse/node');

Parse.initialize("myAppId");
Parse.serverURL = 'http://localhost:1337/api'


// var GameScore = Parse.Object.extend("GameScore");
// var gameScore = new GameScore();
//
// gameScore.set("score", 1337);
// gameScore.set("playerName", "aaaaaa");
// gameScore.set("cheatMode", false);
//
// gameScore.save(null, {
//     success: function(gameScore) {
//         // Execute any logic that should take place after the object is saved.
//         console.log(gameScore);
//     },
//     error: function(gameScore, error) {
//         // Execute any logic that should take place if the save fails.
//         // error is a Parse.Error with an error code and message.
//         console.log(error)
//     }
// });


Parse.Cloud.run("hello").then(function(ratings) {
    console.log(ratings)
});
