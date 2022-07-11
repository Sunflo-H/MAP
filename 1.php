<?php
    echo "id : ".$_GET['id']."<br>";
    echo "pwd : ".$_GET['password']."<br>";

    echo "id : ".$_POST['id']."<br>";
    echo "pwd : ".$_POST['password'];

    function hello($name) {
        echo "hi ".$name;
    }

    if($_POST['id']) {
        hello($_POST['id']);
    }
?>