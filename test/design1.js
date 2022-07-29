let mapContainer = document.querySelector('#map-container');


function init() {
    getUserLocation()
    .then(data => {
        let lat = data.coords.latitude; // 위도 (남북)
        let lng = data.coords.longitude; // 경도 (동서)
        
        // getWeather(lat, lng)
        reverseGeocoding(lat, lng)
        .then(data => {
            let currentLocation = data.v2.address.roadAddress; // 현재 위치
            if(currentLocation === '') currentLocation = data.v2.address.jibunAddress; // 도로명주소가 없으면 지번주소로
            
            // setCurrentLocation(currentLocation); // 현재 위치 정보를 세팅합니다.
            displayMap(currentLocation); // 현재 위치를 중심으로 맵을 표시합니다.
            
        })
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
        naver.maps.Service.geocode({ query: address}, callback);
    })
}

function reverseGeocoding(lat, lng) {
    return new Promise (resolve => {
        let coords = new naver.maps.LatLng(lat, lng);
        let option = {
            coords: coords,
            orders: [
                naver.maps.Service.OrderType.ADDR,
                naver.maps.Service.OrderType.ROAD_ADDR
            ]
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

function displayMap(address) {
    const mapContainer = document.getElementById('map'); // 지도를 표시할 div
    geocoding(address)
    .then(data => {
        let addressInfo = data.v2.addresses;
        let lat = addressInfo[0].y,
            lng = addressInfo[0].x,
            jibunAddress = addressInfo[0].jibunAddress,
            roadAddress = addressInfo[0].roadAddress;

        console.log(lat, lng);
        let mapOption = {
            center : new Tmapv2.LatLng(lat, lng), // 지도 초기 좌표
            // width : "98%", // map의 width 설정
            // height : "98%", // map의 height 설정	
            zoom : 17
        };
        
        console.log("현재 위치를 중심으로 맵을 띄웁니다.", address);
        map = new Tmapv2.Map(mapContainer, mapOption);
        
        //tmap 클릭 이벤트
        map.addListener('click', function onClick(event){
                let lat = event.latLng._lat;
                let lng = event.latLng._lng;
                console.log(reverseGeocoding(lat,lng));
        });
        // 지도에 마커 생성
        // createMarkerByCoords(lat, lng);
    });
}

function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject); // succes, error
    });
}

init();

// css style 작업

const border = document.querySelector('.border');
const menuIcons = document.querySelectorAll('.menu-icon');
const menuCircles = document.querySelectorAll('.menu-circle');
const menuI = document.querySelectorAll('.menu-circle span');
const etcBtn = document.querySelector('.etc-btn');
const etcContainer = document.querySelector('.etc-container');
const menuContentContainer = document.querySelector('#menu-content-container'); 

border.addEventListener('click', () => {
    menuContentContainer.classList.remove("menu-content-container-active");
});

menuIcons.forEach((icon,index) => {
    icon.addEventListener('click', () => {
        let height = 70;
        border.style.top= index * 100 + height + "px"
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
         let divs = document.querySelectorAll('#menu-content-container > div');
         console.log(divs[index]);
         console.log(divs.length);
         for(let i = 0; i<divs.length; i++) {
            if(i === index) divs[i].classList.remove('hide');
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

