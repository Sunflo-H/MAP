/**
 * todo 다 만든다음에 크롤링이니, php, mysql이니 생각을 해보자고
 * todo 다 만들고 자동완성을 네이버 클라우드플랫폼으로 해보자
 * */ 

/**
 * TODO 길찾기 자동완성 클릭하면 텍스트 제대로 가져오기
 * todo 지도 클릭해서 해당 좌표의 정보 받아오기
 */

// 길찾기 기능
const startPointContainer = document.querySelector('.startPoint-container');
const startPointSearchbar = document.querySelector('.startPoint-container .searchbar');
const startPointInput = startPointSearchbar.querySelector('input');
const startPointAutoCompleteList = startPointSearchbar.querySelector('.autoCompleteList-container');

const endPointContainer = document.querySelector('.endPoint-container');
const endPointSearchbar = document.querySelector('.endPoint-container .searchbar');
const endPointInput = endPointSearchbar.querySelector('input');
const endPointAutoCompleteList = endPointSearchbar.querySelector('.autoCompleteList-container');

startPointSearchbar.addEventListener('click', (e) => {
    startPointSearchbar.classList.add('focus');
    endPointSearchbar.classList.remove('focus', 'open');
    startPointInput.focus();
});

startPointAutoCompleteList.addEventListener('click', (e) => {

    //todo 이름부분 클릭했을때 , 
    //todo 주소부분 클릭했을때, 
    //todo 아이콘 클릭했을때 3가지 경우가 있고
    //todo 둘다 이름이 클릭되는 효과가 나타나야한다.
    //todo 이름을 클릭후 이름의 text가 input에 정확히 입력되야한다.

    //todo 위 3가지 경우가 아니라면 기능을 멈춘다(return)

    // 


    //이름 클릭했을때 완성
    

    //주소부분 클릭했을때
    console.log(e.target);
    
    startPointInput.focus();
    
    // 리스트가 아닌 자동완성 컨테이너를 클릭하면 아무것도 실행되지 않게 한다.
    if(e.target === e.currentTarget) {
        return;
    }

    startPointSearchbar.classList.remove('open');
    startPointAutoCompleteList.classList.add('hide');
    
    endPointContainer.classList.remove('hide');

    startPointInput.value = e.target.innerText;
});

endPointSearchbar.addEventListener('click', (e) => {
    console.log(e.target);
    endPointSearchbar.classList.add('focus');
    startPointSearchbar.classList.remove('focus');
    endPointInput.focus();
});

//시작지점의 자동완성이 열리면 도착지점의 포인트컨테이너에 hide를 준다.
endPointInput.addEventListener('input', (e) => {
    // startPointSearchbar.style.height = "200px";
    endPointSearchbar.classList.add('open');
    endPointAutoCompleteList.classList.remove('hide');

    if (endPointInput.value === '') {
        endPointSearchbar.classList.remove('open');
        endPointAutoCompleteList.classList.add('hide');
    }
});

endPointAutoCompleteList.addEventListener('click', (e) => {
    // 타겟이 <li>더라도 innerText로 잘 나오게끔 html파일을 수정해놈

    console.log(e.target);
    console.log(e.target.innerText);
    endPointInput.focus();

    if(e.target === e.currentTarget) {
        // 자동완성 컨테이너를 클릭하면 아무것도 실행되지 않게 한다.
        return;
    }

    endPointSearchbar.classList.remove('open');
    endPointAutoCompleteList.classList.add('hide');
    endPointInput.value = e.target.innerText;

});

//길찾기 기능
/**
 * 필요한 정보들
 * 시작 좌표, 끝 좌표, 경로탐색 api, 경로 라인, 경로 중 포인트들 점
 */

/**
 * 순서
 * 1 목적지를 입력한다.
 * 1-1 목적지를 찾고 리스트를 보여준다. 리스트의 첫번째 값을 startData에 저장
 * 1-2 리스트를 클릭하면 목적지검색창의 text를 바꾸고 startData에 값을 저장한다.
 * 
 * 2 도착지를 입력한다.
 * 2-1 도착지를 찾고 리스트를 보여준다. 리스트의 첫번째 값을 endData에 저장
 * 2-2 리스트를 클릭하면 목적지검색창의 text를 바꾸고 endData에 값을 저장한다.
 * 
 * 
 * 3 start와 end의 x,y좌표로 경로탐색 시작
 * 
 * 경로의 결과값들을 포인트 객체로 변환하고, 포인트 객체를 좌표값으로 변환
 * 모여진 좌표값들을 이어주는 선을 그린다.
 * 
 */

 startPointInput.addEventListener('input', e => {
    const keyword = e.target.value;

    const active = () => {
        startPointSearchbar.classList.add('open');
        startPointAutoCompleteList.classList.remove('hide');
        endPointContainer.classList.add('hide');
    }

    const disActive = () => {
        startPointSearchbar.classList.remove('open');
        startPointAutoCompleteList.classList.add('hide');
        endPointContainer.classList.remove('hide');
    }

    if (startPointInput.value === '') { // 입력값이 공백일때 검색하면 에러가 난다.
        disActive();
        return;
    }
    
    // findAutoComplete(keyword, setAutoCompleteList_start, active, disActive);
    findAutoCompleteBySearch(keyword, setAutoCompleteList_start, active, disActive);
});

