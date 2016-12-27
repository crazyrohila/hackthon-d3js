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
    title: 'D3js Charts Demo',
    charts: [{
      title: 'Cassandra Charts',
      url: '/wcharts/1'
    }, {
      title: 'Gauge Chart',
      url: '/gaugechart'
    }, {
      title: 'Speedometer Chart',
      url: '/meterchart'
    }]
  });
});

app.get('/gaugechart', function(req, res) {
  res.render('gaugechart', {
    title: 'Gauge Chart',
    desc: 'This chart picking random values on click. So click on it!'
  });
});

app.get('/meterchart', function(req, res) {
  res.render('meterchart', {
    title: 'Speedometer Chart',
    desc: 'This chart is updating random values on time interval.'
  });
});


// Get the db connection with keyspace
client = new cassandra.Client({contactPoints: ['localhost'], keyspace: 'd3js1'});

// Details page
app.get('/wcharts/:id', function(req, res) {
  var query = 'SELECT cid,data FROM chart_data';
  client.execute(query, [], {prepare: true}, function (err, result) {
    var charts = [];
    var json_data;
    result.rows.forEach(function(row, i) {
      charts.push({
        title: 'Chart ' + row.cid,
        url: '/wcharts/' + row.cid
      });
      if (row.cid == req.params.id) {
        json_data = row.data;
      }
    });
    res.render('charts', {
      title: 'Charts ' + req.params.id + ' View',
      desc: 'These charts are coming from cassandra db.'
      json_data: json_data,
      charts: charts
    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
