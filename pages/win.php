<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Troba la petxina</title>
</head>
<body id="win">
<p class="winVictoryMsg">Has guanyat!</p>

<?php
session_start();

if($_POST["score"] != NULL):
    $_SESSION["score"] = $_POST["score"];
endif;

echo '<p>Puntuació: ',$_SESSION["score"],'</p>';

$playerName = $_POST["playerName"];
$date = date('Y-m-d h:i:s', time());
$array = [$playerName, $_SESSION["score"], $date];
if($playerName != NULL):
    $file = fopen('../sources/ranking.txt', "a");
    $processedLine = implode(',',$array);
    $processedLine .= "\n";
    fwrite($file,$processedLine);
    fclose($file);
endif;
?>
    <form action="win.php" method="post">
        <input type="text" id="playerName" name="playerName">
        <input type="submit" onclick="endgamePoints()" value="Registra nom al Hall of Fame"> 
    </form>   
</body>
</html>