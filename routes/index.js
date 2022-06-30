var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

//추가작업 시작(아래)
//===== MySQL 데이터베이스를 사용할 수 있도록 하는 mysql 모듈 불러오기 =====//
var mysql = require('mysql');

//===== MySQL 데이터베이스 연결 설정 =====//
var pool = mysql.createPool({
	connectionLimit: 30,
	host: 'localhost',
	user: 'root',
	password: 'apmsetup',
	database: 'nodejs',
	debug: false,
});

pool.getConnection(function (err, conn) {
	if (err) {
		if (conn) {
			conn.release(); // 반드시 해제해야 함
		}
		console.log(err); //이 콘솔은 서버 터미널에서 확인가능하다. 크롬 브라우저의 콘솔이 아니다.
		return;
	} else {
		console.log('데이터베이스 접속에 성공하였습니다.');
	}
});

// 챠트 데이터 저장(수정)하기 라우팅 함수
router.route('/chart/setdata').post(function (req, res) {
	console.log('/chart/setdata 호출됨.');
	var paramRed = req.body.red || req.query.red;
	var paramBlue = req.body.blue || req.query.blue;
	var paramYellow = req.body.yellow || req.query.yellow;
	var paramGreen = req.body.green || req.query.green;
	var paramPurple = req.body.purple || req.query.purple;
	var paramOrange = req.body.orange || req.query.orange;
	console.log(
		'요청 파라미터 : ' +
			paramRed +
			', ' +
			paramBlue +
			', ' +
			paramYellow +
			', ' +
			paramGreen +
			', ' +
			paramPurple +
			', ' +
			paramOrange
	);
	var data = [paramRed, paramBlue, paramYellow, paramGreen, paramPurple, paramOrange];
    var toNumbers = arr => arr.map(Number);//문자열 배열을 숫자형 변경하는 코드(=> 람다식이라고 하고, 반환값 => 구현내용으로 구성)
    var sessionId = "admin";//users 테이블 회원명을 입력한다. 나중에 로그인 기능 추가시 동적값으로…
    // pool 객체가 초기화된 경우, setData 함수생성예정
	if (pool) {
		// 커넥션 풀에서 연결 객체를 가져옴
        pool.getConnection(function (err, conn) {
            console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
            var columns = ['red', 'blue', 'yellow', 'green', 'purple', 'orange', 'users_id'];
			var tablename = 'tbl_chart';
            // SQL 문을 실행함 INSERT INTO [테이블] (필드명) VALUES (?,?,?,?,?,?,?)
            var exec = conn.query('insert into ?? (??) values (?,?)', [tablename, columns, toNumbers(data), sessionId], function (err, result) {
                conn.release(); // 반드시 해제해야 함
                console.log('실행 대상 SQL : ' + exec.sql);
                if (err) {
                    console.log('SQL 실행 시 에러 발생함.');
                    console.dir(err);
                    res.end();
                    return;
                }
                res.end("{}");
            });
            conn.on('error', function (err) {
                console.log('데이터베이스 연결 시 에러 발생함.');
                console.dir(err);
                res.end();
            });
        });
	} else {
		// 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.error('pool 객체가 생성되지 않았습니다. : ' + err.stack);
		res.end();
	}
});

// 챠트 데이터 가져오기 라우팅 함수
router.route('/chart/getdata').get(function (req, res) {
	console.log('/chart/getdata 호출됨.');
	// pool 객체가 초기화된 경우, allData 함수생성예정
	if (pool) {
		// 커넥션 풀에서 연결 객체를 가져옴
		pool.getConnection(function (err, conn) {
			console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
			var columns = ['red', 'blue', 'yellow', 'green', 'purple', 'orange'];
			var tablename = 'tbl_chart';
			// SQL 문을 실행합니다.
			//var exec = conn.query('select ?? from ??', [columns, tablename], function (err, rows) {
			var exec = conn.query('select sum(red) as red,sum(blue) as blue,sum(yellow) as yellow,sum(green) as green,sum(purple) as purple,sum(orange) as orange from ??', [tablename], function (err, rows) {
				conn.release(); // 반드시 해제해야 함
				console.log('실행 대상 SQL : ' + exec.sql);
				if (rows.length > 0) {
					console.log('챠트 데이터 있음.');
					res.end(JSON.stringify(rows));//json 데이터를 문자열로 변환한 후 ejs 디자인으로 응답한다.
				} else {
					console.log('챠트 데이터 없음.');
					res.end("{}");
				}
			});
			conn.on('error', function (err) {
				console.log('데이터베이스 연결 시 에러 발생함.');
				console.dir(err);
				res.end();
			});
		});
	} else {
		// 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.error('pool 객체가 생성되지 않았습니다. : ' + err.stack);
		res.end();
	}
});
module.exports = router;