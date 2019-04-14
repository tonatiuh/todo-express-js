var createError = require('http-errors');
var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { Task } = require('./models');

var indexRouter = require('./routes/index');
var tasks = require('./routes/tasks');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.get('/tasks', tasks.list);
app.post('/tasks', tasks.create);

app.locals.moment = require('moment');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.param('task_id', async (req, _res, next, taskId) => {
  const task = await Task.findByPk(taskId);
  if (!task) return next(new Error('Task is not found.'));
  req.task = task;

  return next();
});

app.set('port', 3000);

app.use(require('less-middleware')({
  src: __dirname + '/public',
  compress: true
}));

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
