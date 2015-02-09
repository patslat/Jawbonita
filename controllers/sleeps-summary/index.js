var _ = require('underscore')
  , ifCurrentUser = require('./../../lib/current_user').ifCurrentUser
  , auth = require('./../../lib/auth')
  , redirectToLogin = auth.redirectToLogin
  , getUp = auth.getUp
;

exports.prefix = '/sleeps/summary';
exports.engine = 'jade';

exports.index = function(req, res, next) {
  var seed = require('./../../lib/sleep_seeds').data;
  var sleeps = seed.data.items
    , fullSleeps = _(sleeps).where({ sub_type: 0 }) // 0 represents normal sleep
    , data = _(fullSleeps).map(function(sleep) {
        return { date: sleep.date, duration: sleep.details.duration };
      })
  ;
  return res.render('index', { data: data });

  var withCurrentUser = function(user) {
    getUp(user.token).sleeps.get({ limit: 300 }, function(err, body) {
      if (err) {
        console.log('Error in sleeps summary: ', err)
        res.status(404)
           .send('Not Found')
      } else {
        console.log('seed this: ');
        console.log(body);
        var sleeps = JSON.parse(body).data.items
          , fullSleeps = _(sleeps).where({ sub_type: 0 }) // 0 represents normal sleep
          , data = _(fullSleeps).map(function(sleep) { return { date: sleep.date, duration: sleep.details.duration }; })
        ;
        res.render('index', { data: data })
      }
    })
  };

  ifCurrentUser(req, withCurrentUser, redirectToLogin)
};
