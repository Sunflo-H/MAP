const HISTORY_LIST_MAX_LENGTH = 5;
const RADIUS = {
    LV1: 5000,
    LV2: 10000,
    LV3: 15000,
    LV4: 20000
}
const SEARCH_DATA_LENGTH = 10;

const currentLocationName = document.querySelector('.current-location');
const searchInput = document.querySelector('.search-bar input[type=text]');
const searchBar = document.querySelector('.search-bar');
const body = document.querySelector('body');
const searchIcon = document.querySelector('.fa-search');
const relationAndHistoryContainer = document.querySelector('.relationAndHistory-container');
const historyContainer = document.querySelector('.history-container');
const relationContainer = document.querySelector('.relation-container');
const categories = document.querySelectorAll('.category');
const categoryCircles = document.querySelectorAll('.category-circle');
const aroundTitle = document.querySelector('.around-title > span');

let map;
let historyList = [];
let marker;
let numberMarkerList = [];
let overlay;
let searchbarIsOpen = false;
let polylineList = [];

// var marker_s, marker_e, marker_p1, marker_p2;
// var totalMarkerArr = [];
// var drawInfoArr = [];
// var resultdrawArr = [];

// $.ajax({
//     method: "POST",
//     url: "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
//     async: false,
//     data: {
//         "appKey": "l7xx68845a4aa2724d0ebbead38642364a0f",
//         "startX": "127.090688",
//         "startY": "37.552128",
//         "endX": "127.08534387836",
//         "endY": "37.5453966002957",
//         "reqCoordType": "WGS84GEO",
//         "resCoordType": "EPSG3857",
//         "startName": "출발지",
//         "endName": "도착지"
//     },
//     success: function (response) {
//         var resultData = response.features;
//         console.log(resultData);

//         //결과 출력
//         var tDistance = "총 거리 : "
//             + ((resultData[0].properties.totalDistance) / 1000)
//                 .toFixed(1) + "km,";
//         var tTime = " 총 시간 : "
//             + ((resultData[0].properties.totalTime) / 60)
//                 .toFixed(0) + "분";

//         $("#result").text(tDistance + tTime);

//         //기존 그려진 라인 & 마커가 있다면 초기화
//         if (resultdrawArr.length > 0) {
//             for (var i in resultdrawArr) {
//                 resultdrawArr[i]
//                     .setMap(null);
//             }
//             resultdrawArr = [];
//         }

//         drawInfoArr = [];

//         for (var i in resultData) { //for문 [S]
//             var geometry = resultData[i].geometry;
//             var properties = resultData[i].properties;
//             var polyline_;


//             if (geometry.type == "LineString") { // 길
//                 for (var j in geometry.coordinates) {
//                     // console.log(geometry);
//                     // console.log(properties);
//                     // 경로들의 결과값(구간)들을 포인트 객체로 변환 
//                     // 스크린 좌표값을 x, y 객체 형태로 변환하는 거구나.
//                     // coordinates = [1111, 2222] => {x: 1111, y: 2222} 이런 형태로 변환
//                     var latlng = new Tmapv2.Point(
//                         geometry.coordinates[j][0],
//                         geometry.coordinates[j][1]);
//                     // console.log(latlng);
//                     // 포인트 객체를 받아 좌표값으로 변환 
//                     // "Projection" 은 '둥근 지구를 평면으로 전개'
//                     // 즉 위도 경도의 좌표를 평면지도상의 좌표로 변환한다.
//                     // convertEPSG3857ToWGS84GEO 이거는 어떤 규칙의 좌표로 할것인지 설정하는 함수, 지금 사용하는거는 지도에서 일반적으로 사용하는 규칙
//                     // {x: 1111, y: 2222} => {_lat: 37.123, _lng: 127.123} 이런 형태로 변환
//                     var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
//                         latlng);
//                     // console.log(convertPoint);
//                     // 포인트객체의 정보로 좌표값 변환 객체로 저장
//                     // {_lat: 37.123, _lng: 127.123} 여기서 바뀌는건 없는듯한데 무슨 코드지?
//                     var convertChange = new Tmapv2.LatLng(
//                         convertPoint._lat,
//                         convertPoint._lng);
//                     // console.log(convertChange);

//                     // 배열에 담기
//                     drawInfoArr.push(convertChange);
//                     // console.log(drawInfoArr);
//                 }
//             } else { // 특정 지점
//                 var markerImg = "";
//                 var pType = "";
//                 var size;
//                 console.log(geometry);
//                 console.log(properties);
//                 if (properties.pointType == "S") { //출발지 마커
//                     markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
//                     pType = "S";
//                     size = new Tmapv2.Size(24, 38);
//                 } else if (properties.pointType == "E") { //도착지 마커
//                     markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
//                     pType = "E";
//                     size = new Tmapv2.Size(24, 38);
//                 } else { //각 포인트 마커
//                     markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
//                     pType = "P";
//                     size = new Tmapv2.Size(8, 8);
//                 }

//                 // 경로들의 결과값들을 포인트 객체로 변환 
//                 var latlon = new Tmapv2.Point(
//                     geometry.coordinates[0],
//                     geometry.coordinates[1]);

//                 // 포인트 객체를 받아 좌표값으로 다시 변환
//                 var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
//                     latlon);

//                 var routeInfoObj = {
//                     markerImage: markerImg,
//                     lng: convertPoint._lng,
//                     lat: convertPoint._lat,
//                     pointType: pType
//                 };

