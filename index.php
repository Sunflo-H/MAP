<?php
echo "hi";
?>

<?php
  $client_id = "bZA4grjuBMgjKsG04Hm8";
  $client_secret = "aziZGF4Q1W";
  $encText = urlencode("네이버오픈API");
  $chulbal = "아차산빌라";
  $dochac = "롯데리아";
//   $url = "https://openapi.naver.com/v1/search/blog.xml?query=".$encText; // json 결과
  $url = "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=".$chulbal."&goal=".$dochac;
  $is_post = false;
  $ch = curl_init();
  $headers = array();
  $headers[] = "X-NCP-APIGW-API-KEY-ID: ".$client_id;
  $headers[] = "X-NCP-APIGW-API-KEY: ".$client_secret;

  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_POST, $is_post);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
  $response = curl_exec ($ch);
  $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  
  echo "status_code:".$status_code;
  
  echo "<br>";

  curl_close ($ch);
  if($status_code == 200) {
    echo $response."<br>";
  } else {
    echo "Error 내용:".$response;
  }
?>

