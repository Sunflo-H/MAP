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
const menuContentContainer = document.querySelector('.menuContent-container');

// 전역변수
let map;
let markers = [];
let cityIsChange;
// let searchListIsOpen;
// let autoCompleteIsOpen;
// let historyIsOpen;

const searchListIsOpen = ( function iife() {
    let isOpen;

    return {
        value: function () {
            return isOpen;
        },

        open: function () {
            isOpen = true;
            return isOpen;
        },

        close: function () {
            isOpen = false;
            return isOpen;
        }
    }
})();

const autoCompleteIsOpen = ( function iife() {
    let isOpen;

    return {
        value: function () {
            return isOpen;
        },

        open: function () {
            isOpen = true;
            return isOpen;
        },

        close: function () {
            isOpen = false;
            return isOpen;
        }
    }
})();

const historyIsOpen = ( function iife() {
    let isOpen;

    return {
        value: function () {
            return isOpen;
        },

        open: function () {
            isOpen = true;
            return isOpen;
        },

        close: function () {
            isOpen = false;
            return isOpen;
        }
    }
})();



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
        })
}

function displayMap(lat, lng) {
    const mapDiv = document.querySelector('.map');

    let mapOption = {
        center: new Tmapv2.LatLng(lat, lng),
        zoom: 17
    };

    map = new Tmapv2.Map(mapDiv, mapOption);
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
        // console.log(reverseGeocoding(lat, lng));
    });

    map.addListener('mouseup', (event) => {
        displaySearchContent();
        
    })
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
                    </div>`
    }
    else if(type === "") { // 장소일때
        icon = `<i class="fa-solid fa-location-dot"></i>`; 
        content = `<div class="marker-container">
                        <div class="marker-icon">${icon}</i></div>
                        <div class="marker-address">
                            <div class="marker-address-name">${data.place_name}</div>
                        </div>
                        <div class="marker-point"></div>
                    </div>`
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
                    </div>`
    }
    // 좌표, 마커의 내용(정보), 타입 - 아이콘모양
    let marker = new Tmapv2.InfoWindow();
    

    marker = new Tmapv2.InfoWindow({
        position: new Tmapv2.LatLng(data.y, data.x), //Popup 이 표출될 맵 좌표
        content: content, //Popup 표시될 text
        border: '0px solid #ff0000', //Popup의 테두리 border 설정.
        type: 2, //Popup의 type 설정.
        align: 17,
        background:false,
        offset: new Tmapv2.Point(33, 5),
        map: map //Popup이 표시될 맵 객체
    });
    
    markers.push(marker);
    
    marker.addListener("click", function (event) {
        console.log("마커 클릭");
    });
}

function 마커삭제() {
    markers.forEach(marker => {
        marker.setMap(null);
    })
    markers = [];
}

function panTo(lat, lng) {
    map.panTo(new Tmapv2.LatLng(lat, lng));
}

function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject); // succes, error
    });
}

// init();

// 검색 - 카테고리

// 검색 기능 모음
const body = document.querySelector('body');
const searchInMenu = document.querySelector('.searchContent .search-container input');
const searchInMap = document.querySelector('.interaction-container .search-container input');

console.log(searchInMap);



searchInMap.addEventListener('keyup', e => {
    if (e.keyCode === 13) enterKey();
    else if (e.keyCode === 38) {
        if (searchListIsOpen.value() === true) upKey();
    }
    else if (e.keyCode === 40) {
        if (searchbarIsOpen === true) downKey();
    }
    else if (e.isComposing === false) return; //엔터키 중복입력을 막는다.
})

searchInMap.addEventListener('input', e => {
    
    if (searchInMap.value === '') {
        displayAutoComplete(false);
        displayHistory(true);
        return;
    }

    const promise1 = getJsonAddr(searchInMap.value);
    const promise2 = getJsonData(searchInMap.value);

    Promise.all([promise1, promise2]).then(data => {      
        let result = data[0].concat(data[1]).slice(0, 10);

        if (result.length !== 0) {
            displayAutoComplete(true, result);
            displayHistory(false);
        }
        else {
            displayAutoComplete(false);
            displayHistory(true);
        }
    })
})

searchInMap.addEventListener('focus', e => {
    console.log("포커스");
    displaySearchList(true);
    if(searchInMap.value === "") displayHistory(true);
})

body.addEventListener('click',e => {
    const container = document.querySelector('.interaction-container .search-container');
    
    if(e.target === searchInMap) return;
    if(e.target === container) return;
    if(e.target.parentNode === container) return;
    if(e.target.parentNode.parentNode === container) return;
    if(e.target.parentNode.parentNode.parentNode === container) return;
    
    console.log("바디를 클릭했습니다.");
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
            마커삭제();
            data[0].forEach(data => {
                console.log(data);
                createMarker(data);
            })
        }
        else if (data[0].length === 0 && data[1].length !== 0 ) {
            panTo(data[1][0].y, data[1][0].x);
            마커삭제();
            data[1].forEach(data => {
                console.log(data);
                createMarker(data);
            })
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
    
    const container = document.querySelector('.interaction-container .searchList');
    
    if(isTrue) {
        container.classList.remove('hide');
        searchListIsOpen.open();
    }
    else {
        container.classList.add('hide');
        searchListIsOpen.close();
    }
}

function displayAutoComplete(isTrue, result) {
    const container = document.querySelector('.interaction-container .searchList');
    const autoCompleteList = container.querySelector('.interaction-container .autoCompleteList');

    if(isTrue){
        autoCompleteList.classList.remove('hide');
        
        while(autoCompleteList.hasChildNodes()) autoCompleteList.removeChild(autoCompleteList.firstChild);
        
        result.forEach((data, i) => {
            let element = `<div class="autoComplete">
                            <i class="fa-solid fa-location-dot"></i> 
                            <span>${data}</span>
                            </div>`;
            autoCompleteList.insertAdjacentHTML('beforeend', element);
        })

        // autoComplete 생성후 클릭이벤트 적용
        const autoComplete = document.querySelectorAll('.autoComplete');
        autoComplete.forEach((autoComplete) => {
            autoComplete.addEventListener('click', e => {
                let keyword = e.currentTarget.lastElementChild.innerText;
                search(keyword);
            })
        })
    }
    else {
        autoCompleteList.classList.add('hide');
    }
}

function displayHistory(isTrue){
    const container = document.querySelector('.interaction-container .searchList');
    const historyList = container.querySelector('.interaction-container .historyList');

    if(isTrue) historyList.classList.remove('hide');
    else historyList.classList.add('hide');
}

function enterKey() {
    search(searchInMap.value);
    displaySearchList(false);
}

function upKey() {
    const autoCompleteList = document.querySelector('.autoCompleteList');
    console.log(autoCompleteList);
    let activeChild = autoCompleteList.lastElementChild;
    let isActive = false;
    console.log(activeChild);

    for (let i = 0; i < autoCompleteList.childElementCount; i++) {
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

// 메뉴 컨텐츠의 닫기버튼(곡선)
curvePath.addEventListener('click', () => {
    menuContentContainer.classList.remove("menuContent-container-active");
    curve.style.transform = "translateX(5px)";
    curve.style.opacity = "0";
    setTimeout(() => {
        curve.classList.add('hide');
    }, 200);
});

curveI.addEventListener('click', () => {
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

menuCircles.forEach(((circle, index) => {
    circle.addEventListener('click', () => {
        menuContentContainer.classList.add("menuContent-container-active");
        let searchContainer = menuContentContainer.querySelector('.search-container');
        let divs = document.querySelectorAll('.menuContent-container > div');

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

