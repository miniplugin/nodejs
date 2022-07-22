/**
 * 데이터베이스 컬렉션 스키마를 정의하는 모듈
 */

var Schema = {};

Schema.createSchema = function(mongoose) { // createSchema 함수 생성 몽구스 모듈을 매개변수로 사용
	
	// 스키마 정의
	UserSchema = mongoose.Schema({
	    id: {type: String, required: true, unique: true, 'default':''}, // unique는 B-tree 인덱스 사용 : 영역 검색시 2등분의 중간값과 비교
	    name: {type: String, index: 'hashed', 'default':''}, // hash 인덱스사용 : 해싱으로 분할된 영역에서 검색 시 해싱함수로 검색에 포함된 번호값을 비교
	    age: {type: Number, 'default': -1},
		password: {type: String, required: true, 'default':''},
	    created_at: {type: Date, index: {unique: false}, 'default': Date.now}, //입력 일시는 전송값이 없더라도 default 값으로 현재 일시가 저장된다.
	    updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
	});
	return UserSchema;
}
// module.exports로 외부에서 Schema.createSchema 함수를 사용가능하다.
module.exports = Schema;