//                 // Marker 추가
//                 marker_p = new Tmapv2.Marker(
//                     {
//                         position: new Tmapv2.LatLng(
//                             routeInfoObj.lat,
//                             routeInfoObj.lng),
//                         icon: routeInfoObj.markerImage,
//                         iconSize: size,
//                         map: map
//                     });
//             }
//         }//for문 [E]
//         drawLine(drawInfoArr);
//     },
//     error: function (request, status, error) {
//         console.log("code:" + request.status + "\n"
//             + "message:" + request.responseText + "\n"
//             + "error:" + error);
//     }
// });


// function addComma(num) {
//     var regexp = /\B(?=(\d{3})+(?!\d))/g;
//     return num.toString().replace(regexp, ',');
// }

// function drawLine(arrPoint) {
//     var polyline_;

//     polyline_ = new Tmapv2.Polyline({
//         path: arrPoint,
//         strokeColor: "#DD0000",
//         strokeWeight: 6,
//         map: map
//     });
//     resultdrawArr.push(polyline_); 
//     console.log(resultdrawArr);
// }


function getWeather(lat, lng) {
    console.log("현재 좌표의 날씨정보를 받아옵니다.");
    const weatherContainer = document.querySelector('.weather-container');

    let apiKey = '2bd8aa9e0a77682baadc650722225f4d',
        units = 'metric' // 섭씨 적용
    let weatherData = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=${units}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            let weather;
            let temp = Math.round(data.main.temp * 10) / 10;
            switch (data.weather[0].main) {
                case 'Clouds': weather = '구름'
                case 'Clear': weather = '맑음'; break;
                case 'Rain': weather = '비'; break;
                case 'Thunderstorm': weather = '뇌우'; break;
                case 'Snow': weather = '눈'; break;
                case 'Smoke':
                case 'Haze':
                case 'Fog':
                case 'Dust':
                case 'Sand':
                case 'Ash':
                case 'Mist': weather = '안개'; break;
                case 'Drizzle': weather = '이슬비'; break;
                case 'Squall': weather = '스콜'; break;
                case 'Tornado': weather = '폭풍'; break;
            }

            let result = { weather: weather, temp: temp };

            return result;
        });

    let dustData = fetch(`http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            let result = { fineDust: '', yellowDust: '' };
            let pm2_5 = data.list[0].components.pm2_5; // 초미세먼지 ===> 미세먼지
            let pm10 = data.list[0].components.pm10; // 미세먼지 ===> 황사

            if (0 <= pm2_5 && pm2_5 < 16) result.fineDust = '좋음';
            else if (16 <= pm2_5 && pm2_5 < 36) result.fineDust = '보통';
            else if (36 <= pm2_5 && pm2_5 < 76) result.fineDust = '나쁨';
            else if (76 <= pm2_5) result.fineDust = '매우나쁨';

            if (0 <= pm10 && pm10 < 31) result.yellowDust = '좋음';
            else if (31 <= pm10 && pm10 < 81) result.yellowDust = '보통';
            else if (81 <= pm10 && pm10 < 151) result.yellowDust = '나쁨';
            else if (151 <= pm10) result.yellowDust = '매우나쁨';

            return result;
        });

    Promise.all([weatherData, dustData])
        .then(data => {
            let temp = data[0].temp,
                weather = data[0].weather,
                fineDust = data[1].fineDust,
                yellowDust = data[1].yellowDust;

            weatherContainer.innerHTML = `<span class="weather">${weather}</span>
                                      <span class="temp">${temp}°C</span>
                                      미세<span class="fineDust">${fineDust}</span>
                                      황사<span class="yellowDust">${yellowDust}</span>`
        })
}

function panTo(lat, lng) {
    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(new naver.maps.LatLng(lat, lng));
}


// place data에 distance를 추가하여 반환하는 함수
function addDistanceData(placeList, color = 'none') {
    console.log("거리를 추가합니다.");
    placeList.forEach(place => {
        polyline = new naver.maps.Polyline({
            map: map,
            path: [
                new naver.maps.LatLng(place.y, place.x),
                map.getCenter()
                // 센터말고 다른기준이 필요해
            ],
            strokeWeight: 2,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeStyle: 'dashed'
        });

        polylineList.push(polyline);

        let distance = Math.round(polyline.getLength());
        console.log("거리:", distance.length);
        place.distance = distance;
    })
}

function displaySearchList(placeList) {
    console.log("검색 리스트 보여주기 실행");

    const searchListContainer = document.querySelector('.searchList-container');
    const title = document.createElement('div');
    const ul = document.createElement('ul');

    while (searchListContainer.hasChildNodes()) {
        searchListContainer.removeChild(searchListContainer.firstChild);
    }

    title.classList.add('searchList-title');
    searchListContainer.appendChild(title);
    searchListContainer.appendChild(ul);

    // 검색 리스트 데이터의 이름을 클릭하면 실행되는 이벤트함수
    let placeNameClick = (e) => {
        let place = placeList.find(place => {
            if (place.place_name !== undefined) return place.place_name === e.target.innerText;
            else if (place.address_name !== undefined) return place.address_name === e.target.innerText

        });

        panTo(place.y, place.x); // 장소를 맵의 중앙으로 '부드럽게' 이동한다.
        createNumberOverlay(place); // 장소의 오버레이를 생성한다.
    }

    placeList.forEach((place, i) => {
        let number = i + 1;
        let listElement;

        if (place.place_name === undefined) { // 장소명이 undefined면 주소 검색입니다.
            // 지번으로 검색했다면 지번만, 도로명으로 검색했다면 도로명만 data를 가져온다.
            let addressName = place.address_name;

            if (addressName === undefined) addressName = place.road_address; // 지번인지 도로명인지 체크

            title.innerHTML = `주소<span class="list-count"> ${placeList.length}</span>`

            listElement = `<li>
                            <div class="nameAndAddress onlyAddr">
                                <div class="name"><span class="number">${number}</span><span>${addressName}<span></div>
                            </div> 
                        </li>`
        }
        else {
            let placeName = place.place_name;
            let address = place.address_name;
            let roadAddress = place.road_address_name;
            let distance = place.distance;

            if (distance.length < 4) {
                distance = place.distance + 'm'
            }
            else {
                distance = Math.round(distance / 100) / 10 + 'km'
            }

            title.innerHTML = `장소<span class="list-count"> ${placeList.length}</span>`

            listElement = `<li>
                            <div class="nameAndAddress">
                                <div class="name"><span class="number">${number}</span><span>${placeName}<span></div>
                                <div class="roadName-address">${roadAddress}</div>
                                <div class="region-address">(지번) ${address}</div>
                            </div> 
                            <div class="distance">${distance}</div>
                            </li>`
            // <div class="pathfinder-button"> 길찾기 </div> 
        }
        ul.insertAdjacentHTML('beforeend', listElement);

    })
    const names = document.querySelectorAll('.nameAndAddress .name');

    //장소 이름를 클릭시 상세페이지로 이동
    names.forEach(name => {
        name.addEventListener('click', placeNameClick);
    })
}

function aroundSearch(e) {
    console.log("카테고리를 눌렀습니다. 해당 카테고리로 주변 탐색을 실행합니다.");
    let places = new kakao.maps.services.Places();
    let category = e.currentTarget.parentNode.getAttribute('data-category');
    let lat = map.getCenter()._lat;
    let lng = map.getCenter()._lng;
    let location = new kakao.maps.LatLng(lat, lng);


    // 카테고리 검색 결과를 받을 콜백 함수
    let callback = function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            console.log(result);
            // createMarkerByCoords(lat, lng);
            createNumberMarker(result);
            displaySearchList(result);
            // polylineList.forEach(polyline => polyline.setMap(null));
            // addDistanceData(result, '#FF00FF');
        }
    };
    // 공공기관 코드 검색, 찾은 placeList는 callback으로 전달한다.
    places.categorySearch(category, callback, {
        location: location,
        size: SEARCH_DATA_LENGTH
    });
}

function displayMap(address) {
    
    console.log("현재 위치를 중심으로 맵을 띄웁니다.", address);

    // 주소로 좌표를 찾은 후 결과를 활용하는 함수
    let callback = (status, response) => {
        if (status !== naver.maps.Service.Status.OK) {
            return alert('Something wrong!');
        }
        let jibunAddress = response.v2.addresses[0].jibunAddress, // 지번주소
            roadAddress = response.v2.addresses[0].roadAddress,
            engAddress = response.v2.addresses[0].englishAddress,
            lat = response.v2.addresses[0].y,
            lng = response.v2.addresses[0].x;
        const mapContainer = document.getElementById('map'); // 지도를 표시할 div 
        let mapOption = {
            center : new Tmapv2.LatLng(37.552128,127.090688), // 지도 초기 좌표
            width : "100%", // map의 width 설정
            height : "400px", // map의 height 설정	
            zoom : 17
        };
        map = new Tmapv2.Map(mapContainer, mapOption);
        map.addListener("click", function onClick(event){
                // console.log(event.latLng);
                lat = event.latLng._lat;
                lng = event.latLng._lng;
        });

        // naver.maps.Event.addListener(map, 'click', () => {
        //     numberMarkerList.forEach((marker, i) => {
        //         marker.set('isActive', false);
        //         marker.setIcon({
        //             url: 'assets/img/sp_pins_spot_v3.png',
        //             size: new naver.maps.Size(24, 37),
        //             anchor: new naver.maps.Point(12, 37),
        //             origin: new naver.maps.Point(i * 29, 50)
        //         });
        //     })
        //     removeOverlay();
        // });

        // naver.maps.Event.addListener(map, 'rightclick', (e) => {
        //     createMarkerByCoords(e.coord._lat, e.coord._lng);
        // });
    }

    naver.maps.Service.geocode({ query: address }, callback);
}

// * 마커와 오버레이 관련 함수들
//좌표 정보만으로 마커를 한개만 생성한다. (내 좌표로 마커띄울때, 주변탐색시 중앙좌표에 마커띄울때 사용)
function createMarkerByCoords(lat, lng) {
    removeMarker();
    removeOverlay();
    console.log("좌표로 마커 생성 실행");
    let position = new naver.maps.LatLng(lat, lng);
    marker = new naver.maps.Marker({
        map: map,
        position: position,
    });

    naver.maps.Service.reverseGeocode({
        coords: new naver.maps.LatLng(lat, lng),
        orders: [ // 상세주소를 찾기위한 옵션
            naver.maps.Service.OrderType.ADDR,
            naver.maps.Service.OrderType.ROAD_ADDR
        ].join(',')
    }, function (status, response) {
        if (status !== naver.maps.Service.Status.OK) {
            return alert('Something wrong!');
        }
        let result = response.v2; // 검색 결과의 컨테이너
        marker.set('addressData', result);
    });

    // 마커에 클릭 이벤트를 적용합니다.
    naver.maps.Event.addListener(marker, 'click', () => createOverlay(marker));

}

// 검색, 주변탐색에 사용되는 숫자 마커를 생성하는 함수
function createNumberMarker(placeList) {
    removeNumberMarker();
    console.log("숫자 마커 생성");

    placeList.forEach((place, i) => {
        let position = new naver.maps.LatLng(place.y, place.x);
        let icon = {
            url: '/assets/img/sp_pins_spot_v3.png',
            size: new naver.maps.Size(24, 37),
            anchor: new naver.maps.Point(12, 37),
            origin: new naver.maps.Point(i * 29, 50)
        },
            numberMarker = new naver.maps.Marker({
                position: position,
                map: map,
                icon: icon
            });

        numberMarker.set('index', i);
        numberMarker.set('isActive', false);
        numberMarker.set('placeData', place);
        numberMarkerList.push(numberMarker);

        naver.maps.Event.addListener(numberMarker, 'click', (e) => {
            let marker = e.overlay; //클릭한 마커정보
            changeMarkerState(e); // 마커를 활성화, 비활성화 하는 함수
            if (marker.get('isActive')) createNumberOverlay(place);
            else removeOverlay();
        });

        naver.maps.Event.addListener(numberMarker, 'mouseover', changeBlueMarker);
        naver.maps.Event.addListener(numberMarker, 'mouseout', changeWhiteMarker);
    })
}

function changeMarkerState(e) {
    let marker = e.overlay, // 이벤트 대상이 된 마커를 의미한다.
        index = marker.get('index'),
        isActive = marker.get('isActive');

    // 클릭한 마커를 제외한 모든 마커를 비활성화한다.
    numberMarkerList.forEach((marker, i) => {
        if (marker.get('index') !== index) { // 대상이 된 마커 외의 모든 마커를 비활성화
            marker.set('isActive', false);
            marker.setIcon({
                url: 'assets/img/sp_pins_spot_v3.png',
                size: new naver.maps.Size(24, 37),
                anchor: new naver.maps.Point(12, 37),
                origin: new naver.maps.Point(i * 29, 50)
            });
        };
    });

    // 클릭한 마커만 'isActive'를 확인하여 상태를 바꿔준다.
    if (isActive === true) {
        marker.set('isActive', false);
    }
    else {
        marker.set('isActive', true);
    }
}

function changeBlueMarker(e) {
    let marker = e.overlay, // 이벤트 대상이 된 마커를 의미한다.
        index = marker.get('index');
    marker.setIcon({
        url: 'assets/img/sp_pins_spot_v3_over.png',
        size: new naver.maps.Size(24, 37),
        anchor: new naver.maps.Point(12, 37),
        origin: new naver.maps.Point(index * 29, 50)
    });
}

function changeWhiteMarker(e) {
    let marker = e.overlay, // 이벤트 대상이 된 마커를 의미한다.
        index = marker.get('index');

    if (marker.get('isActive') === true) return; //마커가 활성화된 상태라면 이미지를 바꾸지 않는다.

    marker.setIcon({
        url: 'assets/img/sp_pins_spot_v3.png',
        size: new naver.maps.Size(24, 37),
        anchor: new naver.maps.Point(12, 37),
        origin: new naver.maps.Point(index * 29, 50)
    });
}

// 기본 마커에 적용되는 커스텀 오버레이를 만드는 함수 입니다.
function createOverlay(marker) {
    console.log("기본 오버레이 생성");

    removeOverlay();

    let address = marker.get('addressData').address;
    let addr = address.jibunAddress;
    let roadAddr = address.roadAddress;
    let content;

    if (roadAddr === '') { // 지번 데이터만 존재할 경우
        content = `<div class="overlay overlay-region">
                        <div class="title">${addr}</div>
                    </div>`;
    }
    else { // 도로명 데이터가 존재할 경우
        content = `<div class="overlay overlay-road">
                        <div class="title">${roadAddr}</div>
                        <div class="region">(지번) ${addr}</div>
                    </div>`;
    }

    overlay = new naver.maps.InfoWindow({
        content: content,
        maxWidth: 280,
        backgroundColor: "white",
        borderColor: "#258fff",
        borderWidth: 2,
        anchorSize: new naver.maps.Size(20, 10),
        anchorSkew: true,
        anchorColor: "white",
        pixelOffset: new naver.maps.Point(0, -10)
    });

    naver.maps.Event.addListener(marker, "click", function (e) {
        if (overlay.getMap()) {
            overlay.close();
        } else {
            overlay.open(map, marker);
        }
    });

    overlay.open(map, marker);
}


//숫자 마커에 적용되는 오버레이입니다.
function createNumberOverlay(place) {
    /**
     * 마커 클릭 => overlay.open(map, marker); 지도와 마커정보필요
     * marker = e.overlay
     * 마커를 클릭하여 얻은 e의 값
     * 
     * 
     * 검색리스트클릭 => overlay.open(map, marker) 마커정보를 어떻게 가져오지?
     * 장소이름을 클릭하여 얻은 e의 값으로는 만들수 없어 e.overlay불가능
     * 
     * 마커를 만들때 set('placeData', place) 이렇게 만들고
     * 마커 리스트 순회하면서 get('placeData') === place 인거를 찾자
     */
    removeOverlay();
    let { place_name, road_address_name, address_name, phone, place_url, distance } = place;
    let marker = numberMarkerList.find(marker => marker.get('placeData') === place);

    // 장소명이 없는 오버레이, 장소명이 존재하는 오버레이 생성
    if (place_name === undefined) {
        content = `<div class="overlay overlay-region">
                                <div class="title">${address_name}</div>
                            </div>`;
    }
    else {
        content = `<div class="overlay overlay-number">
                        <div class="title">${place_name}</div>
                        <div class="roadName">${road_address_name}</div>
                        <div class="region">(지번) ${address_name}</div>
                        </div>`;
    }
    overlay = new naver.maps.InfoWindow({
        content: content,
        maxWidth: 280,
        backgroundColor: "white",
        borderColor: "#258fff",
        borderWidth: 2,
        anchorSize: new naver.maps.Size(20, 10),
        anchorSkew: true,
        anchorColor: "white",
        pixelOffset: new naver.maps.Point(0, -10)
    });

    //class detailPage 또는 title을 클릭하면 상세 페이지로 이동
    const title = document.querySelectorAll('.overlay-number .title');
    let titleClick = (e) => {
        location.href = place_url;
    }
    title.forEach(title => {
        title.addEventListener('click', titleClick);
    })
    overlay.open(map, marker);
}

function removeMarker() {
    if (marker !== undefined) marker.setMap(null);
}

function removeNumberMarker() {
    numberMarkerList.forEach(numberMarker => {
        numberMarker.setMap(null);
    })
    numberMarkerList = [];
}

function removeOverlay() {
    if (overlay !== undefined) {
        overlay.close();
        overlay = undefined;
    }
}

// 앱의 초기단계에서 사용자의 위치를 받는 함수
function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject); // succes, error
    });
}

function error() {
    alert('Sorry, no position available.');
}

// 검색 api를 사용하여 검색후 장소의 이름들을 promise형태 및 배열로 return 하는 함수
function getAddrList(keyword) {
    console.log("주소 데이터로부터 연관검색어를 찾습니다. 검색어 : ", keyword);
    let result = fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${keyword}&size=5`, {
        headers: { Authorization: `KakaoAK 621a24687f9ad83f695acc0438558af2` }
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            let list = [];
            // data = documents[{...}, {...}, {...}]; 의 형태
            data.documents.forEach(data => list.push(data.address_name));
            return list;
        });
    return result;
}

