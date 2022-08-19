const RADIUS = {
    LV1: 5000,
    LV2: 10000,
    LV3: 15000,
    LV4: 20000
}
const SEARCH_DATA_LENGTH = 15;


const mapContainer = document.querySelector('.map-container');


//css 작업에 사용된 변수
const curve = document.querySelector('.curve');
const curvePath = document.querySelector('.curve path');
const curveI = document.querySelector('.curve i');
const menuIcons = document.querySelectorAll('.menu-icon');
const menuCircles = document.querySelectorAll('.menu-container .menu-circle');
const menuI = document.querySelectorAll('.menu-circle span');
const etcBtn = document.querySelector('.etc-btn');
const etcContainer = document.querySelector('.etc-container');

// 전역변수
let map;
let markers = [];
let cityIsChange;
let mapCenter;

// 즉시실행함수로 전역변수를 최소화
function stateCheck() {
    let state;

    return {
        value: function () {
            return state;
        },

        true: function () {
            state = true;
        },

        false: function () {
            state = false;
        }
    }
}

function valueCheck() {
    let value;

    return {
        getValue: function (param) {
            return value;
        },
        setValue: function (param) {
            value = param;
        }

    }
}

function init() {
    getUserLocation()
        .then(data => {
            let lat = data.coords.latitude; // 위도 (남북)
            let lng = data.coords.longitude; // 경도 (동서)
            console.log(lat, lng);
            getWeather(lat, lng);
            displayMap(lat, lng); // 현재 위치를 중심으로 맵을 표시합니다.
            // 지도 생성후 사용되는 함수들
            setCurrentLocation();
            hotRestaurant();

            //tmap 클릭 이벤트
            map.addListener('click', (event) => {
                let lat = event.latLng._lat;
                let lng = event.latLng._lng;
                console.log(reverseGeocoding(lat, lng));
            });
            // 지도에 마커 생성
            // createMarkerByCoords(lat, lng);

            map.addListener('drag', (event) => {
                let lat = event.latLng._lat;
                let lng = event.latLng._lng;
                setCurrentLocation(lat, lng);
            })
            // reverseGeocoding(lat, lng)
            //     .then(data => {
            //         let currentLocation = data.v2.address.roadAddress; // 현재 위치
            //         if (currentLocation === '') currentLocation = data.v2.address.jibunAddress; // 도로명주소가 없으면 지번주소로

            //         displayMap(currentLocation); // 현재 위치를 중심으로 맵을 표시합니다.
            //     });
        })
}

function getWeather(lat, lng) {
    const weatherDiv = document.querySelector('.location-weather');
    const dustDiv = document.querySelector('.location-dust');

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
                const dustDiv = document.querySelector('.location-dust');
                dustDiv.classList.toggle('up');
            },5000);
        })
    
}

function geocoding(address) {
    return new Promise(resolve => {
        let callback = (status, response) => {
            if (status !== naver.maps.Service.Status.OK) {
                return alert('Something wrong!');
            }
            resolve(response);
        }
        naver.maps.Service.geocode({ query: address }, callback);
    })
}

function reverseGeocoding(lat, lng, type) {
    return new Promise(resolve => {
        let coords = new naver.maps.LatLng(lat, lng);

        let orderTypes = [
            naver.maps.Service.OrderType.ADDR,
            naver.maps.Service.OrderType.ROAD_ADDR
        ];

        if (type === "dong") orderTypes = [...orderTypes, naver.maps.Service.OrderType.ADM_CODE]
    
        let option = {
            coords: coords,
            orders: orderTypes
        }

        let callback = (status, response) => {
            if (status !== naver.maps.Service.Status.OK) {
                console.log(status);
                return alert('Something wrong!');
            }
            resolve(response);
        }

        naver.maps.Service.reverseGeocode(option, callback);
    })
}

