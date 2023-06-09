<?php
include ('sendMail.php');

// get get variables
$to = $_GET['to'];
$subject = $_GET['subject'];
$message = $_GET['message'];

// send mail
if(sendMail("Zomerproject", "Zomerproject@foxels.nl",$to, $message, $subject)){
    echo "{status: 'success'}";
}else{
    echo "{status: 'failed'}";
}
?>