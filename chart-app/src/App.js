import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Chart2 from './Chart';//Chart.js 생략

function App() {
  var date = new Date();
  var nowDate = date.toLocaleDateString();
  //var counter = 0;
  var [counter, setCounter] = useState(0);//함수내에서 state 상태 변수선언. 클래스에서는 생성자함수에서 this.state(뱐화값) = this.props(이전값) 처럼 사용
  /*
  var countUp = function() {
      //counter = counter + 1;//렌더링 화면과 처리 데이터가 연동이 되지 않는다.
      setCounter(counter + 1);//상태값으로 렌더링 화면과 처리 데이터가 연동 된다. setCounter = counter(this.props) + 1;
      console.log(counter);
  };
  */
  var [selectVal, setSelect] = useState('red');
  var [colorStyle, setColorStyle] = useState();
  //var chartData = {"red":12,"blue":19,"yellow":3,"green":5,"purple":2,"orange":3};
  //var [chartData, setChartData] = useState({"red":12,"blue":19,"yellow":3,"green":5,"purple":2,"orange":3});
  var onChange = (e) => setSelect(e.target.value);
  //countUp 함수를 람다식으로 변경(아래)
  var countUp = () => {
	  setCounter(counter + 1);
	  console.log("람다식사용" + counter + ", 선택한 색상", selectVal);
	  setColorStyle({background:selectVal,opacity:0.5});
	  //데이터 객체 연습(아래)
	  const [a,b,c,d] = ["one", "two", 3, 4];// 익명 객체에는 데이터를 바로 입력가능. 단, 상수는 선언과 동시에 값(리터럴)을 등록해야 한다.
	  console.log(b,c);
	  var jsonData = {red:12,blue:19,yellow:3,green:5,purple:2,orange:3};//초기 json 데이터객체 생성
	  var {red, blue, yellow, green, purple, orange} = jsonData;//객체의 분배할당 이라고 한다.
	  console.log(jsonData.red, red); //객체의 red와 분배 할당된 red는 같은 값을 가진다.
  }
  
  var onLogout = () => {
	  sessionStorage.removeItem('logined');
	  sessionStorage.removeItem('login_id');
	  //sessionStorage.clear();
	  //서버 로그아웃 기능은 다음 시간에..
      // App 으로 이동(새로고침)
      document.location.href = '/chart'; //리액트에서 표준이다. 다음 처럼 사용은 권장 안함.location.replace("/chart")
  }
  var logined = sessionStorage.getItem('logined');
  var login_id = sessionStorage.getItem('login_id');
  console.log(login_id);
  var myChart;
  var updateRender = () => {
	   var url = 'https://nodejs-jvbqr.run.goorm.io/chart/getdata';
		fetch (url, {method:'get'})
			.then (response => response.json()) //응답데이터를 json 형태로 변환
			.then (contents => { //json으로 변환된 응답데이터인 contents 를 가지고 구현하는 내용
				var jsonData=contents[0];
				myChart.data.datasets[0].data = jsonData;//결과적으로 json데이터를 만들어야함.
			    myChart.update();
		})
			.catch ((err) => console.log ('에러: ' + err + '에 접속할 수 없습니다.'));
  }
  var onVote = () => {
	var selectVote = document.getElementById('selVote');
	var selectColor = selectVote.options[selectVote.selectedIndex].value;
	//alert(selectColor + login_id);
	var url = 'https://nodejs-jvbqr.run.goorm.io/chart/api/setdata';
	fetch (url, {method:'post', body: JSON.stringify({ selectColor: selectColor, login_id: login_id}), headers: new Headers({ 'Content-Type': 'application/json' })})
		.then (response => response.json()) //응답데이터를 json 형태로 변환
		//.then (response => console.log(response.data.affectedRows))//디버그용
		.then (response => {
			if (response.data.affectedRows > 0) {
				alert("저장 되었습니다.");
				updateRender();
				socket.emit("OnOff", {msg:'updateRender'});//1:1통신 노드js로 문자를 OnOff 에 담아서 보냄.
				//location.replace("/chart"); 화면 리플레시 대신에 챠트만 업데이트 되게 처리
			}else{
				alert("저장 실패. 서버 관리지에 문의 하세요");
			}
		})
		.catch ((err) => console.log ('에러: ' + err + '때문에 접속할 수 없습니다.'));
  }
  var onDelete = () => {
	//alert(login_id);
	if (confirm('정말로 초기화 하시겠습니까, 투표한 DB자료가 삭제됩니다.')) {
	var url = 'https://nodejs-jvbqr.run.goorm.io/chart/api/deldata';
	fetch (url, {method:'post', body: JSON.stringify({login_id: login_id}), headers: new Headers({ 'Content-Type': 'application/json' })})
		.then (response => response.json()) //응답데이터를 json 형태로 변환
		//.then (response => console.log(response))//디버그용
		.then (response => {
			if (response.data.affectedRows > 0) {
				alert("삭제 되었습니다.");
				updateRender();
				socket.emit("OnOff", {msg:'updateRender'});//1:1통신 노드js로 문자를 OnOff 에 담아서 보냄.
			}else{
				alert("삭제 실패. 서버 관리지에 문의 하세요");
			}
		})
		.catch ((err) => console.log ('에러: ' + err + '때문에 접속할 수 없습니다.'));
	}
  }
  useEffect( () => { //화면에 변화가 있는지 확인 후 실행할 때(=화면이 html객체모두 로딩 후) useEffect 함수를 사용한다.
	  socket.on('OnOff', function(jsonMsg){
			//msg = JSON.stringify(jsonMsg);//json데이터를 스트링데이터로 변경
			console.log(socket.id+"가 받은 메세지는 "+jsonMsg.msg);
			if(jsonMsg.msg=="updateRender") {
				  updateRender();
			}
	  });
	   var url = 'https://nodejs-jvbqr.run.goorm.io/chart/getdata';
		fetch (url, {method:'get'})
			.then (response => response.json()) //응답데이터를 json 형태로 변환
			.then (contents => { //json으로 변환된 응답데이터인 contents 를 가지고 구현하는 내용
				var jsonData=contents[0]; 
				console.log ('JSON--------------: ', jsonData);
				//console.log('세션-------------: ', session.login_id);
				//var btnVote = document.getElementById('btnVote');//투표하기 버튼객체 생성
				//var selVote = document.getElementById('selVote');//좋아하는색성 선택객체 생성
				//var jsonData = {"red":12,"blue":19,"yellow":3,"green":5,"purple":2,"orange":3};//초기 json 데이터객체 생성
				//var jsonData = [12, 19, 3, 5, 2, 3];//참조: 자바스크립트의 배열구조
				var ctx = document.getElementById('myChart').getContext('2d');//막대그래프 출력영역 객체 생성

				//myChart 시작
				var datasets_line_bar = [{ //데이터내용 배열 객체 생성
					label: '본인이 좋아하는 색상 설문조사',
					data: jsonData,
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(153, 102, 255, 0.2)',
						'rgba(255, 159, 64, 0.2)'
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 159, 64, 1)'
					],
					borderWidth: 1
				}];
				var options_line_bar = { //데이터 출력옵션 객체
						scales: {
							y: {
								beginAtZero: true
							}
						}
					};
				//myChart 객체 생성(아래)  : 여기서 ctx 영역에 Chart 데이터 객체가 출력된다.
				myChart = new Chart(ctx, {
					type: 'bar',//radar, doughnut, pie, polar, bubble, scatter, area 챠트종류 선택
					data: {
						labels: [],
						datasets: datasets_line_bar
					},
					options: options_line_bar
				});
			})
			.catch ((err) => console.log ('에러: ' + err + '때문에 접속할 수 없습니다.'));
	  		//myChart.destroy();
  }, []);//마지막 [] 배열 값은 변경 기준 상태 값으로 디자인을 재생할 때 사용한다. 지정하지 않으면, 최초 1회만 실행 된다.
  return (
    <div className="App">
		{/*
    	<span>오늘 일자 : {nowDate}</span>
    	<h1 style={colorStyle}>{counter}</h1>  인라인 스타일 style={{background:selectVal}} */}
		  {/* <button onClick={countUp}>투표하기</button> */}
		    <Chart2 text="투표하기" onDelete={onDelete} onVote={onVote} onClick={countUp} onChange={onChange} selectVal={selectVal} logined={logined} onLogout={onLogout} />
    {/*
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          리액트JS 더보기
        </a>
      </header>
     */}
    </div>
  );
}

export default App;
