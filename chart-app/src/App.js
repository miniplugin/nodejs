import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
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
	  setCounter(counter + 1);//화면처리
	  counter = counter + 1;//js 처리를 하지 않으면,아래 처럼 화면의 counter는 5인데, js프로그램의 콘솔에서 4로 나온다.
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
   
  return (
    <div className="App">
		{/*
    	<span>오늘 일자 : {nowDate}</span>
    	<h1 style={colorStyle}>{counter}</h1>  인라인 스타일 style={{background:selectVal}} */}
		  {/* <button onClick={countUp}>투표하기</button> */}
		    <Chart2 text="투표하기" onClick={countUp} onChange={onChange} selectVal={selectVal} logined={logined} login_id={login_id} onLogout={onLogout} />
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
