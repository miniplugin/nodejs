import { Link } from "react-router-dom";

function Login(props) {
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
							<input type="button" onClick={props.onSubmit} value="로그인"/>
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