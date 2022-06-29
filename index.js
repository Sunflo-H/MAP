const clientId = '52MEPfyQEOsllY4hi_HX';
const clientSecret = 'aHihsv5B0Q';

const url = "https://openapi.naver.com/v1/search/local.json?query='서울'&display=10&start=1&sort=random"

fetch(url, {
    headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret, 
    }
})

console.log(location.href);