import { useEffect } from "react";
import { Link } from "react-router-dom";

function KakaoMap(props) {
	useEffect(() => { //화면에 변화가 있는지 확인 후 실행할 때(=화면이 html객체모두 로딩 후) useEffect 함수를 사용한다.
		var url = 'https://nodejs-jvbqr.run.goorm.io/openapi/getdata';
		fetch (url, {method:'get'})
			.then (response => response.json()) //응답데이터를 json 형태로 변환
			.then (contents => { //json으로 변환된 응답데이터인 contents 를 가지고 구현하는 내용
				var positions = [];//배열 선언
				var jsonData;
				jsonData=contents['response']['body']['items'];
				jsonData['item'].forEach((element) => {//람다식 사용 function(element) {}
					positions.push(
					  {
						content: "<div>"+element["csNm"]['_text']+"</div>",//충전소 이름
						latlng: new kakao.maps.LatLng(element["lat"]['_text'], element["longi"]['_text']) // 위도(latitude), 경도longitude)
					  }
					);
				});
				var index = parseInt(positions.length/2);//배열은 인덱스순서 값을 필수로 가지고, 여기서는 반환 값의 개수로 구한다.
				console.log(jsonData["item"][index]["lat"]['_text']);
				//console.log(jsonData);
				var mapContainer = document.getElementById('map'), // 지도를 표시할 div  
					mapOption = { 
						center: new kakao.maps.LatLng(jsonData["item"][index]["lat"]['_text'], jsonData["item"][index]["longi"]['_text']),
						//center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
						level: 10 // 지도의 확대 레벨
					};

				var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
				
				// 마커를 표시할 위치와 내용을 가지고 있는 객체 배열입니다 
				/*var positions = [
					{
						content: '<div>카카오</div>', 
						latlng: new kakao.maps.LatLng(33.450705, 126.570677)
					},
					{
						content: '<div>생태연못</div>', 
						latlng: new kakao.maps.LatLng(33.450936, 126.569477)
					},
					{
						content: '<div>텃밭</div>', 
						latlng: new kakao.maps.LatLng(33.450879, 126.569940)
					},
					{
						content: '<div>근린공원</div>',
						latlng: new kakao.maps.LatLng(33.451393, 126.570738)
					}
				];*/

				for (var i = 0; i < positions.length; i ++) {
					// 마커를 생성합니다
					var marker = new kakao.maps.Marker({
						map: map, // 마커를 표시할 지도
						position: positions[i].latlng // 마커의 위치
					});

					// 마커에 표시할 인포윈도우를 생성합니다 
					var infowindow = new kakao.maps.InfoWindow({
						content: positions[i].content // 인포윈도우에 표시할 내용
					});

					// 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
					// 이벤트 리스너로는 클로저를 만들어 등록합니다 
					// for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
					kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
					kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
				}
				// 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
				function makeOverListener(map, marker, infowindow) {
					return function() {
						infowindow.open(map, marker);
					};
				}

				// 인포윈도우를 닫는 클로저를 만드는 함수입니다 
				function makeOutListener(infowindow) {
					return function() {
						infowindow.close();
					};
				}
			})
			.catch ((err) => console.log ('에러: ' + err + '때문에 접속할 수 없습니다.'));
	  }, []);
	return (
		<div>
			<h2>전기차 충전소 위치</h2>
			<Link to="/chart"><button id="btnHome">리액트 홈</button></Link>
			<div id="map" style={{width:"100%",height:"350px"}}></div>
		</div>
	);
}

export default KakaoMap;