function displaySearchContent(lat = map.getCenter()._lat, lng = map.getCenter()._lng) {

    reverseGeocoding(lat, lng, "dong")
    .then(data => {
        const locationAddress = document.querySelector('.location-address');
        const citySpan = locationAddress.querySelector('.city');
        const dongSpan = locationAddress.querySelector('.dong');
        const recommendList = document.querySelector('.recommend-lists-container');

        let region = data.v2.results[1].region.area1.name,
            city = data.v2.results[1].region.area2.name,
            dong = data.v2.results[1].region.area3.name;

        if(citySpan.innerText !== city) cityIsChange = true;
        else cityIsChange = false;

        citySpan.innerText = city;
        dongSpan.innerText = dong;
        // setCurrentLocation();
        // setHotRestaurant();
        if(cityIsChange) { // city의 값이 변경되면 맛집리스트를 다시 불러온다.
            
            while(recommendList.hasChildNodes()) recommendList.removeChild(recommendList.firstChild);
            
            fetch('/data/restaurant/seoul.json')
            .then(res => res.json())
            .then(data => {
                let restaurantList = data.filter(data => (data.지역 === region) && (data.도시명 === city))
                restaurantList.forEach((restaurant) => {
                    let element = `<div class="recommend-list-container">
                                        <div><img src=${restaurant.img}></div>
                                        <div>${restaurant.식당상호} <span>${restaurant.음식종류}</span></div>
                                        <div>${restaurant.추천사유}</div>
                                    </div>`
                    recommendList.insertAdjacentHTML('beforeend', element);
                })
            })
        }
    });
    mapCenter = map.getCenter();
}

