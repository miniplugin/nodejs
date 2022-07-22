/**
 * DB 커넥션 후 데이터베이스 스키마 로딩 + 더미 데이터 입력
 */

module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost/local',
	db_schemas: [
	    {file:'./xmongo_collections', collection:'users', schemaName:'UserSchema', modelName:'UserModel'}
	]
}