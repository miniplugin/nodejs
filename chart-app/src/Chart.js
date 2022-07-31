function Chart(props) { //{text,onClick} 으로 사용가능
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
			<button id="btnVote">투표하기</button>
			<button id="btnVoteDel">초기화하기</button>
			<button id="btnHome">홈페이지로이동</button>
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

export default Chart; //현재 컴포넌트를 외부에서 사용가능하게 처리