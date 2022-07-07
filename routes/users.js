var express = require('express');
var router = express.Router();
var crypto = require('crypto'); //노드js 에서 mysql sha1() 암호화함수 사용하기

//===== MySQL 데이터베이스를 사용할 수 있도록 하는 mysql 모듈 불러오기 =====//
var mysql = require('mysql');

//===== MySQL 데이터베이스 연결 설정 =====//
var pool      =    mysql.createPool({
    connectionLimit : 30, 
    host     : 'localhost',
    user     : 'root',
    password : 'apmsetup',
    database : 'nodejs',
    debug    :  false
});

pool.getConnection(function (err, conn) {
	if (err) {
		if (conn) {
			conn.release(); // 반드시 해제해야 함
		}
		console.error('데이터 접속 에러' + err); //이 콘솔은 서버 터미널에서 확인가능하다. 크롬 브라우저의 콘솔이 아니다.
		return;
	} else {
		console.log('데이터베이스 접속에 성공하였습니다.');
	}
});

// 리스트사용자페이지
router.route('/listuser').get(function(req,res){
    console.log('/users/listuser 호출됨');
    if(pool) {
        pool.getConnection(function(err, conn){
          console.log('데이터베이스 연결 스레드 아이디: '+ conn.threadId);
          var columns = ['id','name','age'];
          var tablename = 'users';
          //SQL문을 실행 preparedStatement 미리정의된 SQL문
          var exec = conn.query("select ?? from ??",[columns,tablename],function(err,rows){
            conn.release();//연결해제.
            console.log('실행 대상 SQL : '+ exec.sql);
            if(rows.length > 0) {
                console.log('사용자 리스트 있음');
                res.render('users/listuser', {userList:rows});
            }else{
                console.log('사용자 리스트 없음.');
                res.render('users/listuser', {userList:rows});
            }
          });
        });
    }else{
        //pool이 false일때
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패.</h2>');
        res.end();
    }
});
// 사용자 등록 라우터의 route함수 사용(next 매개변수가 없다.)
router.route('/adduser').post(function(req,res){
    console.log('/users/adduser 호출된.');
    //html에서 넘어온 데이터를 req받아서 처리(아래)
    var paramId = req.body.id;
    var paramPassword = req.body.password;
    var paramName = req.body.name;
    var paramAge = req.body.age;
    if(paramPassword !="") {
       paramPassword = crypto.createHash("sha1").update(paramPassword).digest("hex");
    }
    console.log('요청 파라미터: '+paramId+','+paramPassword+','+paramName+','+paramAge);
    if(pool) {
        pool.getConnection(function(err, conn){
            console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
            //html 파라미터 데이터를 insert쿼리에 사용하기 위해서 객체로 만듬
            var data = {id:paramId,name:paramName,age:paramAge,password:paramPassword};//json데이터타입의 객체(배열, 키:밸류)
            //SQL 문 실행
            var exec = conn.query('insert into users set ?', data, function(err, result){
                conn.release();
                console.log('SQL구문 확인: '+exec.sql);
                if(err) {
                    console.log('insert 쿼리 에러발생'+err.stack);
                    res.end();
                    return;
                }
                console.log(result);
                //res.redirect('/users/listuser');
                res.send('<script>alert("등록 되었습니다.");window.location="/users/listuser"</script>');
            });
        });
    }else{
        //pool이 false일때
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패.</h2>');
        res.end();
    }
});

router.get('/adduser', function(req, res, next) {
    console.log('/users/adduser 호출됨.');
    res.render('users/adduser');
});

/* GET users listing. */
router.get('/login', function(req, res, next) {
    console.log('/users/login 호출됨.');
    res.render('users/login', { title: '로그인 폼' });
});

module.exports = router;