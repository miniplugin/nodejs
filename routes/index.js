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
			var exec = conn.query('select ?? from ??', [columns, tablename], function (err, rows) {
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