//직접 만든 restaurant.json 으로부터 검색어와 일치하는 값을 찾아 promise형태 및 배열로 return 하는 함수
function getRestList(keyword) {
    console.log("레스토랑 데이터로부터 연관검색어를 찾습니다. 검색어 : ", keyword);
    let result = fetch('/data/restaurant.json')
        .then(res => res.json())
        .then(data => {
            let list = [];
            const restList = data.results[0].items.filter(restaurant => restaurant.name.substring(0, keyword.length) === keyword);
            restList.forEach(data => list.push(data.name));
            return list;
        })
    return result;
}

//* 검색창에 연관 검색어를 세팅하는 함수
function displayRelation(relationList) {
    console.log("릴레이션 세팅");
    console.log(relationList);
    while (relationContainer.hasChildNodes()) {
        relationContainer.removeChild(relationContainer.firstChild);
    }

    relationList.forEach(data => {
        let html = `<div class="relation">${data}</div>`
        relationContainer.insertAdjacentHTML('beforeend', html);
    });

    relationContainer.addEventListener('click', clickSearch);
}

//* 검색창에 히스토리를 세팅하는 함수
function setHtmlHistory() {
    const historyContainer = document.querySelector('.history-container');

    while (historyContainer.hasChildNodes()) {
        historyContainer.removeChild(historyContainer.firstChild);
    }

    historyList.forEach(history => {
        let html = `<div class="history"><i class="fa-solid fa-location-dot"></i>${history}</div>`
        historyContainer.insertAdjacentHTML('beforeend', html);
    })

    historyContainer.addEventListener('click', clickHistory);

}

