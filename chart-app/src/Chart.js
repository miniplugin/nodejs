import { Link } from "react-router-dom";
import { useEffect } from 'react';

function Chart2(props) { //{text,onClick} 으로 사용가능
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
	fetch (url, {method:'post', body: JSON.stringify({ selectColor: selectColor, login_id: props.login_id}), headers: new Headers({ 'Content-Type': 'application/json' })})
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
	//alert(props.login_id);
	if (confirm('정말로 초기화 하시겠습니까, 투표한 DB자료가 삭제됩니다.')) {
	var url = 'https://nodejs-jvbqr.run.goorm.io/chart/api/deldata';
	fetch (url, {method:'post', body: JSON.stringify({login_id: props.login_id}), headers: new Headers({ 'Content-Type': 'application/json' })})
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
		<div>
			<canvas id="myChart" width="400" height="400"></canvas>
			<select id="selVote">
				<option value="red">Red</option>
				<option value="blue">Blue</option>
				<option value="yellow">Yellow</option>
				<option value="green">Green</option>
				<option value="purple">Purple</option>
				<option value="orange">Orange</option>
			</select>
			{
				props.logined==null
				? (
					null
				):(
					<span>
					<button id="btnVote" onClick={onVote}>투표하기</button>
					<button id="btnVoteDel" onClick={onDelete}>초기화하기</button>
					</span>
				)
			}
			<Link to="/chart"><button id="btnHome">홈페이지로이동</button></Link>
			{
				props.logined==null
				?<Link to="/chart/login"><button id="btnHome">API로그인</button></Link>
				:<button onClick={props.onLogout}>API로그아웃</button>
			}
			<Link to="/chart/kakaomap"><button id="btnHome">카카오 맵</button></Link>
		</div>
	);
	/*
		<span>
		<select id="selVote" onChange={props.onChange} value={props.selectVal}>
			<option value="red">Red</option>
			<option value="blue">Blue</option>
			<option value="yellow">Yellow</option>
			<option value="green">Green</option>
			<option value="purple">Purple</option>
			<option value="orange">Orange</option>
		</select>
		<input type="text" onChange={props.onChange} value={props.selectVal} />
		<button onClick={props.onClick}>{props.text}</button>
		</span>
	*/
	//return <button onClick={onClick}>{text}</button>
}

export default Chart2; //현재 컴포넌트를 외부에서 사용가능하게 처리