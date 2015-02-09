var ifCurrentUser = require('./../../lib/current_user').ifCurrentUser
  , auth = require('./../../lib/auth')
  , redirectToLogin = auth.redirectToLogin
  , getUp = auth.getUp
;

// Controller configuration
exports.engine = 'jade';

exports.list = function(req, res, next) {
  var withCurrentUser = function(user) {
    getUp(user.token).sleeps.get({ limit: 300 }, function(err, body) {
      if (err) {
        console.log('Error in sleeps: ' + err)
        res.status(404)
           .send('Not found')
      } else {
        console.log('sleeps data: ' + body)
        var data = JSON.parse(body).data
          //, nextPageToken = data.links.next
        ;

        res.render('list', { data: data })
      }
    })
  };
  ifCurrentUser(req, withCurrentUser, redirectToLogin.bind({ res: res }))
};
