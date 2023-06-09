<?php
include ('sendMail.php');

// get get variables
$to = $_GET['to'];
$subject = "Je login code voor Zomerproject";
$code = $_GET['code'];

$message = "
Hoi gebruiker,<br> <br>

Je probeert in te loggen op de Zomerproject website. Om in te loggen heb je een code nodig. Deze code is: <br><br>" . $code . " <br> <br>

Deel deze code met niemand! Als je deze code niet hebt aangevraagd, negeer dan deze mail. <br> <br>

Met vriendelijke groet, <br>
Het Zomerproject team
";


// send mail
$result = sendMail("Authentication - Zomerproject", "auth.zomerproject@foxels.nl",$to, $message, $subject);
if($result === true){
    echo "{\"status\": \"success\"}";
}else{
    echo "{\"status\": \"failed\", \"error\": \"" . $result . "\"}";
}
?>