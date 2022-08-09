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
const menuCircles = document.querySelectorAll('.menu-circle');
const menuI = document.querySelectorAll('.menu-circle span');
const etcBtn = document.querySelector('.etc-btn');
const etcContainer = document.querySelector('.etc-container');
const menuContentContainer = document.querySelector('.menu-content-container');


let map;
let markers = [];

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



function displayHotRestaurant() {
    let lat = map.getCenter()._lat,
        lng = map.getCenter()._lng;

    // 지금 맵의 중심을 체크해서 
    // lat , lng 확보한후
    // reverseGeocoding을 실행 서울특별시, 동을 얻는다.
    reverseGeocoding(lat, lng, "dong")
        .then(data => {
            let region = data.v2.results[1].region.area1.name;
            let city = data.v2.results[1].region.area2.name;
            const recommendList = document.querySelector('.recommend-lists-container');

            fetch('../data/restaurant/seoul.json')
                .then(res => res.json())
                .then(data => {
                    let restaurantList = data.filter(data => {
                       return (data.지역 === region) && (data.도시명 === city);
                    })
                    restaurantList.forEach((restaurant) => {
                        let element = `<div class="recommend-list-container">
                                            <div><img src=${restaurant.img}></div>
                                            <div>${restaurant.식당상호} <span>${restaurant.음식종류}</span></div>
                                            <div>${restaurant.추천사유}</div>
                                        </div>`
                        recommendList.insertAdjacentHTML('beforeend', element);
                    })
                })
        })
}

function getWeather(lat, lng) {
    console.log("현재 좌표의 날씨정보를 받아옵니다.");
    const weatherDiv = document.querySelector('.location-weather');
    const dustDiv = document.querySelector('.location-dust');

    let apiKey = '2bd8aa9e0a77682baadc650722225f4d',
        units = 'metric' // 섭씨 적용
    let weatherData = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=${units}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            let weather;
            let temp = Math.round(data.main.temp * 10) / 10;
            console.log(data);
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
            resolve(response)
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
                return alert('Something wrong!');
            }
            console.log(response);
            resolve(response);
        }

        naver.maps.Service.reverseGeocode(option, callback);
    })
}

function setCurrentLocation(lat = map.getCenter()._lat, lng = map.getCenter()._lng) {
    reverseGeocoding(lat, lng, "dong")
        .then(data => {
            let dong = data.v2.results[1].region.area2.name + " " + data.v2.results[1].region.area3.name;
            const locationAddress = document.querySelector('.location-address');
            console.log(locationAddress);
            locationAddress.innerText = dong;
        })
}

function displayMap(lat, lng) {
    const mapDiv = document.querySelector('.map'); // 지도를 표시할 div


    console.log(lat, lng);
    let mapOption = {
        center: new Tmapv2.LatLng(lat, lng), // 지도 초기 좌표
        zoom: 17
    };

    console.log("현재 위치를 중심으로 맵을 띄웁니다.", lat, lng);
    // 지도 생성
    map = new Tmapv2.Map(mapDiv, mapOption);
    /**
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
         */
}

//! if promise가 아니라면?
navigator.geolocation.getCurrentPosition(pageSetting);

function pageSetting(result) {
    let lat = result.coords.latitude; // 위도 (남북)
    let lng = result.coords.longitude; // 경도 (동서)
    getWeather(lat, lng);
    지도표시하기(lat, lng); // 지도 생성
    내좌표의주소찾은후주소명을검색카테고리에띄우기(lat, lng);
    마커생성(lat, lng);
    displayHotRestaurant();

    map.addListener('click', (event) => {
        let lat = event.latLng._lat;
        let lng = event.latLng._lng;
        console.log(reverseGeocoding(lat, lng));
    });
}

function 마커생성(lat, lng) {
    let marker = new Tmapv2.InfoWindow();
    // 마커가 어떤 카테고리냐에 따라 아이콘 변경
    let icon = `<i class="fa fa-cutlery">`; // 음식점일때
    let addressName;
    let addressCategory;
    var content = `<div class="marker-container">
                        <div class="marker-icon">${icon}</i></div>
                        <div class="marker-address">
                            <div class="marker-address-name">지금까지 이런 치킨은 없었따. 분식집</div>
                            <div class="marker-address-category">분식집</div>
                        </div>
                        <div class="marker-point"></div>
                    </div>`

    marker = new Tmapv2.InfoWindow({
        position: new Tmapv2.LatLng(lat, lng), //Popup 이 표출될 맵 좌표
        content: content, //Popup 표시될 text
        border: '0px solid #ff0000', //Popup의 테두리 border 설정.
        type: 2, //Popup의 type 설정.
        align: 17,
        background:false,
        offset: new Tmapv2.Point(33, 5),
        map: map //Popup이 표시될 맵 객체
    });
    markers.push(marker);
    console.log(marker.getOffset());
    marker.addListener("click", function (event) {
        console.log("마커 클릭");
    });
}

