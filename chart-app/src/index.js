import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login';
import KakaoMap from './KakaoMap';

const root = ReactDOM.createRoot(document.getElementById('root'));
/*
var [loginId, setLoginId] = useState();
var [password, setPassword] = useState();
var onChange = (e) => {
	setLoginId(e.target.value);
}
*/

root.render(
	<BrowserRouter>
		<Routes>
		  <Route path="chart" element={<App />} />
		  <Route path="chart/login" element={<Login />} />
		  <Route path="chart/kakaomap" element={<KakaoMap />} />
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
