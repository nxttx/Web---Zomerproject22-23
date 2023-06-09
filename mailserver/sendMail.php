<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

function sendMail($from, $fromEmail, $to, $message, $title){
    $mail = new PHPMailer(true);
    try {
        include ('env.php');
        // server settings
        $mail->SMTPDebug = 0;                                       // Enable verbose debug output
        $mail->isSMTP();                                            // Set mailer to use SMTP
        $mail->Host       = $_ENV['MAIL_host'];                    // Specify main and backup SMTP servers
        $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
        $mail->Username   = $_ENV['MAIL_username'];	
        $mail->Password   = $_ENV['MAIL_password'];
        $mail->SMTPSecure = 'ssl';                                  // Enable TLS encryption, `ssl` also accepted
        $mail->Port       = 465;                                    // TCP port to connect to

        //Recipients
        $mail->setFrom($fromEmail, $from);
        $mail->addAddress($to);     // Add a recipient
        // $mail->addReplyTo('', 'Information');
        
        // Content
        $mail->isHTML(true);                                  // Set email format to HTML
        $mail->Subject = $title;
        $mail->Body    = $message;
        $mail->AltBody = $message;

        return $mail->send();
    } catch (Exception $e) {
      return $mail->ErrorInfo;
    }
}




?>