/**
 * 키워드로 자동검색단어를 찾는 함수입니다.
 * 콜백함수로 성공시 실행할 succes, 그외 active, disActive가 있습니다.
 * @param {*} keyword 검색어
 * @param {*} success 검색어를 찾았을때 실행할 함수
 * @param {*} active css 조작
 * @param {*} disActive css 조작 
 */
function findAutoComplete(keyword, success, active, disActive) {
    Promise.all([getJsonAddr(keyword), getJsonData(keyword)]).then(data => {      
        let result = data[0].concat(data[1]).slice(0, 15);

        if (result.length !== 0) {
            active();
            success(result);
        }
        else {
            disActive();
        }
    });
}

function findAutoCompleteBySearch(keyword, success, active, disActive) {
    kakaoSearch.search(keyword, map.getCenter()._lat, map.getCenter()._lng)
    .then(data => {
        if(data.length === 0) return;

        let result = data[0].concat(data[1]).slice(0, 10);

        if (result.length !== 0) {
            active();
            success(result);
        }
        else {
            disActive();
        }
    })
}

function setAutoCompleteList_start(data) {
    let ul = startPointAutoCompleteList.querySelector('ul');

    if(data.length === 0) return;

    while(ul.hasChildNodes()) ul.removeChild(ul.firstChild);
    data.forEach(address => {
        let element; 
        if(address.place_name === undefined) {
            element = `<li class="address">
                        <div class="name-container">
                            <i class="fa-solid fa-location-pin"></i>
                            <span>${address.address_name}</span>
                        </div>
                       </li>`;
        }
        else {
            element = `<li class="place">
                        <div class="name-container">
                            <div class="icon"><i class="fa-solid fa-location-dot"></i></div>
                            <div class="name">${address.place_name}</div>
                        </div>
                        <div class="address-container">
                            <span>${address.address_name}</span>
                        </div>
                       </li>`;
        }
        ul.insertAdjacentHTML('beforeend', element);    
    })
}

function displayStartPointResultList() {

}
function displayEndPointResultList() {

}
function displayRouteSearchResultList() {

}

function routeSearch(startPlace, endPlace) {
    console.log("startPlace : ", startPlace);
    console.log("endPlace : ", endPlace);

    if (startPlace === "" || endPlace === "") return;

    let data = Promise.all([search(startPlace), search(endPlace)]);
    console.log(data);
}

function createRouteMarker(start, end) {

}

function drawLine() {

}

function drawComma() {

}

function getRoute() {

}





import kakaoSearchModule from './assets/js/kakaoSearchModule.js';

const kakaoSearch = new kakaoSearchModule();

const mapContainer = document.querySelector('.map-container');
//css 작업에 사용된 변수
const curve = document.querySelector('.curve');
const curvePath = document.querySelector('.curve path');
const curveI = document.querySelector('.curve i');
const menuIcons = document.querySelectorAll('.menu-icon');
const menuCircles = document.querySelectorAll('.menu-category-container .menu-circle');
const menuI = document.querySelectorAll('.menu-circle span');
const etcBtn = document.querySelector('.etc-btn');
const etcContainer = document.querySelector('.etc-container');
// 검색 기능 변수
const body = document.querySelector('body');
const searchInMap = document.querySelector('.interaction-container .search-container input');
const categoryList = document.querySelectorAll('.category');
const searchListState = (stateCheck)();
const autoCompleteState = (stateCheck)();
const historyState = (stateCheck)();

const cityIsChange = (stateCheck)();
body.addEventListener('click', e => {
    if (e.target === startPointContainer) return;
    if (e.target === startPointInput) return;
    if (e.target === startPointSearchbar) return;
    if (e.target === startPointAutoCompleteList ||
        e.target.parentNode === startPointAutoCompleteList || 
        e.target.parentNode.parentNode === startPointAutoCompleteList ||
        e.target.parentNode.parentNode.parentNode === startPointAutoCompleteList ) return;

    if (e.target === endPointContainer) return;
    if (e.target === endPointInput) return;
    if (e.target === endPointSearchbar) return;
    if (e.target === endPointAutoCompleteList ||
        e.target.parentNode === endPointAutoCompleteList || 
        e.target.parentNode.parentNode === endPointAutoCompleteList ||
        e.target.parentNode.parentNode.parentNode === endPointAutoCompleteList ) return;

    /**
     * 바디를 클릭했을때 작동해야 하는 동작
     * 시작지점 기준
     * 시작지점
     * 1. searchbar에 focus 제거
     * 2. searchbar에 open 제거
     * 3. autoComplete 숨기기
     * 
     * 도착지점
     * 1. pointContainer hide 해제
     * 
     * 도착지점 기준
     * 도착지점
     * 1. searchbar에 focus 제거
     * 2. searchbar에 open 제거
     * 3. autoComplete 숨기기
     * 
     * 시작지점
     * 1. pointContainer hide 해제
     *  
     */ 
    startPointSearchbar.classList.remove('focus');
    startPointSearchbar.classList.remove('open');
    startPointAutoCompleteList.classList.add('hide');

    endPointContainer.classList.remove('hide');

    endPointSearchbar.classList.remove('focus');
    endPointSearchbar.classList.remove('open');
    endPointAutoCompleteList.classList.add('hide');

    startPointContainer.classList.remove('hide');
});
/**
 * true, false 상태를 변경하고 확인하는 함수, 즉시실행함수로 사용된다.
 * @returns getState(), setState(boolean)
 */
