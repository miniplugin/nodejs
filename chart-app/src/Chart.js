function Chart(props) { //{text,onClick} 으로 사용가능
	return (
		<span>
		<select id="selVote">
			<option value="red">Red</option>
			<option value="blue">Blue</option>
			<option value="yellow">Yellow</option>
			<option value="green">Green</option>
			<option value="purple">Purple</option>
			<option value="orange">Orange</option>
		</select>
		<button onClick={props.onClick}>{props.text}</button>
		</span>
	);
	//return <button onClick={onClick}>{text}</button>
}

export default Chart; //현재 컴포넌트를 외부에서 사용가능하게 처리