function displayMap(lat, lng) {
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
navigator.geolocation.getCurrentPosition(pageSetting);

function pageSetting(result) {
    let lat = result.coords.latitude; // 위도 (남북)
    let lng = result.coords.longitude; // 경도 (동서)
    getWeather(lat, lng);
    displayMap(lat, lng); // 지도 생성

    displaySearchContent();

    map.addListener('click', (event) => {
        let lat = event.latLng._lat;
        let lng = event.latLng._lng;
    });

    map.addListener('mouseup', (event) => {
        if(mapCenter._lat !== map.getCenter()._lat 
            || mapCenter._lng !== map.getCenter()._lng) {
            displaySearchContent();
        }
    });
}

function createMarker(data) {
    
    let icon;
    let content;
    let type = data.category_group_name; //주소, 장소, 음식점-카페 등등

    if(type === undefined) { // 주소일때
        icon = `<i class="fa-solid fa-location-dot"></i>`; 
        content = `<div class="marker-container">
                        <div class="marker-icon">${icon}</i></div>
                        <div class="marker-address">
                            <div class="marker-address-name">${data.address_name}</div>
                        </div>
                        <div class="marker-point"></div>
                    </div>`;
    }
    else if(type === "") { // 장소일때
        icon = `<i class="fa-solid fa-location-dot"></i>`; 
        content = `<div class="marker-container">
                        <div class="marker-icon">${icon}</i></div>
                        <div class="marker-address">
                            <div class="marker-address-name">${data.place_name}</div>
                        </div>
                        <div class="marker-point"></div>
                    </div>`;
    }
    else { // 음식점, 카페, 마트 등등
        icon = `<i class="fa fa-cutlery">`; // 음식점일때
        content = `<div class="marker-container">
                        <div class="marker-icon">${icon}</i></div>
                        <div class="marker-address">
                            <div class="marker-place-name">${data.place_name}</div>
                            <div class="marker-place-category">${type}</div>
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

function removeMarker() {
    markers.forEach(data => {
        data.marker.setMap(null);
    });
    markers = [];
}

function panTo(lat, lng) {
    map.panTo(new Tmapv2.LatLng(lat, lng));
    displaySearchContent(lat, lng);
}

function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject); // succes, error
    });
}

// init();



// 검색 기능 모음
const body = document.querySelector('body');
const searchInMenu = document.querySelector('.searchContent .search-container input');
const searchInMap = document.querySelector('.interaction-container .search-container input');
const categoryList = document.querySelectorAll('.category');


const searchListState = (stateCheck)();
const autoCompleteState = (stateCheck)();
const historyState = (stateCheck)();

function categorySearch(event) {
    console.log("카테고리를 눌렀습니다. 해당 카테고리로 주변 탐색을 실행합니다.");
    let places = new kakao.maps.services.Places();
    let categoryCode = event.currentTarget.getAttribute('data-categoryCode');
    let lat = map.getCenter()._lat;
    let lng = map.getCenter()._lng;
    let location = new kakao.maps.LatLng(lat, lng);

    // 카테고리 검색 결과를 받을 콜백 함수
    let callback = function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            removeMarker();
            result.forEach(data => {
                createMarker(data);
            })
            setMarkerEvent();
        }
    };
    // 공공기관 코드 검색, 찾은 placeList는 callback으로 전달한다.
    places.categorySearch(categoryCode, callback, {
        location: location,
        size: SEARCH_DATA_LENGTH
    });
}

function setMarkerEvent() {
    const markerDivs = document.querySelectorAll('.marker-container');
            
    for(let i = 0; i < markerDivs.length; i++){
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

            const menuContentContainer = document.querySelector('.menuContent-container');
            const searchContent = menuContentContainer.querySelector('.searchContent');
            const infoContainer = searchContent.querySelector('.info-container');
           

            menuContentContainer.classList.add("menuContent-container-active");
            curve.classList.remove('hide');

            setTimeout(() => {
                curve.style.opacity = "1";
                curve.style.transform = "translateX(-5px)";
            }, 1);

            searchContent.classList.remove('hide');
            infoContainer.classList.remove('hide');
            setInfoContainer(markers[i].info);
        })
    }
}
const categoryValue = (valueCheck)();

function setInfoContainer(data) {
    const infoContainer = document.querySelector('.menuContent-container .searchContent .info-container');

    let name = data.place_name,
        addressName = data.address_name,
        roadAddress = data.road_address_name,
        category = data.category_group_name,
        id = data.id,
        url = data.place_url;

    let imgSrc;
    let imgElement

    // 이미지 없는거
    // 편의점, 마트 , 주차장

    switch(category) {
        case "음식점" : imgSrc = "/assets/img/searchInfo/음식점(사람).jpg"; break; 
        case "카페" : imgSrc = "/assets/img/searchInfo/카페(사람).jpg"; break; 
        case "편의점" : imgSrc = "/assets/img/searchInfo/편의점(장소).jpg"; break; 
        case "대형마트" : imgSrc = "/assets/img/searchInfo/음식점(사람2).jpg"; break; 
        case "숙박" : imgSrc = "/assets/img/searchInfo/숙박.jpg"; break; 
        case "주유소,충전소" : imgSrc = "/assets/img/searchInfo/주유소.jpg"; break; 
        case "주차장" : imgSrc = "/assets/img/searchInfo/카페(사람).jpg"; break; 
        case "문화시설" : imgSrc = "/assets/img/searchInfo/문화시설.jpg"; break; 
        case "관광명소" : imgSrc = "/assets/img/searchInfo/관광명소.jpg"; break; 
        case "병원" : imgSrc = "/assets/img/searchInfo/병원.jpg"; break; 
        case "은행" : imgSrc = "/assets/img/searchInfo/은행.jpg"; break; 
        case "약국" : imgSrc = "/assets/img/searchInfo/_약국.jpg"; break; 
    }

    switch(category) {
        case "음식점" :  
        case "숙박" : 
        case "주유소,충전소" : 
        case "관광명소" : 
        case "은행" : imgElement = `<div class="img-container">
                                        <img class="infoImage size" src=${imgSrc}>
                                        <div class="button"><span><i class="fa-solid fa-xmark"></i></span></div>
                                    </div>`;
                      break;
        
        case "카페" : 
        case "편의점" : 
        case "대형마트" : 
        case "주차장" : 
        case "문화시설" : 
        case "병원" : 
        case "약국" : imgElement = `<div class="img-container">
                                        <img class="infoImage" src=${imgSrc}>
                                        <div class="button"><span><i class="fa-solid fa-xmark"></i></span></div>
                                    </div>`;
                      break;

    }

    // let imgElement = `<div class="img-container">
    //                     <img class="infoImage" src=${imgSrc}>
    //                     <div class="button"><span><i class="fa-solid fa-xmark"></i></span></div>
    //                     </div>`

    let element = `<div class="info-box">
                    <div class="infoName">${name}</div>
                    <div class="infoCategory">${category}</div>
                   </div>`;

    if(categoryValue.getValue() !== category) {
        while(infoContainer.hasChildNodes()) infoContainer.removeChild(infoContainer.firstChild);
        categoryValue.setValue(category);
        infoContainer.insertAdjacentHTML('beforeend', imgElement);
    }
    else if(categoryValue.getValue() === category) {
        const infoBox = infoContainer.querySelector('.info-box');
        infoBox.remove();
    }

    infoContainer.insertAdjacentHTML('beforeend', element);

    const button = infoContainer.querySelector('.button');
    button.addEventListener('click', event => {
        infoContainer.classList.add('hide');
    })
}


categoryList.forEach(category => {
    category.addEventListener('click', event => {
       categorySearch(event);
    });
});

searchInMap.addEventListener('keyup', e => {
    if (e.keyCode === 13) enterKey();
    else if (e.keyCode === 38) {
        if (searchListState.value() === true) upKey();
    }
    else if (e.keyCode === 40) {
        if (searchListState.value() === true) downKey();
    }
    else if (e.isComposing === false) return; //엔터키 중복입력을 막는다.
})

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
    })
})