function stateCheck() {
    let state;

    function getState() {
        return state;
    }

    function setState(boolean) {
        state = boolean;
    }

    return {
        getState: getState,
        setState: setState
    }
}

/**
 * 값을 입력하고 불러오는 함수, 즉시실행함수로 사용된다.
 * @returns getValue(), setValue(param)
 */
function valueCheck() {
    let value;

    function getValue() {
        return value;
    }

    function setValue(param) {
        value = param;
    }

    return {
        getValue: getValue,
        setValue: setValue
    }
}

// 전역변수
let map;
let markers = []; // 생성된 마커들에 이벤트적용 및 삭제 할 때 사용할 배열
let mapCenter;

/**
 * menuCotent를 보여주는 함수
 * 보여지는 컨텐츠에 따라 각각의 기능을 한다.
 */
function showMenuContent() {
    const contentContainers = document.querySelectorAll('.menuContent-container .content-container');
    const searchContainer = document.querySelector('.map .interaction-container .search-container');

    let activeMenu; // 0:검색, 1:길찾기, 2:즐겨찾기, 3:날씨
    const height = 70;

    //활성화중인 메뉴 체크
    for (let i = 0; i < contentContainers.length; i++) {
        if (!contentContainers[i].classList.contains('hide')) {
            activeMenu = i;
        }
    }

    // 검색컨텐츠가 활성화중이면 검색컨테이너(상호작용의 검색)를 보여준다.
    activeMenu === 0 ? searchContainer.style.zIndex = 3 : searchContainer.style.zIndex = 1;

    curve.style.top = activeMenu * 100 + height + "px";
}



function init() {
    navigator.geolocation.getCurrentPosition(pageSetting, error, { enableHighAccuracy: true });
}

init();

function getWeather(lat, lng) {
    const locationContainer = document.querySelector('.location-container');
    const weatherContainer = locationContainer.querySelector('.weather-container');
    const weatherDiv = weatherContainer.querySelector('.weatherAndTemp-container');
    const dustDiv = weatherContainer.querySelector('.dust-container');

    let apiKey = '2bd8aa9e0a77682baadc650722225f4d',
        units = 'metric' // 섭씨 적용
    let weatherData = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=${units}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            let weather;
            let temp = Math.round(data.main.temp * 10) / 10;

            switch (data.weather[0].main) {
                case 'Clouds': weather = '구름'; break;
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

    let dustData = fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            let result = { fineDust: '', yellowDust: '' };
            let pm2_5 = data.list[0].components.pm2_5; // 미세먼지
            let pm10 = data.list[0].components.pm10; // 황사

            if (pm2_5 && pm2_5 <= 15) result.fineDust = '좋음';
            else if (15 < pm2_5 && pm2_5 <= 35) result.fineDust = '보통';
            else if (35 < pm2_5 && pm2_5 <= 75) result.fineDust = '나쁨';
            else if (75 < pm2_5) result.fineDust = '매우나쁨';

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
                yellowDust = data[1].yellowDust,
                color;


            weatherDiv.innerHTML = `<span class="weather">${weather}</span>
                                       <span class="temp">${temp}°C</span>`
            dustDiv.innerHTML = `<div class="dust fineDust">
                                     초미세<span class="rate">${fineDust}</span>
                                 </div>
                                 <div class="dust yellowDust">
                                     미세<span class="rate">${yellowDust}</span>
                                 </div>`

            switch (fineDust) {
                case "좋음": document.querySelector('.fineDust .rate').style.color = "#2359c4"; break;
                case "보통": document.querySelector('.fineDust .rate').style.color = "#01b56e"; break;
                case "나쁨": document.querySelector('.fineDust .rate').style.color = "#f5c932"; break;
                case "매우나쁨": document.querySelector('.fineDust .rate').style.color = "#da3539"; break;
            }
            switch (yellowDust) {
                case "좋음": document.querySelector('.yellowDust .rate').style.color = "#2359c4"; break;
                case "보통": document.querySelector('.yellowDust .rate').style.color = "#01b56e"; break;
                case "나쁨": document.querySelector('.yellowDust .rate').style.color = "#f5c932"; break;
                case "매우나쁨": document.querySelector('.yellowDust .rate').style.color = "#da3539"; break;
            }

            setInterval(() => {
                dustDiv.classList.toggle('up');
            }, 5000);
        })
}

/**
 * 주소 정보를 받아 현재 위치 정보를 세팅한다.
 * @param {*} city 두번째 주소 : ~구
 * @param {*} dong 세번째 주소 : ~동
 */
function setCurrentLocation(city, dong) {
    const citySpan = document.querySelector('.address-container .city');
    const dongSpan = document.querySelector('.address-container .dong');

    citySpan.innerText = city;
    dongSpan.innerText = dong;
}

