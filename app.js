
/**
 * Module dependencies.
 */

var express = require('express')
  , linkedin_client = require('linkedin-js')('qzsDK37C5D0lJWFphFIu27EPiFH0vzck7uwuyUeQLrAI42kO1TclBoVrXW0EA4iU',
                                            'KHZc7982D_ulaW4FDXdn_1bKPQMW-NKS4e8JvECGeTjov3pZTXhjTjWnnYkyWvoA',
                                            'http://127.0.0.1:3001/auth')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , util = require('util');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('No Secret'));
  app.use(express.session({ secret: "string" }))
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});



app.get('/auth', function (req, res) {
    // the first time will redirect to linkedin
    console.log('linkedin auth');
    linkedin_client.getAccessToken(req, res, function (error, token) {
            req.session.token = token;
            res.send('successfully logged into linkedin ' + util.inspect(token));
    }, ['r_fullprofile', 'r_network', 'rw_nus']
    );
});

app.get('/connections', function (req, res) {
    linkedin_client.apiCall('GET', '/people/~/connections',
        {
            token: {
                oauth_token_secret: req.session.token.oauth_token_secret
                , oauth_token: req.session.token.oauth_token
            }

        }
        , function (error, result) {
            res.send('result is ' + util.inspect(result));
        }
    );
});

app.listen(3001);

console.log('Go to http://local.host:3001');

module.exports = app;