<?php
include ('sendMail.php');

// get get variables
$to = $_GET['to'];
$subject = $_GET['subject'];
$message = $_GET['message'];

// send mail
$result = sendMail("Zomerproject", "Zomerproject@foxels.nl",$to, $message, $subject);
if($result === true){
    echo "{\"status\": \"success\"}";
}else{
    echo "{\"status\": \"failed\", \"error\": \"" . $result . "\"}";
}

?>