/**
 * 주소 정보를 받아 추천리스트를 세팅한다..
 * @param {*} region 첫번째 주소 : ~시, ~도
 * @param {*} city   두번째 주소 : ~동
 */
function setRecommendList(region, city) {
    const recommendList = document.querySelector('.itemList-container');

    while (recommendList.hasChildNodes()) recommendList.removeChild(recommendList.firstChild);

    fetch('./data/restaurant/seoul.json')
        .then(res => res.json())
        .then(data => {
            let restaurantList = data.filter(data => (data.지역 === region) && (data.도시명 === city))
            restaurantList.forEach((restaurant) => {
                let element = `<div class="item-container">
                                 <div class="image-container"><img src=${restaurant.img}></div>
                                 <div class="nameAndCategory">${restaurant.식당상호} <span>${restaurant.음식종류}</span></div>
                                 <div class="reason">${restaurant.추천사유}</div>
                             </div>`
                recommendList.insertAdjacentHTML('beforeend', element);
            })
        });
}

/**
 * 좌표를 받아 해당 좌표의 정보들로 검색컨텐츠를 보여준다.
 * @param {*} lat 위도 y
 * @param {*} lng 경도 x
 */
function displaySearchContent(lat = map.getCenter()._lat, lng = map.getCenter()._lng) {
    kakaoSearch.searchAddrFromCoords(lat, lng)
        .then(data => {
            const citySpan = document.querySelector('.address-container .city');

            let region = data[1].region_1depth_name;
            let city = data[1].region_2depth_name;
            let dong = data[1].region_3depth_name;

            if (citySpan.innerText !== city) cityIsChange.setState(true);
            else cityIsChange.setState(false);

            setCurrentLocation(city, dong);

            if (cityIsChange.getState()) { // city의 값이 변경되면 맛집리스트를 다시 불러온다.
                setRecommendList(region, city);
            }
        });
    mapCenter = map.getCenter();
}

/**
 * 좌표를 기준으로 지도를 생성한다.
 * @param {*} lat 위도 y
 * @param {*} lng 경도 x
 */
function createMap(lat, lng) {
    const mapDiv = document.querySelector('.map');
    const center = new Tmapv2.LatLng(lat, lng);

    let mapOption = {
        center: center,
        zoom: 17
    };

    map = new Tmapv2.Map(mapDiv, mapOption);

    mapCenter = map.getCenter();
}

//! if promise가 아니라면?
// navigator.geolocation.getCurrentPosition(pageSetting);

function error() {
    alert('초기 좌표 정보를 불러오지 못했습니다.')
}

function pageSetting(result) {
    let lat = result.coords.latitude; // 위도 (남북)
    let lng = result.coords.longitude; // 경도 (동서)

    getWeather(lat, lng);

    createMap(lat, lng); // 지도 생성

    displaySearchContent();

    map.addListener('click', (event) => {
        let lat = event.latLng._lat;
        let lng = event.latLng._lng;
    });
    map.addListener('mouseup', (event) => {
        if (mapCenter._lat !== map.getCenter()._lat
            || mapCenter._lng !== map.getCenter()._lng) {
            displaySearchContent();
        }
    });
}
/**
 * 카카오 카테고리 검색에서만 사용되는 callback함수
 * @param {*} result 검색결과
 * @param {*} status 검색결과 상태
 * @param {*} pagination 검색결과 page에 관련된 정보
 */
function createCategoryMarker(result, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        removeMarker();
        result.forEach(data => createMarker(data));
        setMarkerEvent();
        let nextBtn = document.getElementById('nextBtn');
        let prevBtn = document.getElementById('prevBtn');

        nextBtn.click(function () {
            // 속성 값으로 다음 페이지가 있는지 확인하고
            if (pagination.hasNextPage) {
                // 있으면 다음 페이지를 검색한다.
                pagination.nextPage();
            }
        });

        prevBtn.click(function () {
            // 속성 값으로 다음 페이지가 있는지 확인하고
            if (pagination.hasPrevPage) {
                // 있으면 다음 페이지를 검색한다.
                pagination.nextPage();
            }
        });
    }
}

/**
 * data를 받아 1개의 마커를 생성하는 함수
 * @param {*} data 
 */
function createMarker(data) {
    console.log(data);
    let icon;
    let content;
    let type = data.category_group_name; //주소, 장소, 음식점-카페 등등

    if (type === undefined) { // 주소일때
        icon = `<i class="fa-solid fa-location-dot"></i>`;
        content = `<div class="marker-container">
                         <div class="icon">${icon}</i></div>
                         <div class="markerInfo-container">
                             <div class="addressName">${data.address_name}</div>
                         </div>
                         <div class="marker-point"></div>
                     </div>`;
    }
    else if (type === "") { // 장소일때
        icon = `<i class="fa-solid fa-location-dot"></i>`;
        content = `<div class="marker-container">
                         <div class="icon">${icon}</i></div>
                         <div class="markerInfo-container">
                             <div class="addressName">${data.place_name}</div>
                         </div>
                         <div class="marker-point"></div>
                     </div>`;
    }
    else { // 음식점, 카페, 마트 등등
        icon = `<i class="fa fa-cutlery">`; // 음식점일때
        content = `<div class="marker-container">
                         <div class="icon">${icon}</i></div>
                         <div class="markerInfo-container">
                             <div class="placeName">${data.place_name}</div>
                             <div class="placeCategory">${type}</div>
                         </div>
                         <div class="marker-point"></div>
                     </div>`;
    }

    let marker = new Tmapv2.InfoWindow({
        position: new Tmapv2.LatLng(data.y, data.x), //Popup 이 표출될 맵 좌표
        content: content, //Popup 표시될 text
        border: '0px solid #ff0000', //Popup의 테두리 border 설정.
        type: 2, //Popup의 type 설정.
        align: 17,
        background: false,
        offset: new Tmapv2.Point(33, 5),
        map: map //Popup이 표시될 맵 객체
    });

    let marekrObj = {
        marker: marker,
        info: data
    };

    markers.push(marekrObj);
}

