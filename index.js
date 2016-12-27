var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');

// Init App
var app = express();

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index', {
    title: 'Home Page'
  });
});

app.get('/gaugechart', function(req, res) {
  res.render('gaugechart', {
    title: 'Gauge Chart'
  });
});

app.get('/meterchart', function(req, res) {
  res.render('meterchart', {
    title: 'Speedometer Chart'
  });
});


// Get the db connection with keyspace
client = new cassandra.Client({contactPoints: ['localhost'], keyspace: 'd3js1'});

app.get('/wcharts/:id', function(req, res) {
  var query = 'SELECT data FROM chart_data WHERE cid=?';
  client.execute(query, [req.params.id], {prepare: true}, function (err, result) {
    console.log(JSON.parse(result.rows[0].data));
    res.render('charts', {
      title: 'Charts ' + req.params.id + ' Page',
      json_data: result.rows[0].data
    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
