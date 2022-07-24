/**
 * DB 커넥션 후 데이터베이스 스키마 로딩 + 더미 데이터 입력
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto'); //노드js 에서 sha1() 암호화함수 사용하기

var mongoose = require('mongoose');// 옹구스는 Node.js와 MongoDB를 연결해주는 ODM(Object Document Mapping) : js객체와 DB데이터를 1대1로 매칭하는 역할
var config = require('./xmongo_config');// 몽고DB설정 모듈 파일 로딩
var database = {};// database 객체에 db, schema, model 모두 추가
// 데이터베이스 연결 : config의 설정 사용
mongoose.connect(config.db_url);
database.db = mongoose.connection;

database.db.on('error', console.error.bind(console, 'mongoose connection error.'));

database.db.on('open', function () {
	console.log('몽고DB에 연결되었습니다. : ' + config.db_url);
	// config에 등록된 스키마 및 모델 객체 생성
	var usersSchema = require(config.db_schemas[0].file).createSchema(mongoose);// 모듈 파일 불러온 후 createSchema() 함수 호출하기
	console.log('[%s] 모듈을 불러들인 후 스키마 정의함.', config.db_schemas[0].file);
	var usersModel = mongoose.model(config.db_schemas[0].collection, usersSchema);// users 컬렉션 모델 정의
	console.log('[%s] 컬렉션을 위해 모델 정의함.', config.db_schemas[0].collection);
	// database 객체에 속성으로 추가
	database[config.db_schemas[0].schemaName] = usersSchema;//String 에서 객체로 변경됨
	database[config.db_schemas[0].modelName] = usersModel;//String 에서 객체로 변경됨
	console.log('스키마 이름 [%s], 모델 이름 [%s] 이 database 객체의 속성으로 추가됨.', config.db_schemas[0].schemaName, config.db_schemas[0].modelName);
	
	/* 더미 데이터 코딩 시작 */
	var password = crypto.createHash("sha1").update("1234").digest("hex");
	var dummyUsers = [
		{
			id: "admin",
			name: "관리자",
			age: 0,
			password: password
		}
	];
	for(var i=1;i<=99;i++) {
		dummyUsers.push({id: "user"+i, name: "사용자"+i, age: i, password: password}); //dummyUsers끝에 해당 요소 추가 
	}
	/* 참고: 몽구스에서 사용하는 함수 기본 형식 */
	query = { "id":"admin" },
	update = {
		"$set": {"age":0} 
	},
	options = { "multi": true };
    database.UserModel.updateOne(query, update, options, function (err) {
        if (err) {
			console.error(err);
			return;
		}
    });	
	
	// 배열 내용을 forEach 반복구문으로 구하기
	dummyUsers.forEach(function(item){ //,index,arr2
		console.log(item["id"]);
		database.UserModel.find({"id":item["id"]}, function(err, results) {
			if (err) {
				console.log(err);
				return;
			}
			if (results.length > 0) {
				console.log('아이디와 일치하는 사용자 찾음.');
			}else{
				var users = new database.UserModel(item);// UserModel 인스턴스 생성
				// save()로 저장
				users.save(function(err) {
					if (err) {
						console.log(err);
						return;
					}
					console.log("사용자 데이터 추가함.");
				});
			}
		});
	});
});
database.db.on('disconnected', function() {
	mongoose.connect(config.db_url);
	database.db = mongoose.connection;
});

// 리스트사용자페이지
router.route('/listuser').get(async function(req,res){ 
	//async 로 실행하면 Promise 반환 결과를 약속하게 된다. 즉, await 로 반환값을 약속 받을 수 있다. 실행 순서가 중요할 때 사용.
    console.log('/xmongo_users/listuser 호출됨');
	var keyword = req.query.keyword || ''; //현재 검색어가 없으면 기본값''
	var page = req.query.page || 1; //현재 페이지 없으면 기본값 1
	var perPage = 5; //1페이지당 보여줄 개수
	var totalPage = 0;//전체 페이지 초기값
	var totalCnt = 0;//전회 회원 수 초기값
	//아래 3개는 하단 페이지내비 때문에 추가
	var perPageNavi = 10; //하단 페이지네비 개수
	var startPage = ((page-1)/perPageNavi)*perPageNavi+1;//하단 페이지네비의 시작 페이지
	var endPage = startPage + perPageNavi -1;//하단 페이지네비의 끝 페이지
    //if(req.session.login_id != 'admin') {
    //    res.send('<script>alert("관리자만 접근 가능합니다.");window.location="/"</script>');
    //}
    if(database.db) {
		query = {id: { $regex: '.*'+keyword+'.*' }},
		project = {},
		options = { sort:{age: 1}, skip:(page-1)*perPage, limit:perPage };
		//db.users.find({id: { $regex: '.*user.*' } }).sort({age:1}).skip(0).limit(5); //Compass 에서 사용하는 함수
		//database.UserModel.find({id: { $regex: '.*'+keyword+'.*' } }).count().exec(function(err,rows2){
		await database.UserModel.find(query,project).count().exec(function(err,rows2){
			totalCnt = rows2;
			console.log('사용자 전체 개수1: ' + rows2);
		});
		//database.UserModel.find({id: { $regex: '.*'+keyword+'.*' } }).sort({age:1}).skip((page-1)*perPage).limit(perPage).exec(function(err, rows) {
		database.UserModel.find(query,project,options, function(err, rows) {
			if(err) {
				res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 조회 함수 실패.</h2>');
				res.write('<p>' + err.stack + '</p>');
				res.end();
			}
			console.log('사용자 전체 개수2: ' + totalCnt);
			totalPage = Math.ceil(totalCnt/perPage);//Math.ceil(올림),Math.floor(내림),Math.round(반올림)
			if(endPage > totalPage) {
				endPage = totalPage;
			}
			if(rows.length > 0) {
				console.log('사용자 리스트 있음 %j', rows);
				res.render('xmongo_users/listuser', {userList:rows, totalPage:totalPage, currentPage:page, perPage:perPage, perPageNavi:perPageNavi, startPage:startPage,endPage:endPage,totalCnt:totalCnt,keyword:keyword});
			}else{
				console.log('사용자 리스트 없음.');
				res.render('xmongo_users/listuser', {userList:rows, totalPage:totalPage, currentPage:page, perPage:perPage, perPageNavi:perPageNavi, startPage:startPage,endPage:endPage,totalCnt:totalCnt,keyword:keyword});
			}
	  });
    }else{
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패.</h2>');
        res.end();
    }
});

module.exports = router;