import logo from './logo.svg';
import './App.css';
import { useState } from "react";
import Chart from './Chart';//Chart.js 생략

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
  //countUp 함수를 람다식으로 변경(아래)
  var countUp = () => {
	  setCounter(counter + 1);
	  console.log("람다식사용" + counter);
	  //데이터 객체 연습(아래)
	  const [a,b,c,d] = ["one", "two", 3, 4];// 익명 객체에는 데이터를 바로 입력가능. 단, 상수는 선언과 동시에 값(리터럴)을 등록해야 한다.
	  console.log(b,c);
	  var jsonData = {red:12,blue:19,yellow:3,green:5,purple:2,orange:3};//초기 json 데이터객체 생성
	  var {red, blue, yellow, green, purple, orange} = jsonData;//객체의 분배할당 이라고 한다.
	  console.log(jsonData.red, red); //객체의 red와 분배 할당된 red는 같은 값을 가진다.
  }
  return (
    <div className="App">
    	<span>오늘 일자 : {nowDate}</span>
    	<h1>{counter}</h1>
		  {/* <button onClick={countUp}>투표하기</button> */}
		    <Chart text="투표하기" onClick={countUp} />
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