function clickSearch(e) {
    console.log("리스트를 클릭해서 검색을 실행합니다.");
    const relation = e.target.innerText;

    search(e.target.innerText);
    currentLocationName.innerText = relation;
}

//* 히스토리를 클릭하면 바로 검색결과 나타나게 하는 함수
function clickHistory(e) {
    const history = e.target.innerText;

    searchByAddr(history);
    closeSearchBar();
    currentLocation.innerText = history;
}

function setHtmlHistoryList(history) {
    // 값이 중복이 아닐 경우 push , 배열이 이미 최대크기면 shift
    if (historyList.find(_history => history === _history) === undefined) {
        if (historyList.length === HISTORY_LIST_MAX_LENGTH) {
            historyList.shift();
        }

        historyList.push(history);
    }
}

// 주소를 입력하여 검색하는 함수입니다.
function searchByAddr(searchInput) {
    console.log("주소로 검색 실행 , 검색어 :", searchInput);

    // 카카오 검색
    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    let placeList = new Promise((resolve, reject) => {
        geocoder.addressSearch(searchInput, (result, status) => {
            // 정상적으로 검색이 완료됐으면 
            if (status === kakao.maps.services.Status.OK) {
                console.log("주소로 검색 결과 : ", result);
                resolve(result);
            } else {
                console.log("검색 실패 주소가 아닙니다. reulst는 공백입니다.");
                resolve(result);
            }
        }, {
            size: 10
        });
    })
    return placeList;
}

