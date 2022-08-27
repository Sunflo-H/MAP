import requests;
from bs4 import BeautifulSoup;
import pyautogui;

def asd(a,b):
    return a + b
url = "https://finance.naver.com/item/sise.naver?code=005930";
response = requests.get(url);
html = response.text;
soup = BeautifulSoup(html, 'html.parser');
price = soup.select_one("#_nowVal");

print(price.text);