/**
 * 마커를 모두 삭제한다.
 */
function removeMarker() {
    markers.forEach(data => {
        data.marker.setMap(null);
    });
    markers = [];
}

/**
 * 좌표로 지도가 부드럽게 이동한다.
 * @param {*} lat 위도 y
 * @param {*} lng 경도 x
 */
function panTo(lat, lng) {
    map.panTo(new Tmapv2.LatLng(lat, lng));
}

function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject); // succes, error
    });
}




// 검색 기능 모음
const categoryValue = (valueCheck)();

/**
 * 현재 생성된 마커에 이벤트를 적용하는 함수
 */
function setMarkerEvent() {
    const markerDivs = document.querySelectorAll('.marker-container');

    for (let i = 0; i < markerDivs.length; i++) {
        markerDivs[i].addEventListener('mouseenter', event => {
            event.currentTarget.parentNode.style.zIndex = 10001;
        })

        markerDivs[i].addEventListener('mouseleave', event => {
            event.currentTarget.parentNode.style.zIndex = 10000;
        })

        markerDivs[i].addEventListener('click', event => {
            // 이름, 주소, 전화번호, 상세보기
            let lat = markers[i].marker.getPosition()._lat;
            let lng = markers[i].marker.getPosition()._lng;

            panTo(lat, lng);
            displaySearchContent(lat, lng);

            const menuContentContainer = document.querySelector('.menuContent-container');
            const contentContainers = menuContentContainer.querySelectorAll('.content-container');
            const searchContent = menuContentContainer.querySelector('.searchContent');
            const placeInfoContainer = searchContent.querySelector('.placeInfo-container');


            menuContentContainer.classList.add("menuContent-container-active");
            curve.classList.remove('hide');

            setTimeout(() => {
                curve.style.opacity = "1";
                curve.style.transform = "translateX(-5px)";
            }, 1);

            // 모든 컨텐츠를 닫고 검색컨텐츠만 보여준다.
            for (let i = 0; i < contentContainers.length; i++) {
                if (i === 0) contentContainers[i].classList.remove('hide');
                else contentContainers[i].classList.add('hide');
            }

            // 장소정보 컨테이너를 보여준다.
            placeInfoContainer.classList.remove('hide');

            // 메뉴 활성화 함수
            showMenuContent();

            // 클릭한 마커에 대한 장소정보 컨테이너를 연다.
            setPlaceInfoContainer(markers[i].info);
        })
    }
}



/**
 * 장소의 정보를 인자로 받아 장소정보컨테이너의 내용을 보여준다.
 * @param {*} data 장소의 정보(markers[i].info)
 */
