var friends = require('../data/friends.js');

module.exports = function(app) {
  // A GET route with the url /api/friends. This will be used to display a JSON of all possible friends.
  app.get('/api/friends', function(req, res) {
    return res.json(friends);
  });

  // A POST routes /api/friends. This will be used to handle incoming survey results. This route will also be used to handle the compatibility logic.
  app.post('/api/friends', function(req, res) {
    var totalDifference = 0;
    var bestMatch = {
      name: '',
      photo: '',
      friendDifference: 1000
    };

    var userData = req.body;
    var userName = userData.name;
    var userScores = userData.scores;
    var intScores = userScores.map(function(item) {
      return parseInt(item, 10);
    });

    userData = {
      name: req.body.name,
      photo: req.body.photo,
      scores: intScores
    };

    var sum = intScores.reduce((a, b) => a + b, 0);

    for (var i = 0; i < friends.length; i++) {
      totalDifference = 0;

      var bfriendScore = friends[i].scores.reduce((a, b) => a + b, 0);
      totalDifference += Math.abs(sum - bfriendScore);

      if (totalDifference <= bestMatch.friendDifference) {
        bestMatch.name = friends[i].name;
        bestMatch.photo = friends[i].photo;
        bestMatch.friendDifference = totalDifference;
      }
    }
    friends.push(userData);
    res.json(bestMatch);
  });
};
