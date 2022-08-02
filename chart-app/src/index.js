import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login';

const root = ReactDOM.createRoot(document.getElementById('root'));

var submit = () => {
	alert('로그인 액션');
	var url = 'https://nodejs-jvbqr.run.goorm.io/users/api/login';
	fetch (url, {method:'post', body: JSON.stringify({ id: 'admin', password: '1234'}), headers: new Headers({ 'Content-Type': 'application/json' })})
		.then (response => response.json()) //응답데이터를 json 형태로 변환
		//.then (response => console.log(response))
		.then (response => {
			if (response.length > 0) {
				sessionStorage.setItem('logined', true);
				sessionStorage.setItem('login_id', 'admin');
				alert("로그인 되었습니다.");location.replace("/chart");
			}
		})
		.catch (() => console.log ('에러: ' + url + '에 접속할 수 없습니다.'));
}

root.render(
	<BrowserRouter>
		<Routes>
		  <Route path="chart" element={<App />} />
		  <Route path="chart/login" element={<Login onClick={submit} />} />
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