function 내좌표의주소찾은후주소명을검색카테고리에띄우기(lat, lng) {
    let coords = new naver.maps.LatLng(lat, lng);

    let orderTypes = [
        naver.maps.Service.OrderType.ADDR,
        naver.maps.Service.OrderType.ROAD_ADDR,
        naver.maps.Service.OrderType.ADM_CODE
    ];

    let option = {
        coords: coords,
        orders: orderTypes
    }

    let 주소찾아표시하기 = (status, response) => {
        if (status !== naver.maps.Service.Status.OK) {
            return alert('Something wrong!');
        }
        let dong = response.v2.results[1].region.area2.name + " " + response.v2.results[1].region.area3.name;
        const locationAddress = document.querySelector('.location-address');
        locationAddress.innerText = dong;
    }

    naver.maps.Service.reverseGeocode(option, 주소찾아표시하기);
}

function 지도표시하기(lat, lng) {
    const mapDiv = document.querySelector('.map'); // 지도를 표시할 div

    let mapOption = {
        center: new Tmapv2.LatLng(lat, lng), // 지도 초기 좌표
        zoom: 17
    };
    map = new Tmapv2.Map(mapDiv, mapOption);


}

function 마커클릭후정보를띄우기() {

}



function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject); // succes, error
    });
}

// init();


// 검색 기능
const searchInMenu = document.querySelector('.menu-search-searchBar-container input');
const searchInMap = document.querySelector('.interaction-container .search-container input');

// 엔터키가 눌리면 검색
// 다른키가 눌리면 입력

searchInMap.addEventListener('keyup', e => {
    console.log("키가 눌렸습니다.", e.keyCode);
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
        if (searchInMap.value === '') return;

        const promise1 = getJsonAddr(searchInMap.value);
        const promise2 = getJsonRestaurant(searchInMap.value);
        Promise.all([promise1, promise2]).then(data => {
            //! 이후 검색 데이터가 더 추가되면 그때 relationList에 배열을 합치는 코드를 바꿔주자
            //! 일단 이렇게 두개의 데이터만 두고 짜            
            let relationList = data[0].concat(data[1]).slice(0, 10);
            console.log(relationList);
            // if (relationList.length === 0) {
            //     closeSearchBar();
            // }
            // else {
            //     openSearchBar();
            //     openSearchBar_relation();
            //     openSearchBar_histroy();
            //     displayRelation(relationList);
            //     setHtmlHistory();
            // }
        });
    }
})

// 검색 api를 사용하여 검색후 장소의 이름들을 promise형태 및 배열로 return 하는 함수
function getJsonAddr(keyword) {
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
function getJsonRestaurant(keyword) {
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

function search(keyword) {
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

    let placeList = fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?y=${lat}&x=${lng}&radius=${RADIUS.LV1}&query=${keyword}&size=${SEARCH_DATA_LENGTH}`, {
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


// css style 작업
curvePath.addEventListener('click', () => {
    menuContentContainer.classList.remove("menu-content-container-active");
    curve.style.transform = "translateX(5px)";
    curve.style.opacity = "0";
    setTimeout(() => {
        curve.classList.add('hide');
    }, 200);
});

curveI.addEventListener('click', () => {
    menuContentContainer.classList.remove("menu-content-container-active");
    curve.style.transform = "translateX(5px)";
    curve.style.opacity = "0";
    setTimeout(() => {
        curve.classList.add('hide');
    }, 200);
});

menuIcons.forEach((icon, index) => {
    icon.addEventListener('click', () => {
        let height = 70;
        curve.style.top = index * 100 + height + "px"
    });
});

menuCircles.forEach(((circle, index) => {
    circle.addEventListener('mouseover', () => {
        circle.style.background = "var(--customGreen)";
        circle.style.cursor = "pointer";
    });

    circle.addEventListener('mouseout', () => {
        circle.style.background = "#1b2251";
    });

    circle.addEventListener('click', () => {
        menuContentContainer.classList.add("menu-content-container-active");
        let searchContainer = menuContentContainer.querySelector('.search-container');
        let divs = document.querySelectorAll('.menu-content-container > div');

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

