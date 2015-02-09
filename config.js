var cookieParser = require('cookie-parser')
  , express = require('express')
  , ejs = require('ejs')
;

module.exports = function(app) {
  var view_engine = 'html'
  , title = 'Jawbonita'
;

  app.use(express.static(__dirname + '/src'));
  app.use('/bower_components',  express.static(__dirname + '/public/bower_components'));
  app.use(cookieParser())
  app.engine('html', ejs.renderFile)
  app.set('view engine', view_engine)
  app.set('title', title)
};
