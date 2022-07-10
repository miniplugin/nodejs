var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'));

module.exports = app;

// 푸시기능, 챠트 실시간 렌더링 하는 소켓앱 시작
//http서버 객체를 생성시 app(express) 프레임워크를 전달
var http = require('http').createServer(app);
//socket.io 소켓 통신 객체생성 시 http를 객체로 전달
var io = require("socket.io")(http, { //현재는 socket.io 는 4.5.1 버전이다. http서버 소켓통신에서 cors 허용하기 위해서 아래 추가
	cors: {
	  origin: "https://nodejs-jvbqr.run.goorm.io", //도메인 대신에 * 로 하면 모든 도메인에서 허용된다. 보안상 도메인을 지정하는것이 안전하다.
	  methods: ["GET", "POST"]
	}
});
//.listen은 클라이언트에서 서버로 접속을 받기위해 대기하는 명령
http.listen(5000, function () {
    console.log('앱이 시작 되었습니다. 포트번호: ' + 5000);
});
var jsonMsg = { msg: '' }; //io서버와 스프링간의 메세지 전송 담는 변수
//.on함수는 클라이언트에서 서버로 소켓통신의 이벤트를 대기하는 명령
io.on('connection', function (socket) {
    console.log(socket.id + ' user 접속됨');
    io.emit('OnOff', jsonMsg); //스프링의 Model같은역할-접속한 All소켓에 OnOff변수명으로 msg를 보냅니다.

    //client가 접속을 끊었을때
    //위 아래 결과 확인은 http://localhost:5000/socket.io/socket.io.js 이 소스를 사용
    socket.on('disconnect', function () {
        console.log(socket.id + ' user 접속끊어짐');
    });
    socket.on('OnOff', function (jsonMsg) {
        //1:1통신 받은내용
        console.log('소켓으로 받은 메세지는 ' + jsonMsg.msg);
        if (jsonMsg.msg == 'updateRender') {
            io.emit('OnOff', jsonMsg); //1:다 통신으로 보냅니다.
        }
    });
});