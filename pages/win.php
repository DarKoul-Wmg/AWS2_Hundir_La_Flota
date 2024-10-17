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
//si el POST viene de game.php, mantener la variable en una sesión, pero si el POST viene de win.php no machacar la variable con un NULL
if($_POST["score"] != NULL):
    $_SESSION["score"] = $_POST["score"];
endif;

echo '<p class="winScoreTitle">Puntuació: ',$_SESSION["score"],'</p>';

$playerName = $_POST["playerName"];
$date = date('Y-m-d h:i:s', time());
$array = [$playerName, $_SESSION["score"], $date];

//si tenemos playerName válido, registramos record en el fichero y dejamos de mostrar el form para evitar múltiples registros
if($playerName != NULL && strlen($playerName) >= 3):
    $file = fopen('../sources/ranking.txt', "a");
    $processedLine = implode(',',$array);
    $processedLine .= "\n";
    fwrite($file,$processedLine);
    fclose($file);
else: echo '
<form action="win.php" method="post">
    <input type="text" id="playerName" name="playerName" minlength="3" maxlength="30">
    <input type="submit" value="Registra nom al Hall of Fame" onsubmit="disableRankingReg()">
</form>   
';
endif;
?>
<div class="landingPageCenterButtons">
            <a href="game.php">
                <button type="button" class="landingPageNewGameButton">Nova Partida</button>
            </a>
            <a href="ranking.php?page=1">
                <button type="button" class="landingPageRankingButton">Ranking</button>
            </a>
        </div>
    <script>
        //scrpit simple que impide la entrada de comas en el documento, necesario porque el archivo de ranking separa los valores por comas
        document.addEventListener('keydown', e => {
            if (e.key === ',') {
                e.preventDefault();
                return false;
            }
        })
    </script>
</body>
</html>