function setPlaceInfoContainer(data) {
    const placeInfoContainer = document.querySelector('.menuContent-container .searchContent .placeInfo-container');
    const imgContainer = placeInfoContainer.querySelector('.img-container');
    const nameAndCategoryContainer = placeInfoContainer.querySelector('.nameAndCategory-container');
    const detailContainer = placeInfoContainer.querySelector('.detail-container');

    let name = data.place_name,
        addressName = data.address_name,
        roadAddress = data.road_address_name,
        category = data.category_group_name,
        phone = data.phone,
        id = data.id,
        url = data.place_url;


    let imgSrc;
    let imgElement;
    let nameAndCategoryElement = `<div class="name">${name}</div>
                                   <div class="category">${category}</div>`;
    let detailElement
    if (phone === "") {
        detailElement = `<div class="address"><i class="fa-solid fa-location-dot"></i><span>${addressName}</span></div>`
    }
    else detailElement = `<div class="address"><i class="fa-solid fa-location-dot"></i><span>${addressName}</span></div>
                           <div class="phone"><i class="fa-solid fa-phone"></i></i><span>${phone}</span></div>`;



    while (nameAndCategoryContainer.hasChildNodes()) {
        nameAndCategoryContainer.removeChild(nameAndCategoryContainer.firstChild);
    }

    while (detailContainer.hasChildNodes()) {
        detailContainer.removeChild(detailContainer.firstChild);
    }

    nameAndCategoryContainer.insertAdjacentHTML('beforeend', nameAndCategoryElement);
    detailContainer.insertAdjacentHTML('beforeend', detailElement);

    // 카테고리별 이미지 src
    switch (category) {
        case "음식점": imgSrc = "./assets/img/searchInfo/음식점(요리사)s.jpg"; break;
        case "카페": imgSrc = "./assets/img/searchInfo/카페(사람)s.jpg"; break;
        case "편의점": imgSrc = "./assets/img/searchInfo/편의점s.jpg"; break;
        case "대형마트": imgSrc = "./assets/img/searchInfo/마트s.jpg"; break;
        case "숙박": imgSrc = "./assets/img/searchInfo/숙박s.jpg"; break;
        case "주유소,충전소": imgSrc = "./assets/img/searchInfo/주유소s.jpg"; break;
        case "주차장": imgSrc = "./assets/img/searchInfo/주차장s.jpg"; break;
        case "문화시설": imgSrc = "./assets/img/searchInfo/문화시설s.jpg"; break;
        case "관광명소": imgSrc = "./assets/img/searchInfo/관광명소s.jpg"; break;
        case "병원": imgSrc = "./assets/img/searchInfo/병원s.jpg"; break;
        case "은행": imgSrc = "./assets/img/searchInfo/은행s.jpg"; break;
        case "약국": imgSrc = "./assets/img/searchInfo/약국s.jpg"; break;
    }

    // 이미지의 높이, 스케일 조절
    switch (category) {
        case "음식점":
        case "숙박":
        case "주유소,충전소":
        case "관광명소":
        case "은행": imgElement = `<img class="infoImage height120" src=${imgSrc}>
                                     <div class="img-cover1"></div>
                                     <div class="img-cover2">
                                         <div class="button"><span><i class="fa-solid fa-xmark"></i></span></div>
                                     </div>`;
            break;
        case "편의점":
        case "주차장": imgElement = `<img class="infoImage scale12" src=${imgSrc}>
                                       <div class="img-cover1"></div>  
                                       <div class="img-cover2">
                                         <div class="button"><span><i class="fa-solid fa-xmark"></i></span></div>
                                       </div>`;
            break;
        case "대형마트":
        case "숙박": imgElement = `<img class="infoImage height scale10" src=${imgSrc}>
                                     <div class="img-cover1"></div>
                                     <div class="img-cover2">
                                         <div class="button"><span><i class="fa-solid fa-xmark"></i></span></div>
                                     </div>`;
            break;
        case "카페":
        case "문화시설":
        case "병원":
        case "약국": imgElement = `<img class="infoImage" src=${imgSrc}>
                                     <div class="img-cover1"></div>
                                     <div class="img-cover2">
                                         <div class="button"><span><i class="fa-solid fa-xmark"></i></span></div>
                                     </div>`;
            break;
    }

    // 카테고리가 바뀌었다면 img를 바꾼다.
    if (categoryValue.getValue() !== category) {
        while (imgContainer.hasChildNodes()) imgContainer.removeChild(imgContainer.firstChild);
        categoryValue.setValue(category);
        imgContainer.insertAdjacentHTML('beforeend', imgElement);
    }
    const button = placeInfoContainer.querySelector('.button');

    button.addEventListener('click', event => {
        placeInfoContainer.classList.add('hide');
    });

    console.log(data);
}



/**
 * 카카오가 제공하는 주소 데이터로부터 -keyword-와 글자가 일치하는 데이터를 가져온다.
 * @param {*} keyword 일치하는지 찾아볼 단어
 * @returns [구의동, 구의1동, 구의2동, ...]
 */
