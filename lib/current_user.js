var User = require('../models/models').User;

var ifCurrentUser = function(req, presentCbk, absentCbk) {
  if (req.cookies.jawbonitaId) {
    var jawbonitaId = req.cookies.jawbonitaId;
    console.log('looking for user with id: ', jawbonitaId)
    User.find({name: jawbonitaId}, function(err, docs) {
      if (err) {
        console.log('Error: ' + error)
        absentCbk()
      } else {
        var user = docs[0];
        user ? presentCbk(user) : absentCbk();
      }
    })
  } else {
    absentCbk()
  }
};

module.exports.ifCurrentUser = ifCurrentUser
