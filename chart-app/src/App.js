import logo from './logo.svg';
import './App.css';
import { useState } from "react";

function App() {
  var date = new Date();
  var nowDate = date.toLocaleDateString();
  //var counter = 0;
  var [counter, setCounter] = useState(0);//함수내에서 state 상태 변수선언. 클래스에서는 생성자함수에서 this.state(뱐화값) = this.props(이전값) 처럼 사용
  var countUp = function() {
      //counter = counter + 1;//렌더링 화면과 처리 데이터가 연동이 되지 않는다.
      setCounter(counter + 1);//상태값으로 렌더링 화면과 처리 데이터가 연동 된다. setCounter = counter(this.props) + 1;
      console.log(counter);
  };
  return (
    <div className="App">
    	<span>오늘 일자 : {nowDate}</span>
    	<h1>{counter}</h1>
      		<button onClick={countUp}>투표하기</button>
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
