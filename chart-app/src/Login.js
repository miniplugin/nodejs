import { Link } from "react-router-dom";

function Login(props) {
	var onLogin = () => {
		var paramId = document.getElementById('id').value;
		var paramPassword = document.getElementById('password').value;
		//alert(paramPassword);
		var url = 'https://nodejs-jvbqr.run.goorm.io/users/api/login';
		fetch (url, {method:'post', body: JSON.stringify({ id: paramId, password: paramPassword}), headers: new Headers({ 'Content-Type': 'application/json' })})
			.then (response => response.json()) //응답데이터를 json 형태로 변환
			//.then (response => console.log(response.success))
			.then (response => {
				if (response.data > 0) {
					sessionStorage.setItem('logined', true);
					sessionStorage.setItem('login_id', paramId);
					alert("로그인 되었습니다.");
					document.location.href = '/chart'; //리액트에서 표준이다. 다음 처럼 사용은 권장 안함.location.replace("/chart")
				}else{
					alert("로그인 실패 다시 로그인 해 주세요.");
				}
			})
			.catch ((err) => console.log ('에러: ' + err + '때문에 접속할 수 없습니다.'));
	}
	return (
		<div>
			<h1>사용자 로그인</h1>
			<br/>
			<form method="post" action="/users/login">
				<table><tbody>
					<tr>
						<td>아이디</td>
						<td><input type="text" id="id" required/></td>
					</tr>
					<tr>
						<td>암호</td>
						<td><input type="password" id="password" required/></td>
					</tr>
					<tr>
						<td colSpan="2">
							<input type="button" onClick={onLogin} value="로그인"/>
							{/*<input type="button" value="리스트"/>*/}
							<Link to="/chart"><input type="button" value="홈으로"/></Link>
						</td>
					</tr>
				</tbody></table>
			</form>
		</div>
	);
}

export default Login;