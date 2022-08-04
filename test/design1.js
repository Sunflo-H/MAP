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

function init() {
    getUserLocation()
        .then(data => {
            let lat = data.coords.latitude; // 위도 (남북)
            let lng = data.coords.longitude; // 경도 (동서)
            console.log(lat, lng);
            getWeather(lat, lng);
            reverseGeocoding(lat, lng)
                .then(data => {
                    let currentLocation = data.v2.address.roadAddress; // 현재 위치
                    if (currentLocation === '') currentLocation = data.v2.address.jibunAddress; // 도로명주소가 없으면 지번주소로

                    displayMap(currentLocation); // 현재 위치를 중심으로 맵을 표시합니다.
                });
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
            // dustDiv.innerHTML = `<div><span>초미세먼지</span><span class="fineDust">${fineDust}</span></div>
            //                      <div><span>미세먼지</span><span class="yellowDust">${yellowDust}</span></div>`

            // switch(fineDust) {
            //     case "좋음" : document.querySelector('.fineDust').style.background = "#2359c4"; break;
            //     case "보통" : document.querySelector('.fineDust').style.background = "#01b56e"; break;
            //     case "나쁨" : document.querySelector('.fineDust').style.background = "#f5c932"; break;
            //     case "매우나쁨" : document.querySelector('.fineDust').style.background = "#da3539"; break;
            // }
            // switch(yellowDust) {
            //     case "좋음" : document.querySelector('.yellowDust').style.background = "#2359c4"; break;
            //     case "보통" : document.querySelector('.yellowDust').style.background = "#01b56e"; break;
            //     case "나쁨" : document.querySelector('.yellowDust').style.background = "#f5c932"; break;
            //     case "매우나쁨" : document.querySelector('.yellowDust').style.background = "#da3539"; break;
            // }
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
            resolve(response)
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

function displayMap(address) {
    const mapDiv = document.querySelector('.map'); // 지도를 표시할 div
    geocoding(address)
        .then(data => {
            let addressInfo = data.v2.addresses;
            let lat = addressInfo[0].y,
                lng = addressInfo[0].x,
                jibunAddress = addressInfo[0].jibunAddress,
                roadAddress = addressInfo[0].roadAddress;

            console.log(lat, lng);
            let mapOption = {
                center: new Tmapv2.LatLng(lat, lng), // 지도 초기 좌표
                zoom: 17
            };

            console.log("현재 위치를 중심으로 맵을 띄웁니다.", address);
            // 지도 생성
            map = new Tmapv2.Map(mapDiv, mapOption);

            // 지도 생성후 사용되는 함수들
            setCurrentLocation();

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
            // "지도가 움직일 때", 또는 "center가 바뀔때" 같은 이벤트리스너 생성
            // 이럴 때마다 setCurrentLocation(); 함수 실행
        });
}



function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject); // succes, error
    });
}

init();

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

