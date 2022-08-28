const axios = require("axios");
const cheerio = require("cheerio");

// axios를 활용해 AJAX로 HTML 문서를 가져오는 함수 구현
async function getHTML() {
  try {
    return await axios.get("https://search.naver.com/search.naver?where=news&sm=tab_jum&query=%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90");
  } catch (error) {
    console.error(error);
  }
}

// getHTML 함수 실행 후 데이터에서
// body > main > div > section > ul > li > article > h2 > a
// 에 속하는 제목을 titleList에 저장
let h = getHTML()
  .then(html => {

    // console.log(html.data);
    let titleList = [];
    const $ = cheerio.load(html.data);
    // ul.list--posts를 찾고 그 children 노드를 bodyList에 저장
    // const bodyList = $("ul.list--posts").children("li.item--post");
    const bodyList = $(".news_tit");
    console.log(bodyList);
    // bodyList를 순회하며 titleList에 h2 > a의 내용을 저장
    bodyList.each(function(i, elem) {
      titleList[i] = {
        title: $(this)
          .find("h2 a")
          .text()
      };
    });
    return titleList;
  })
  .then(res => {
    console.log(res)
    let name = "황병준";
    return name;
  }); // 저장된 결과를 출력

export {h};