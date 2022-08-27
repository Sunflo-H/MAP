import requests;
from bs4 import BeautifulSoup;
import pyautogui;


keyword = pyautogui.prompt("검색어를 입력하세요>>>");
lastPage = pyautogui.prompt("몇페이지까지 볼까?");
pageNum = 1;
for i in range(1, int(lastPage) * 10, 10):
    print(f"{pageNum}페이지 입니다.=====================================");
    response = requests.get(f"https://search.naver.com/search.naver?where=news&sm=tab_jum&query={keyword}&sort=0&photo=0&field=0&pd=0&ds=&de=&cluster_rank=30&mynews=0&office_type=0&office_section_code=0&news_office_checked=&nso=so:r,p:all,a:all&start={i}");
    html = response.text;
    soup = BeautifulSoup(html, 'html.parser');
    links = soup.select(".news_tit");
    
    for link in links:
        title = link.text # 태그 안에 텍스트요소를 가져온다.
        url = link.attrs['href']; # href의 속성값을 가져온다.
        print(title, url);

    pageNum = pageNum + 1;
