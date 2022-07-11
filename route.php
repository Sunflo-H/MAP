<?php
  $client_id = "es0epxrzju";
  $client_secret = "lNKSzmkBdielGL26PjmWaKhpaCgz9wBVXMhyy0Ou";
  $url = "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=127.1058342,37.359708&goal=129.075986,35.179470&option=trafast";
  $is_post = false;
  $ch = curl_init();
  $headers = ["X-NCP-APIGW-API-KEY-ID: ".$client_id, "X-NCP-APIGW-API-KEY: ".$client_secret];

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