function getJsonAddr(keyword) {
    let result = fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${keyword}&size=5`, {
        headers: { Authorization: `KakaoAK 621a24687f9ad83f695acc0438558af2` }
    })
        .then(res => res.json())
        .then(data => {
            let list = [];
            data.documents.forEach(data => list.push(data.address_name));
            return list;
        });
    return result;
}

/**
 * 자동완성 JSON파일에서 -keyword-와 글자가 일치하는 데이터들을 가져온다. 
 * @param {*} keyword 일치하는지 찾아볼 단어
 * @returns [강남, 강남식당, 강남포차, ...]
 */
function getJsonData(keyword) {
    let result = fetch('./data/restaurant.json')
        .then(res => res.json())
        .then(data => {
            let list = [];
            const restList = data.results[0].items.filter(restaurant => restaurant.name.substring(0, keyword.length) === keyword);
            restList.forEach(data => list.push(data.name));
            // 엄청 많이 찾음 100개 넘어감
            return list;
        })
    return result;
}

/** isTrue의 값에 따라 검색리스트를 보여준다. */
function displaySearchList(isTrue) {
    const searchList = document.querySelector('.interaction-container .searchList');

    if (isTrue) {
        searchList.classList.remove('hide');
        searchListState.setState(true);
    }
    else {
        searchList.classList.add('hide');
        searchListState.setState(false);
    }
}

function setHistory() {
    let historyArr = ["아차산", "구의동", "롯데리아"];
    historyArr = [];
    const searchList = document.querySelector('.interaction-container .searchList');

    while (searchList.hasChildNodes()) searchList.removeChild(searchList.firstChild);

    if (historyArr.length !== 0) {
        //히스토리 길이만큼 히스토리 세팅
        historyArr.forEach(data => {
            let element = `<div class="history">
                                 <i class="fa-solid fa-clock-rotate-left"></i> 
                                 <span>${data}</span>
                             </div>`;
            searchList.insertAdjacentHTML('beforeend', element);
        });
    }
    else {
        let element = `<div class="no-history">
                             검색기록이없습니다.
                         </div>`;
        searchList.insertAdjacentHTML('beforeend', element);
    }
}

/**
 * 검색데이터를 받아 자동완성단어를 세팅한다. 
 * searchContainerType에 따라 어떤 검색창의 검색리스트를 다룰지 결정한다.
 * @param {*} data 검색창에 입력한 단어와 조건이 일치하는 단어들의 리스트
 * @param {*} searchType 검색컨테이너
 */
function setAutoComplete(data, searchContainerType) {
    let container = ".interaction-container";

    switch (searchContainerType) {
        case "startPoint": container = ".startPoint-container"; break;
    }

    const searchList = document.querySelector(`${container} .searchList`);

    while (searchList.hasChildNodes()) searchList.removeChild(searchList.firstChild);
    data.forEach(data => {
        let element = `<div class="autoComplete">
                             <i class="fa-solid fa-location-dot"></i><span>${data}</span>
                         </div>`;
        searchList.insertAdjacentHTML('beforeend', element);
    });

    const autoCompleteList = document.querySelectorAll('.autoComplete');

    autoCompleteList.forEach(autoComplete => {
        autoComplete.addEventListener('click', event => {
            console.log("하이");
            const span = autoComplete.querySelector('span');
            kakaoSearch.search(span.innerText);
            displaySearchList(false);
        })
    });

    autoCompleteList.forEach(autoComplete => {
        autoComplete.addEventListener('mouseenter', event => {

            autoComplete.classList.add('active');
        })
    });

    autoCompleteList.forEach(autoComplete => {
        autoComplete.addEventListener('mouseleave', event => {
            autoComplete.classList.remove('active');
        })
    });
}

/**
 * enter를 눌렀을때 실행되는 함수.
 * search를 실행하여 검색 결과로 마커, 검색컨텐츠를 세팅한다.
 */
function enterKey() {
    const lat = map.getCenter()._lat;
    const lng = map.getCenter()._lng;

    kakaoSearch.search(searchInMap.value, lat, lng)
        .then(data => {
            const addressSearchData = data[0];
            const keywordSearchData = data[1];

            // 주소검색 결과만 있는경우
            if (addressSearchData.length !== 0) {
                panTo(addressSearchData[0].y, addressSearchData[0].x);
                displaySearchContent(addressSearchData[0].y, addressSearchData[0].x);
                removeMarker();
                addressSearchData.forEach(data => {
                    createMarker(data);
                });
                setMarkerEvent();
                return data;
            }
            // 키워드검색 결과만 있는경우
            else if (addressSearchData.length === 0 && keywordSearchData.length !== 0) {
                panTo(keywordSearchData[0].y, keywordSearchData[0].x);
                displaySearchContent(keywordSearchData[0].y, keywordSearchData[0].x);
                removeMarker();
                keywordSearchData.forEach(data => {
                    createMarker(data);
                });
                setMarkerEvent();
            }
            // 모두 없는 경우
            else if (addressSearchData.length === 0 && keywordSearchData.length === 0) { // 주소데이터, 키워드데이터 둘다 없다면
                alert('검색 결과가 없습니다.');
            }
        });
    displaySearchList(false);
}

function upKey() {
    const searchList = document.querySelector('.interaction-container .searchList');
    let standardChild = searchList.lastElementChild;

    if (standardChild.classList.contains('no-history')) return;

    //위, 아래 누르면 input의 마우스포인터가 앞뒤로 이동하는거 막을수있나?

    for (let i = 0; i < searchList.childElementCount; i++) {

        if (standardChild.classList.contains('active') === true) {
            standardChild.classList.remove('active');

            if (standardChild.previousElementSibling !== null) {
                standardChild = standardChild.previousElementSibling;
                standardChild.classList.add('active');
                searchInMap.value = standardChild.innerText;
            }
            else if (standardChild.previousElementSibling === null) {
                standardChild = searchList.lastElementChild;
                standardChild.classList.add('active');
                searchInMap.value = standardChild.innerText;
            }

            return;
        }
        else standardChild = standardChild.previousElementSibling;
    }

    standardChild = searchList.lastElementChild;
    standardChild.classList.add('active');
    searchInMap.value = standardChild.innerText;
}

function downKey() {
    const searchList = document.querySelector('.interaction-container .searchList');
    let standardChild = searchList.firstElementChild;

    if (standardChild.classList.contains('no-history')) return;

    //위, 아래 누르면 input의 마우스포인터가 앞뒤로 이동하는거 막을수있나?

    for (let i = 0; i < searchList.childElementCount; i++) {

        if (standardChild.classList.contains('active') === true) {
            standardChild.classList.remove('active');

            if (standardChild.nextElementSibling !== null) {
                standardChild = standardChild.nextElementSibling;
                standardChild.classList.add('active');
                searchInMap.value = standardChild.innerText;
            }
            else if (standardChild.nextElementSibling === null) {
                standardChild = searchList.firstElementChild;
                standardChild.classList.add('active');
                searchInMap.value = standardChild.innerText;
            }

            return;
        }
        else standardChild = standardChild.nextElementSibling;
    }

    standardChild = searchList.firstElementChild;
    standardChild.classList.add('active');
    searchInMap.value = standardChild.innerText;
}

/** 카테고리를 클릭하면 카테고리검색함수를 실행 */
categoryList.forEach(category => {
    category.addEventListener('click', event => {
        let categoryCode = event.currentTarget.getAttribute('data-categoryCode');
        let lat = map.getCenter()._lat;
        let lng = map.getCenter()._lng;
        let location = new kakao.maps.LatLng(lat, lng);
        let page = 1;

        kakaoSearch.categorySearch(categoryCode, location, page, createCategoryMarker);
    });
});



/** 검색창에 위, 아래, 엔터 각각의 함수를 이벤트로 등록한다. */
searchInMap.addEventListener('keyup', e => {
    if (e.keyCode === 13) enterKey();
    else if (e.keyCode === 38) {
        if (searchListState.getState()) upKey();
    }
    else if (e.keyCode === 40) {
        if (searchListState.getState()) downKey();
    }
    else if (e.isComposing === false) return; //엔터키 중복입력을 막는다.
});

/** 검색창에 값이 입력되면 검색창 아래에 리스트를 만들고 자동완성단어를 세팅한다. */
searchInMap.addEventListener('input', e => {

    if (searchInMap.value === '') {
        displaySearchList(true);
        setHistory();
        return;
    }

    Promise.all([getJsonAddr(searchInMap.value), getJsonData(searchInMap.value)]).then(data => {
        let result = data[0].concat(data[1]).slice(0, 10);

        if (result.length !== 0) {
            displaySearchList(true);
            setAutoComplete(result);
        }
        else {
            displaySearchList(false);
        }
    });
});

searchInMap.addEventListener('click', e => {
    displaySearchList(true);
    if (searchInMap.value === "") setHistory();
});

body.addEventListener('click', e => {
    const container = document.querySelector('.interaction-container .search-container');

    if (e.target === searchInMap) return;
    if (e.target === container) return;
    if (e.target.parentNode === container) return;
    if (e.target.parentNode.parentNode === container) return;
    if (e.target.parentNode.parentNode.parentNode === container) return;

    displaySearchList(false);
});

/** 곡선모양을 누르면 메뉴 컨텐츠를 닫는다. */
curvePath.addEventListener('click', () => {
    const menuContentContainer = document.querySelector('.menuContent-container');
    const contentContainers = document.querySelectorAll('.menuContent-container > .content-container');

    menuContentContainer.classList.remove("menuContent-container-active");
    curve.style.transform = "translateX(5px)";
    curve.style.opacity = "0";
    setTimeout(() => {
        curve.classList.add('hide');
    }, 200);
    for (let i = 0; i < contentContainers.length; i++) {
        contentContainers[i].classList.add('hide');
    }

    showMenuContent();
});

/** 곡선모양안의 화살표를 누르면 메뉴 컨텐츠를 닫는다. */
curveI.addEventListener('click', () => {
    const menuContentContainer = document.querySelector('.menuContent-container');
    const contentContainers = document.querySelectorAll('.menuContent-container > .content-container');

    menuContentContainer.classList.remove("menuContent-container-active");
    curve.style.transform = "translateX(5px)";
    curve.style.opacity = "0";
    setTimeout(() => {
        curve.classList.add('hide');
    }, 200);

    for (let i = 0; i < contentContainers.length; i++) {
        contentContainers[i].classList.add('hide');
    }
    showMenuContent();
});

/** 메뉴 아이콘을 누르면 곡선의 위치를 바꾼다. */
menuIcons.forEach((icon, index) => {
    icon.addEventListener('click', () => {
        let height = 70;
        curve.style.top = index * 100 + height + "px"
    });
});

/** 메뉴 아이콘을 누르면 해당 메뉴컨텐츠가 보여진다.*/
menuCircles.forEach(((circle, index) => {
    circle.addEventListener('click', () => {
        const menuContentContainer = document.querySelector('.menuContent-container');
        const contentContainers = document.querySelectorAll('.menuContent-container > .content-container');

        menuContentContainer.classList.add("menuContent-container-active");
        curve.classList.remove('hide');

        setTimeout(() => {
            curve.style.opacity = "1";
            curve.style.transform = "translateX(-5px)";
        }, 0);

        for (let i = 0; i < contentContainers.length; i++) {
            if (i === index) contentContainers[i].classList.remove('hide');
            else contentContainers[i].classList.add('hide');
        }

        showMenuContent();
    });
}));



/** 카테고리의 기타버튼에 마우스가 들어오면 배경색을 바꾸고, 기타카테고리를 보여준다. */
etcBtn.addEventListener('mouseenter', () => {
    etcContainer.classList.remove('hide');
    etcBtn.style.background = "rgba(0, 0, 0, 0.02)";
    etcBtn.style.color = "var(--cacaoBlue)";
});

/** 카테고리의 기타버튼에서 마우스가 나가면 배경색을 바꾸고, 기타카테고리를 감춘다. */
etcContainer.addEventListener('mouseleave', () => {
    etcContainer.classList.add('hide');
    etcBtn.style.backgroundColor = "white";
    etcBtn.style.color = "black";
});

