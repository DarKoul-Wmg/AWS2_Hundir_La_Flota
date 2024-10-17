<!DOCTYPE html>
<html lang="ca">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Troba la petxina</title>
    <link rel="stylesheet" type="text/css" href="style.css" />
</head>

<body id="win">
    <audio id="sonidoEE">
        <source src="sounds/ee.mp3" type="audio/mpeg">
        Sonido no habilitado
    </audio>
    <div class="winBox">
        <p class="winVictoryMsg">Has guanyat!</p>
<?php
date_default_timezone_set('Europe/Madrid');
session_start();
//si el POST viene de game.php, mantener la variable en una sesión, pero si el POST viene de win.php no machacar la variable con un NULL
if($_POST["score"] != NULL):
    $_SESSION["score"] = $_POST["score"];
endif;

echo '<p class="winScoreTitle">Puntuació: ',$_SESSION["score"],'</p>';
echo '<p class="winScoreDesc">Registra el nom al Hall of fame: </p>';
$playerName = $_POST["playerName"];
$date = date('Y-m-d h:i:s', time());
$array = [$playerName, $_SESSION["score"], $date];

//si tenemos playerName válido, registramos record en el fichero y dejamos de mostrar el form para evitar múltiples registros
if($playerName != NULL && strlen($playerName) >= 3):
    $file = fopen('ranking.txt', "a");
    $processedLine = implode(',',$array);
    $processedLine .= "\n";
    fwrite($file,$processedLine);
    fclose($file);
else: echo '
<form action="win.php" method="post" onsubmit="return easterEgg(event)">
    <input type="text" id="playerName" name="playerName" minlength="3" maxlength="30">
    <input type="submit" class="winRegisterButton" value="Registra">
</form>   
';
endif;
?>
        <div class="winCenterButtons">
            <a href="index.php" class="winHomeBtnLink">
                <button type="button" class="winNewGameButton">Inici</button>
            </a>
            <a href="ranking.php?page=1">
                <button type="button" class="winRankingButton">Ranking</button>
            </a>
        </div>
    </div>

    <script>
        function easterEgg(event) {
            event.preventDefault(); // Evita el envío inmediato del formulario

            var playerName = document.getElementById("playerName").value;
            var audio = document.getElementById("sonidoEE");

            // Compara el nombre de usuario
            if (playerName.toLowerCase() === 'sirxavio') {
                console.log("Nombre de usuario especial detectado. Reproduciendo sonido...");
                audio.play();  // Reproduce el sonido si el nombre es 'sirxavio'

                // Espera a que termine el sonido 8s
                setTimeout(function() {
                    document.querySelector('form').submit();  // Envía el formulario tras el retraso
                }, 8000); 

                return false; // Detiene el envío hasta que pase el tiempo
            } else {
                document.querySelector('form').submit();
                return true; // Si no es el nombre especial, envía el formulario normalmente
            }
        }    
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