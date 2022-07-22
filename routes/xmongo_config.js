/**
 * DB 접속 정보를 외부의 별도 파일로 분리한다
 */

module.exports = {
	db_url: 'mongodb://localhost/local',
	db_schemas: [
	    {file:'./xmongo_collections', collection:'users', schemaName:'UserSchema', modelName:'UserModel'}
	]
}