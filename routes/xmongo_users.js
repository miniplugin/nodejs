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
	var usersSchema = require(config.db_schemas[0].file).createSchema(mongoose);// 모듈 파일에서 모듈 불러온 후 createSchema() 함수 호출하기
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
	// UserModel 인스턴스 생성
	dummyUsers.forEach(function(item){ //,index,arr2
		console.log(item["id"]);
		database.UserModel.find({"id":item["id"]}, function(err, results) {
			if (err) {
				console.log(err);
				return;
			}
			if (results.length > 0) {
				console.log('아이디와 일치하는 사용자 찾음.');
				database.UserModel.updateOne({"id":"admin"}, {$set:{"age":0}});
				database.UserModel.updateOne({"id":"user1"}, {$set:{"age":1}});
				database.UserModel.updateOne({"id":"user2"}, {$set:{"age":2}});
			}else{
				var users = new database.UserModel(item);
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

module.exports = router;