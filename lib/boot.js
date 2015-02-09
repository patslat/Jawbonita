var fs = require('fs')
  , mongoose = require('mongoose')
  , express = require('express')
;

var _initializeDb = function() {
      if (process.env.MONGOLAB_URI) {
        console.log('CONNECTING TO MONGO AT: ', process.env.MONGOLAB_URI)
        mongoose.connect(process.env.MONGOLAB_URI)
      } else {
        console.log('CONNECTING TO LOCAL MONGO')
        mongoose.connect('mongodb://localhost/jawbonita')
      }
    }

  , _initializeServer = function(app) {
      var port = process.env.PORT || 8080;
      app.listen(port, function() {
        console.log('Our app is running on http://localhost:', port);
      });
    }

  , _loadControllers = function(parent) {
      fs.readdirSync(__dirname + '/../controllers').forEach(function(name) {
        var obj = require('./../controllers/' + name)
          , name = obj.name || name
          , prefix = obj.prefix || ''
          , app = express()
          , handler
          , method
          , path
        ;

        // Allow specification of a view engine
        if (obj.engine) app.set('view engine', obj.engine);
        app.set('views', __dirname + '/../controllers/' + name + '/views');

        // Generate routes from exported methods
        for (var key in obj) {
          // Reserved exports
          if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;
          switch (key) {
            case 'show':
              method = 'get';
              path = '/' + name + '/:' + name + '_id';
              break;
            case 'list':
              method = 'get';
              path = '/' + name + 's';
              break;
            case 'index':
              method = 'get';
              path = '/';
              break;
            default:
              throw new Error('unrecognized route: ' + name + '.' + key);
          }
        }

        handler = obj[key]
        path = prefix + path

        if (obj.before) {
          app[method](path, obj.before, handler);
          console.log('     %s %s -> before -> %s', method.toUpperCase(), path, key);
        } else {
          app[method](path, obj[key]);
          console.log('     %s %s -> %s', method.toUpperCase(), path, key);
        }

        // Mount the controller
        parent.use(app)
      })
  }
;

module.exports = function(app) {
  _initializeDb()
  _initializeServer(app)
  _loadControllers(app)
}
