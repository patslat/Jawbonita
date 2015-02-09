var request = require('request')
  , secrets = require('../secrets')
  , querystring = require('querystring')
  , secret = secrets.jawboneSecret
  , clientId = secrets.jawboneClientId
  , redirectToLogin = function() {
      this.res.render('index', { loggedIn: false, user: {} })
    }

  , alreadyLoggedIn = function(user) {
      this.res.render('index', { loggedIn: true, user: user })
    }

  , getPermission = function() {
      var scopes = [
        'basic_read',
        'extended_read',
        'location_read',
        'friends_read',
        'mood_read',
        'move_read',
        'sleep_read',
        'meal_read',
        'weight_read',
        'generic_event_read',
        'heartrate_read'
      ],
      qs = querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        scope: scopes.join(' '),
        redirect_uri: 'https://jawbonita.herokuapp.com/login_callback'
      });

      this.res.redirect('https://jawbone.com/auth/oauth2/auth?' + qs)
    }

  , authTokenRequest = function(code, cbk) {
      var uri = 'https://jawbone.com/auth/oauth2/token?client_id=' +
        clientId +
        '&client_secret=' +
        secret +
        '&grant_type=authorization_code' +
        '&code=' +
        code;

      request(
        uri,
        cbk
      )
    }

  , getUp = function(token) {
      var options = {
        access_token: token,
        client_secret: secret
      }
      return require('jawbone-up')(options)
    };
module.exports = {
  redirectToLogin: redirectToLogin
, alreadyLoggedIn: alreadyLoggedIn
, getPermission: getPermission
, authTokenRequest: authTokenRequest
, getUp: getUp
}
