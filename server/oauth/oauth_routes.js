"use strict";

var controller  = require('./oauth_controllers.js'),
    passport    = require('./oauth_config.js').passport,
    querystring = require("querystring");

var referrer;

module.exports = exports = function (router) {
  router
    .get('/google', function (req, res, next) {
      referrer = req.get('Referrer');
      passport.authenticate('google', {
        scope: ['openid', 'email'],
        accessType: 'offline',
        approvalPrompt: 'force'
      })(req, res, next);
    })
    .get('/google/callback', function (req, res, next) {
      passport.authenticate('google', function(err, user, info) {
        var error = '',
            userString = '';
        if (err) {
          error = JSON.stringify(err);
        } else if (!user) {
          error = 'Authentication failure';
        } else {
          userString = querystring.escape(JSON.stringify(user));
        }
        var host = referrer ? referrer : process.env.REST_PROTOCOL + '://' + process.env.REST_HOSTNAME;
        res.redirect(host + '#/oauth/callback?user=' + userString + '&error=' + error);
      })(req, res, next);
    });
};