
/**
 * 주소로검색, 키워드로검색 두 함수를 한번에 사용하여 검색한다.
 * @param {*} keyword 입력한 단어
 * @returns 두 검색방법으로 찾은 데이터
 */
 function search(keyword) {
    let data = Promise.all([searchByAddr(keyword), searchByKeyword(keyword)])
                .then(data => data);
    console.log(data);
    return data;
}

/**
 * 주소로 검색하여 장소(주소)에 대한 정보를 얻는다.
 * @param {*} addr 검색할 주소 ex)구의동
 * @returns promise [주소데이터1, 주소데이터2 ...]
 */
 function searchByAddr(addr) {
    let placeList = new Promise(resolve => {

        // 주소-좌표 변환 객체를 생성합니다
        let geocoder = new kakao.maps.services.Geocoder();

        const callback = (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                console.log(result);
            }
            resolve(result);
        };

        geocoder.addressSearch(addr, callback, {size: SEARCH_DATA_LENGTH});
    });
    return placeList;
}

/**
 * 키워드로 검색하여 장소(주소)에 대한 정보를 얻는다.
 * @param {*} keyword 검색할 키워드 ex)롯데리아
 * @returns promise [장소데이터1, 장소데이터2, ...]
 */
 function searchByKeyword(keyword) {
    const lat = map.getCenter()._lat;
    const lng = map.getCenter()._lng;

    let placeList = new Promise((resolve, reject) => {
        let places = new kakao.maps.services.Places();

        const getResult = (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                resolve(result);
            }  
        }

        let option = {
            x: lng,
            y: lat,
            radius: RADIUS.LV4,
            size: SEARCH_DATA_LENGTH
        }
        places.keywordSearch(keyword, getResult, option);
    });
    return placeList;
}

/**
 * 좌표로 행정동 주소 정보를 요청합니다. 동까지의 주소 정보를 얻는다.
 * @param {*} lat 위도 y
 * @param {*} lng 경도 x
 * @returns promise [{기본주소(서울 광진구 구의동)}, {상세주소(서울 광진구 구의2동)}]
 */
 function searchAddrFromCoords(lat, lng) {
    let addr = new Promise((resolve, reject) => {
        var geocoder = new kakao.maps.services.Geocoder();

        const getResult = (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                resolve(result);
            }  
        };
    
        geocoder.coord2RegionCode(lng, lat, getResult);         
    });

    return addr;
}

/**
 * 좌표로 법정동 상세 주소 정보를 요청합니다
 * @param {*} lat 위도 y
 * @param {*} lng 경도 x
 * @returns promise [{지번주소, 도로명주소}]
 */
 function searchDetailAddrFromCoords(lat, lng) {
    let detailAddr = new Promise((resolve, reject) => {
        var geocoder = new kakao.maps.services.Geocoder();

        const getResult = (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                resolve(result);
            }  
        };

        geocoder.coord2Address(lng, lat, getResult);        
    });

    return detailAddr;
}

export {search, searchByAddr, searchByKeyword, searchAddrFromCoords, searchDetailAddrFromCoords }