function searchByKeyword(searchInput) {
    console.log("키워드로 검색 실행 , 검색어 :", searchInput);
    const lat = map.getCenter()._lat;
    const lng = map.getCenter()._lng;

    let placeList = fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?y=${lat}&x=${lng}&radius=${RADIUS.LV1}&query=${searchInput}&size=${SEARCH_DATA_LENGTH}`, {
        headers: { Authorization: `KakaoAK 621a24687f9ad83f695acc0438558af2` }
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("키워드로 검색 결과 :", data);
            return data.documents;
        })
        .catch((error) => console.log("error:" + error));
    return placeList;
}

//! 안쓰이는 함수인데 키워드 검색후 지도 범위 변경 때문에 남겨둔 코드
// 키워드 검색 완료 시 호출되는 콜백함수 입니다 
function placesSearchCB(data, status, pagination) {
    if (status === naver.maps.services.Status.OK) {
        //data = 객체 배열, 객체에서 x,y or address_name을 꺼내면 될듯
        console.log("주변에 데이터가 없을때 키워드로 다시 검색한 결과 : ", data);

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        var bounds = new naver.maps.LatLngBounds();

        for (var i = 0; i < data.length; i++) {
            createNumberMarker(data[i]);
            // 좌표들을 더해 범위를 확장함
            bounds.extend(new naver.maps.LatLng(data[i].y, data[i].x));
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
    }
}

function enterKey() {
    search(searchInput.value);
    closeSearchBar();
}

function upKey() {
    let activeChild = relationContainer.lastElementChild;
    let isActive = false;

    for (let i = 0; i < relationContainer.childElementCount; i++) {
        if (activeChild.classList.contains('active') === true) {
            activeChild.classList.remove('active');

            if (activeChild.previousElementSibling !== null) {
                console.log("액티브가 있고 다음 자식이 있어요 다음 자식에게 액티브를 줍니다.");
                activeChild = activeChild.previousElementSibling;
                activeChild.classList.add('active');
                searchInput.value = activeChild.innerText;
            }
            else if (activeChild.previousElementSibling === null) {
                console.log("히스토리로 넘어가야 하는 상태");
            }

            isActive = true;
            return;
        } else {
            console.log("액티브가 없어요 다음 자식으로 옮깁니다.");
            activeChild = activeChild.previousElementSibling;
        }
    }

    if (isActive === false) {
        console.log("액티브가 없어서 마지막 자식에게 부여");
        activeChild = relationContainer.lastElementChild;
        activeChild.classList.add('active');
        searchInput.value = activeChild.innerText;
    }
}

function downKey() {
    let activeChild = relationContainer.firstElementChild;
    let isActive = false;
    for (let i = 0; i < relationContainer.childElementCount; i++) {
        if (activeChild.classList.contains('active') === true) {
            activeChild.classList.remove('active');
            if (activeChild.nextElementSibling !== null) {
                console.log("액티브가 있고 다음 자식이 있어요 다음 자식에게 액티브를 줍니다.");
                activeChild = activeChild.nextElementSibling;
                activeChild.classList.add('active');
                searchInput.value = activeChild.innerText;
            }
            else if (activeChild.nextElementSibling === null) {
                console.log("히스토리로 넘어가야 하는 상태");
            }

            isActive = true;
            return;
        } else {
            console.log("액티브가 없어요 다음 자식으로 옮깁니다.");
            activeChild = activeChild.nextElementSibling;
        }
    }
    if (isActive === false) {
        console.log("액티브가 없어서 첫번째 자식에게 부여");
        activeChild = relationContainer.firstElementChild;
        activeChild.classList.add('active');
        searchInput.value = activeChild.innerText;
    }
}

function mouseOver(e) {
    e.target.classList.add('active');
}

function mouseOut(e) {
    e.target.classList.remove('active');
}

function search(keyword) {
    // * searchInput의 이벤트중 엔터키가 눌렸을때 '현재 텍스트'로 검색하는 함수
    // keyup 이벤트라서 검색어 정보를 event.target으로는 불러올수 없기때문에
    // 연관검색어를 클릭하여 검색하는 기능과 엔터키를 눌러 검색하는 기능을 나누어서 만들었다.
    console.log("검색 시작");
    Promise.all([searchByAddr(keyword), searchByKeyword(keyword)])
        .then(data => {
            //data[0], data[1]들은 배열(placeList)로 나오게끔 코드를 짰다. x,y 를 얻어 함수에 적용하면 된다.
            console.log(data);
            // 주소로 검색해서 나온 결과가 0이면 키워드로 검색을 살펴봐라
            // 키워드로 검색해서 나온 결과가 0이면 주소로 검색을 살펴봐라
            // 둘다 0이면 noPlaceError()를 실행
            if (data[0].length === 0 && data[1].length !== 0) { // 주소데이터가 없고, 키워드데이터가 있다면
                panTo(data[1][0].y, data[1][0].x);
                removeMarker();
                createNumberMarker(data[1]);
                displaySearchList(data[1]);
                if (categoryIsActive().state === true) closeCategory(categoryIsActive().index);
            }
            else if (data[0].length !== 0) { // 주소 데이터가 있다면
                panTo(data[0][0].y, data[0][0].x);
                removeMarker();
                createNumberMarker(data[0]);
                displaySearchList(data[0]);
                if (categoryIsActive().state === true) closeCategory(categoryIsActive().index);
            }
            else if (data[0].length === 0 && data[1].length === 0) { // 주소데이터, 키워드데이터 둘다 없다면
                noPlaceError();
            }
        })
}

function categoryClick(e, index) {
    removeNumberMarker();
    removeOverlay();

    // 활성화 = category-hover + category-active class가 같이 있는 상태이다.    
    // 1. 클릭한 카테고리를 제외한 모든 카테고리 비활성화
    categoryCircles.forEach(circle => {
        if (e.currentTarget !== circle) {
            circle.lastElementChild.classList.remove('category-active');
            circle.lastElementChild.classList.remove('category-hover');
            circle.style.color = 'black';
        }
    });

    // 2. 클릭한 카테고리의 상태를 확인하여 true나 false로 바꿔준다.
    if (e.currentTarget.lastElementChild.classList.contains('category-active')) {
        console.log("active가 있어 => active 제거");
        e.currentTarget.lastElementChild.classList.remove('category-active');
        e.currentTarget.lastElementChild.classList.remove('category-hover');
        e.currentTarget.style.color = 'black';
    }
    else {
        console.log("active 없어 => active 추가");
        e.currentTarget.lastElementChild.classList.add('category-active');
        e.currentTarget.lastElementChild.classList.add('category-hover');
        e.currentTarget.style.color = 'white';
        aroundSearch(e);
    }
}

function init() {
    getUserLocation()
        .then(data => {
            let lat = data.coords.latitude; // 위도 (남북)
            let lng = data.coords.longitude; // 경도 (동서)
            console.log(lat, lng);
            getWeather(lat, lng)
            // createMarkerByCoords(lat, lng);



            // 좌표 => 주소 변환 함수
            reverseGeocoding(lat, lng)
                .then(address => {
                    addressStringSort(address);
                    let currentLocation = addressStringSort(address).roadAddr;
                    if (currentLocation === '') currentLocation = addressStringSort(address).jibunAddr;

                    setCurrentLocation(currentLocation);
                    displayMap(currentLocation);
                })

        })
}

function reverseGeocoding(lat, lng) {
    let coordType = "WGS84GEO",       //응답좌표 타입 옵션 설정 입니다.
        addressType = "A10",           //주소타입 옵션 설정 입니다.
        appKey = "l7xx68845a4aa2724d0ebbead38642364a0f",
        url = `https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&lat=${lat}&lon=${lng}&coordType=${coordType}&addressType=${addressType}&appKey=${appKey}`;

    return fetch(url)
        .then(res => res.json())
        .then(data => data);
}

function geocoding(address) {
    let coordType = "WGS84GEO",       //응답좌표 타입 옵션 설정 입니다.
        addressType = "A10",           //주소타입 옵션 설정 입니다.
        appKey = "l7xx68845a4aa2724d0ebbead38642364a0f",
        url = `https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&lat=${lat}&lon=${lng}&coordType=${coordType}&addressType=${addressType}&appKey=${appKey}`;
        url : "https://apis.openapi.sk.com/tmap/geo/geocoding?version=1&format=json&",
        "coordType" : "WGS84GEO",
        "city_do" : city_do,
        "gu_gun" : gu_gun,
        "dong" : dong,
        "bunji" : bunji
    return fetch(url)
        .then(res => res.json())
        .then(data => data);
}

function addressStringSort(address, range) {
    
    var arrResult = address.addressInfo;
    //법정동 마지막 문자 
    var lastLegal = arrResult.legalDong
        .charAt(arrResult.legalDong.length - 1);

    // 새주소
    roadAddr = arrResult.city_do + ' '
        + arrResult.gu_gun + ' ';

    if (arrResult.eup_myun == ''
        && (lastLegal == "읍" || lastLegal == "면")) {//읍면
        roadAddr += arrResult.legalDong;
    } else {
        roadAddr += arrResult.eup_myun;
    }
    roadAddr += ' ' + arrResult.roadName + ' '
        + arrResult.buildingIndex;

    // 새주소 법정동& 건물명 체크
    if (arrResult.legalDong != ''
        && (lastLegal != "읍" && lastLegal != "면")) {//법정동과 읍면이 같은 경우

        if (arrResult.buildingName != '') {//빌딩명 존재하는 경우
            roadAddr += (' (' + arrResult.legalDong
                + ', ' + arrResult.buildingName + ') ');
        } else {
            roadAddr += (' (' + arrResult.legalDong + ')');
        }
    } else if (arrResult.buildingName != '') {//빌딩명만 존재하는 경우
        roadAddr += (' (' + arrResult.buildingName + ') ');
    }

    // 구주소
    jibunAddr = arrResult.city_do + ' '
        + arrResult.gu_gun + ' '
        + arrResult.legalDong + ' ' + arrResult.ri
        + ' ' + arrResult.bunji;
    //구주소 빌딩명 존재
    if (arrResult.buildingName != '') {//빌딩명만 존재하는 경우
        jibunAddr += (' ' + arrResult.buildingName);
    }
    let result = {
        roadAddr: roadAddr,
        jibunAddr: jibunAddr
    }
    console.log(result);
    return result;
}

function setCurrentLocation(address) {
    currentLocationName.innerText = address;
}



//* css를 조작하는 함수들은 여기에 정리 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
function closeSearchBar() {
    searchBar.style.borderRadius = "15px";
    relationAndHistoryContainer.classList.add('hide');
    historyContainer.classList.add('hide');
    relationContainer.classList.add('hide');

    searchbarIsOpen = false;
}

function openSearchBar() {
    relationAndHistoryContainer.classList.remove('hide');
    searchBar.style.borderRadius = "15px 15px 0px 0px";

    searchbarIsOpen = true;
}

function openSearchBar_relation() {
    relationContainer.classList.remove('hide');
}

function openSearchBar_histroy() {
    historyContainer.classList.remove('hide');
}

function aroundOpenAndClose() {
    const categoryContainer = document.querySelector('.category-container');
    const aroundTitle = document.querySelector('.around-title');
    const arrow = aroundTitle.querySelector('.fa-solid');
    const ul = document.querySelector('.searchList-container ul');

    if (categoryContainer.style.height === '0px') {
        categoryContainer.style.height = '210px';
        arrow.style.transform = 'rotate(0deg)'
        if (ul !== null) ul.style.height = "310px";
    }
    else {
        categoryContainer.style.height = '0px';
        arrow.style.transform = 'rotate(-180deg)'
        if (ul !== null) ul.style.height = "510px";
    }
}

function categoryMouseEnter(e) {
    // e.target = 카테고리 서클
    e.target.lastElementChild.classList.add('category-hover');
    e.target.style.color = 'white';
}

function categoryMouseLeave(e) {
    // e.target = 카테고리 서클
    if (e.target.lastElementChild.classList.contains('category-active') === false) {
        e.target.lastElementChild.classList.remove('category-hover');
        e.target.style.color = 'black';
    }

}

//* 이벤트 리스너들 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

categoryCircles.forEach((circle, i) => {
    // 자식에게 이벤트가 전파되지 않는 enter와 leave를 사용
    circle.addEventListener('mouseenter', categoryMouseEnter);
    circle.addEventListener('mouseleave', categoryMouseLeave);
    circle.addEventListener('click', (e) => categoryClick(e, i));
})

aroundTitle.addEventListener('click', aroundOpenAndClose);

// 검색창에 값이 입력될 때마다 연관검색어, 히스토리를 보여주는 이벤트
// ! 아직 조정할 내용이 남아있다.
searchInput.addEventListener('keyup', e => {
    console.log("키가 눌렸습니다.");
    if (e.keyCode === 13) enterKey();
    else if (e.keyCode === 38) {
        if (searchbarIsOpen === true) upKey();
    }
    else if (e.keyCode === 40) {
        if (searchbarIsOpen === true) downKey();
    }
    else if (e.isComposing === false) return; //키 입력 중복을 막아주는 기능
    else {
        //value가 공백이 되면 query에러가 발생하여 넣은 코드
        if (searchInput.value === '') return;

        const promise1 = getAddrList(searchInput.value);
        const promise2 = getRestList(searchInput.value);
        Promise.all([promise1, promise2]).then(data => {
            //! 이후 검색 데이터가 더 추가되면 그때 relationList에 배열을 합치는 코드를 바꿔주자
            //! 일단 이렇게 두개의 데이터만 두고 짜            
            let relationList = data[0].concat(data[1]).slice(0, 10);

            if (relationList.length === 0) {
                closeSearchBar();
            }
            else {
                openSearchBar();
                openSearchBar_relation();
                openSearchBar_histroy();
                displayRelation(relationList);
                setHtmlHistory();
            }
        });
    }
})

searchInput.addEventListener('keydown', e => {
    // 위아래 누를시 input의 마우스커서가 맨 앞, 맨 뒤로 가는 기능을 막는다.
    if (e.keyCode === 38) e.preventDefault();
    else if (e.keyCode === 40) e.preventDefault();
})

//비어있는 검색창을 클릭했을때, 검색어가 존재하는 검색창을 클릭했을때 연관검색어리스트를 보여주는 이벤트함수 
searchInput.addEventListener('click', e => {
    if (searchInput.value !== '') { // 검색창에 검색어가 존재한다면
        const promise1 = getAddrList(e.target.value); // 주소데이터에서 검색어를 찾는다.
        const promise2 = getRestList(e.target.value); // 음식점데이터에서 검색어를 찾는다.
        Promise.all([promise1, promise2]).then(data => {
            let relationList = data[0].concat(data[1]).slice(0, 10); // 찾은 데이터를 합쳐, 리스트로 보여준다.
            if (relationList.length === 0) {
                closeSearchBar();
            }
            else {
                openSearchBar();
                openSearchBar_relation();
                openSearchBar_histroy();
                displayRelation(relationList);
                setHtmlHistory();
            }
        })
    }
    else { // 검색창에 검색어가 존재하지 않는다면
        if (historyList.length !== 0) {
            setHtmlHistory();
            openSearchBar();
            openSearchBar_histroy();
        }
    }
})

relationAndHistoryContainer.addEventListener('mouseover', mouseOver);
relationAndHistoryContainer.addEventListener('mouseout', mouseOut);

// e.target이 searchWrapper면 검색창을 유지하고, 그 외의 요소들이면 검색창 닫는 이벤트
body.addEventListener('click', e => {
    if (e.target === searchBar || e.target.parentNode === searchBar) return;
    else closeSearchBar();
});

searchIcon.addEventListener('click', () => search(searchInput.value));


// *에러함수

function noPlaceError() {
    alert('검색한 정보의 장소가 존재하지 않습니다.')
}


init();