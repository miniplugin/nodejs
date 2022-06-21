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


// 챠트 데이터 삭제(초기화)하기 라우팅 함수
router.route('/chart/deldata').post(function (req, res) {
	console.log('/chart/deldata 호출됨.');
	var data = { red: 0, blue: 0, yellow: 0, green: 0, purple: 0, orange: 0 };
	if (pool) {
		defaultData(data, function (err, result) {
			// 클라이언트로 에러 전송
			if (err) {
				console.error('데이터 수정 중 에러 발생 : ' + err.stack);
				res.end();
				return;
			}
			// 결과 객체 있으면 성공 응답 전송
			if (result) {
				console.dir(result);
				res.end("success");
			} else {
				console.error('데이터 수정 중 에러 발생 : ' + err.stack);
				res.end();
			}
		});
	} else {
		// 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.error('pool 객체가 생성되지 않았습니다. : ' + err.stack);
		res.end();
	}
});
var defaultData = function (data, callback) {
	console.log("defaultData 호출됨: %j", data);
	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function (err, conn) {
		if (err) {
			if (conn) {
				conn.release(); // 반드시 해제해야 함
			}
			callback(err, null);
			return;
		}
		console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
		// SQL 문을 실행함 UPDATE [테이블] SET [열] = '변경할값' WHERE [조건]
		//var sql= 'UPDATE tbl_chart SET red=?, blue=?, yellow=?, green=?, purple=?, orange=? WHERE 1=1';
		var exec = conn.query('update tbl_chart set ? where 1 = 1', [data], function (err, result) {
			conn.release(); // 반드시 해제해야 함
			console.log('실행 대상 SQL : ' + exec.sql);
			if (err) {
				console.log('SQL 실행 시 에러 발생함.');
				console.dir(err);
				callback(err, null);
				return;
			}
			console.log(result);
			callback(null, result);
		});
		conn.on('error', function (err) {
			console.log('데이터베이스 연결 시 에러 발생함.');
			console.dir(err);
			callback(err, null);
		});
	});
};

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
	//DB저장전 전송값이 없을 때 초기값을 0 으로 초기화
	if(paramRed==undefined||"") { paramRed=0; }
	if(paramBlue==undefined||"") {paramBlue=0; }
	if(paramYellow==undefined||"") { paramYellow=0; }
	if(paramGreen==undefined||"") { paramGreen=0; }
	if(paramPurple==undefined||"") { paramPurple=0; }
	if(paramOrange==undefined||"") { paramOrange=0; }
	var data = {
		red: paramRed,
		blue: paramBlue,
		yellow: paramYellow,
		green: paramGreen,
		purple: paramPurple,
		orange: paramOrange,
	};
	if (pool) {
		setData(data, function (err, result) {
			// 클라이언트로 에러 전송
			if (err) {
				console.error('데이터 수정 중 에러 발생 : ' + err.stack);
				res.end();
				return;
			}
			// 결과 객체 있으면 성공 응답 전송
			if (result) {
				console.dir(result);
				res.end(JSON.stringify(result));
			} else {
				console.error('데이터 수정 중 에러 발생 : ' + err.stack);
				res.end();
			}
		});
	} else {
		// 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.error('pool 객체가 생성되지 않았습니다. : ' + err.stack);
		res.end();
	}
});
//채트데이터를 등록하는 함수
var setData = function (data, callback) {
	console.dir(data);//배열객체 값을 출력
	console.log("setData 호출됨: 배열객체 값은 %j", data);
	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function (err, conn) {
		if (err) {
			if (conn) {
				conn.release(); // 반드시 해제해야 함
			}
			callback(err, null);
			return;
		}
		console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
		// SQL 문을 실행함 UPDATE [테이블] SET [열] = '변경할값' WHERE [조건]
		//var sql= 'UPDATE tbl_chart SET red=?, blue=?, yellow=?, green=?, purple=?, orange=? WHERE 1=1';
		var exec = conn.query('update tbl_chart set ? where 1 = 1', [data], function (err, result) {
			conn.release(); // 반드시 해제해야 함
			console.log('실행 대상 SQL : ' + exec.sql);
			if (err) {
				console.log('SQL 실행 시 에러 발생함.');
				console.dir(err);
				callback(err, null);
				return;
			}
			console.log(result);
			callback(null, result);
		});
		conn.on('error', function (err) {
			console.log('데이터베이스 연결 시 에러 발생함.');
			console.dir(err);
			callback(err, null);
		});
	});
};

// 챠트 데이터 가져오기 라우팅 함수
router.route('/chart/getdata').get(function (req, res) {
	console.log('/chart/getdata 호출됨.');
	// pool 객체가 초기화된 경우, allData 함수 호출하여 기존데이터 가져오기
	if (pool) {
		allData(function (err, result) {
			// 클라이언트로 에러 전송
			if (err) {
				console.error('데이터 조회 중 에러 발생 : ' + err.stack);
				res.end();
				return;
			}
			// 결과 객체 있으면 성공 응답 전송
			if (result) {
				console.dir(result);
				res.end(JSON.stringify(result));
			} else {
				console.error('데이터 조회 중 에러 발생 : ' + err.stack);
				res.end();
			}
		});
	} else {
		// 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.error('pool 객체가 생성되지 않았습니다. : ' + err.stack);
		res.end();
	}
});
// 챠트 데이터 함수
var allData = function (callback) {
	console.log('allData 호출됨 : ');
	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function (err, conn) {
		if (err) {
			if (conn) {
				conn.release(); // 반드시 해제해야 함
			}
			callback(err, null);
			return;
		}
		console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
		var columns = ['red', 'blue', 'yellow', 'green', 'purple', 'orange'];
		var tablename = 'tbl_chart';
		// SQL 문을 실행합니다.
		var exec = conn.query('select ?? from ??', [columns, tablename], function (err, rows) {
			conn.release(); // 반드시 해제해야 함
			console.log('실행 대상 SQL : ' + exec.sql);
			if (rows.length > 0) {
				console.log('챠트 데이터 있음.');
				callback(null, rows);
			} else {
				console.log('챠트 데이터 없음.');
				callback(null, null);
			}
		});
		conn.on('error', function (err) {
			console.log('데이터베이스 연결 시 에러 발생함.');
			console.dir(err);
			callback(err, null);
		});
	});
};

module.exports = router;