searchInMap.addEventListener('click', e => {
    console.log("포커스");
    displaySearchList(true);
    if(searchInMap.value === "") setHistory();
})

body.addEventListener('click',e => {
    const container = document.querySelector('.interaction-container .search-container');
    
    if(e.target === searchInMap) return;
    if(e.target === container) return;
    if(e.target.parentNode === container) return;
    if(e.target.parentNode.parentNode === container) return;
    if(e.target.parentNode.parentNode.parentNode === container) return;

    displaySearchList(false);
})


function getJsonAddr(keyword) {
    // console.log("주소 데이터로부터 자동완성단어를 찾습니다. 검색어 : ", keyword);
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

function getJsonData(keyword) {
    // console.log("제이슨 데이터로부터 자동완성단어를 찾습니다. 검색어 : ", keyword);
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

function search(keyword) {
    Promise.all([searchByAddr(keyword), searchByKeyword(keyword)])
    .then(data => {
        console.log(data);
        if (data[0].length !== 0) {
            panTo(data[0][0].y, data[0][0].x);
            removeMarker();
            data[0].forEach(data => {
                console.log(data);
                createMarker(data);
            });
            setMarkerEvent();
        }
        else if (data[0].length === 0 && data[1].length !== 0 ) {
            panTo(data[1][0].y, data[1][0].x);
            removeMarker();
            data[1].forEach(data => {
                console.log(data);
                createMarker(data);
            });
            setMarkerEvent();
        }
        else if (data[0].length === 0 && data[1].length === 0) { // 주소데이터, 키워드데이터 둘다 없다면
            alert('검색 결과가 없습니다.');
        }
    })
}

function searchByAddr(addr) {
    // 카카오 검색
    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    let placeList = new Promise((resolve, reject) => {
        geocoder.addressSearch(addr, (result, status) => {
            // 정상적으로 검색이 완료됐으면 
            if (status === kakao.maps.services.Status.OK) {
                console.log("주소로 검색 결과 : ", result);
                resolve(result);
            } else {
                console.log("검색 실패 주소가 아닙니다. reulst는 공백입니다.");
                resolve(result);
            }
        }, {
            size: SEARCH_DATA_LENGTH
        });
    })
    return placeList;
}

function searchByKeyword(keyword) {
    console.log("키워드로 검색 실행 , 검색어 :", keyword);
    const lat = map.getCenter()._lat;
    const lng = map.getCenter()._lng;

    let placeList = fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?y=${lat}&x=${lng}&radius=${RADIUS.LV4}&query=${keyword}&size=${SEARCH_DATA_LENGTH}`, {
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

function displaySearchList(isTrue) {
    const searchList = document.querySelector('.interaction-container .searchList');
    
    if(isTrue) {
        searchList.classList.remove('hide');
        searchListState.true();
    }
    else {
        searchList.classList.add('hide');
        searchListState.false();
    }
}

function setHistory() {
    let historyArr = ["아차산","구의동","롯데리아"];
    historyArr = [];
    const searchList = document.querySelector('.interaction-container .searchList');

    while(searchList.hasChildNodes()) searchList.removeChild(searchList.firstChild);
    
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

function setAutoComplete(data) {
    const searchList = document.querySelector('.interaction-container .searchList');

    while(searchList.hasChildNodes()) searchList.removeChild(searchList.firstChild);
    data.forEach(data => {
        let element = `<div class="autoComplete">
                            <i class="fa-solid fa-location-dot"></i><span>${data}</span>
                        </div>`;
        searchList.insertAdjacentHTML('beforeend', element);
    });

    const autoCompleteList = document.querySelectorAll('.autoComplete');

    autoCompleteList.forEach(autoComplete => {
        autoComplete.addEventListener('click', event => {
            const span = autoComplete.querySelector('span');
            search(span.innerText);
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

function enterKey() {
    search(searchInMap.value);
    displaySearchList(false);
} 

function upKey() {
    const searchList = document.querySelector('.interaction-container .searchList');
    let standardChild = searchList.lastElementChild;

    if(standardChild.classList.contains('no-history')) return;
    
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
    console.log(standardChild.innerText);
    console.log(standardChild.innerHTML);
    console.log(standardChild.textContent);
    searchInMap.value = standardChild.innerText;
}

function downKey() {
    const searchList = document.querySelector('.interaction-container .searchList');
    let standardChild = searchList.firstElementChild;

    if(standardChild.classList.contains('no-history')) return;
    
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

// 메뉴 컨텐츠의 닫기버튼(곡선)
curvePath.addEventListener('click', () => {
    const menuContentContainer = document.querySelector('.menuContent-container');
    menuContentContainer.classList.remove("menuContent-container-active");
    curve.style.transform = "translateX(5px)";
    curve.style.opacity = "0";
    setTimeout(() => {
        curve.classList.add('hide');
    }, 200);
});

curveI.addEventListener('click', () => {
    const menuContentContainer = document.querySelector('.menuContent-container');
    menuContentContainer.classList.remove("menuContent-container-active");
    curve.style.transform = "translateX(5px)";
    curve.style.opacity = "0";
    setTimeout(() => {
        curve.classList.add('hide');
    }, 200);
});

// 메뉴의 아이콘 관련 이벤트들
menuIcons.forEach((icon, index) => {
    icon.addEventListener('click', () => {
        let height = 70;
        curve.style.top = index * 100 + height + "px"
    });
});

/**
 * 마커 클릭시 상세정보를 보여줘
 * 보여주는 공간을 만드는건 했어 (infoContainer)
 * 클릭시 메뉴의 검색 컨텐츠가 열리게 해야돼
 */

menuCircles.forEach(((circle, index) => {
    circle.addEventListener('click', () => {
        const menuContentContainer = document.querySelector('.menuContent-container');
        let searchContainer = menuContentContainer.querySelector('.search-container');
        let divs = document.querySelectorAll('.menuContent-container > div');
        
        menuContentContainer.classList.add("menuContent-container-active");
        curve.classList.remove('hide');

        setTimeout(() => {
            curve.style.opacity = "1";
            curve.style.transform = "translateX(-5px)";
        }, 1);

        for (let i = 0; i < divs.length; i++) {
            if (i === index) divs[i].classList.remove('hide');
            else divs[i].classList.add('hide');
        }
    });
}));

// 지도상의 카테고리의 기타카테고리 관련 이벤트
etcBtn.addEventListener('mouseenter', () => {
    etcContainer.classList.remove('hide');
    etcBtn.style.background = "rgba(0, 0, 0, 0.02)";
    etcBtn.style.color = "var(--cacaoBlue)";
});

etcContainer.addEventListener('mouseleave', () => {
    etcContainer.classList.add('hide');
    etcBtn.style.backgroundColor = "white";
    etcBtn.style.color = "black";
});

