import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login';

const root = ReactDOM.createRoot(document.getElementById('root'));
/*
var [loginId, setLoginId] = useState();
var [password, setPassword] = useState();
var onChange = (e) => {
	setLoginId(e.target.value);
}
*/
var onSubmit = () => {
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
				alert("로그인 되었습니다.");location.replace("/chart");
			}else{
				alert("로그인 실패 다시 로그인 해 주세요.");
			}
		})
		.catch ((err) => console.log ('에러: ' + err + '때문에 접속할 수 없습니다.'));
}

root.render(
	<BrowserRouter>
		<Routes>
		  <Route path="chart" element={<App />} />
		  <Route path="chart/login" element={<Login onSubmit={onSubmit} />} />
		</Routes>
    </BrowserRouter>
	//<React.StrictMode>
    //<App />
	//</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
