<!DOCTYPE html>
<html lang="ca">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trova la petxina</title>
    <link rel="stylesheet" type="text/css" href="style.css" />
    <script src="game.js"></script>
</head>

<body id="lose">
<?php 
session_start();
    // HTTP_REFERER es el encabezado de la pagina (url)
    // verificacion: Si la llamada no viene de game.php o win.php, salta un forbbiden
    if(!isset($_SERVER["HTTP_REFERER"]) || (strpos($_SERVER["HTTP_REFERER"],"game.php")=== false &&
                                            strpos($_SERVER["HTTP_REFERER"],"gameIA.php")=== false &&
                                            strpos($_SERVER["HTTP_REFERER"],"lose.php")=== false)){
        header('HTTP/1.1 403 Forbidden');
        echo "<div class ='forbidden'>
            <h1>403 Forbidden</h1>
            <h2>Acces no autoritzat a lose.php, accedeix perdent</h2>
          </div>\n</body>\n</html>"; // Muestra un mensaje
    exit; // Termina el script
    }
?>
    <!-- Aud  -->
    <audio id="sonidoAccion">
        <source src="sounds/action.mp3" type="audio/mpeg">
        Sonido no habilitado
    </audio>
<!-- Sonidos para easter egg-->
    <audio id="sonidoEE">
        <source src="sounds/ee.mp3" type="audio/mpeg">
        Sonido no habilitado
    </audio>
    <audio id="sonidoEE2">
        <source src="sounds/ee2.mp3" type="audio/mpeg">
        Sonido no habilitado
    </audio>
    <audio id="sonidoLose">
        <source src="sounds/lose2.mp3" type="audio/mpeg">
        Sonido no habilitado
    </audio>
    <!-- Capa de overlay para que el background pille el filtro B/N  -->
    <div class="overlay"></div>

    <img src="/images/pulpoLose.png" alt="medusa dead" class="imagenSalto">
    <img src="/images/conchaLose.png" alt="estrella dead" class="imagenGiro">

<!-- Div principal-->
    <div class="loseBox">
        <p class="loseMsg">Has perdut!</p>
<?php
date_default_timezone_set('Europe/Madrid');

                    //condicion                     valorTrue    valorFalse             
$playerName = isset($_SESSION['playerName']) ? $_SESSION['playerName'] : "";  //recupermas nombre de variable de session

$score = $_POST['score'];  //recuperamos score

$date = date('Y-m-d h:i:s', time());

echo '<p class="loseScoreTitle">Puntuació: ',$score,'</p>';
echo '<p class="loseScoreDesc">Registra el nom al Hall of fame: </p>';

// Si se ha enviado el formulario, guardar en el archivo y redirigir a ranking
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST["playerName"])) {
    $playerName = $_POST["playerName"]; // obtener el playerName del formulario

    $_SESSION['playerName'] = $playerName; //actualizamos variable de nombre (para ranking)
    $_SESSION['lastDate'] =  $_SESSION['lastDate'] = $_SESSION['lastDate'] = date("d-m-Y H:i", strtotime($date)); //ultima partida realizada (para highlight de ranking)
    
    
    if (strlen($playerName) >= 3 && strlen($playerName) <= 30){
        $array = [$playerName, $score, $date]; // datos para insertar en txt
        
        // Guardar en el archivo
        $file = fopen('ranking.txt', "a");
        $processedLine = implode(',', $array) . "\n"; 
        fwrite($file, $processedLine); 
        fclose($file); 

        // Redirigir a ranking.php
        header("Location: ranking.php?");
        exit; // Terminar el script
    }
    
}

echo '
<form  action="lose.php" method="post" onsubmit="easterEgg(event)">
    <input type="text" id="playerName" name="playerName" minlength="3" maxlength="30" value ="',$playerName,'" required>
    <input type="hidden" name="score" value="',$score,'">
    <button type="submit" class="loseRegisterButton">Registra</button>
</form>   
';

?>
        <div class="loseCenterButtons">
            <a href="index.php" class="loseHomeBtnLink">
                <button type="button" class="loseNewGameButton">Inici</button>
            </a>
            <a href="ranking.php?page=1">
                <button type="button" class="loseRankingButton">Ranking</button>
            </a>
        </div>
    </div>

    <img src="/images/estrellaLose.png" alt="concha dead" class="imagenGiro">
    <img src="/images/medusaLose.png" alt="pulpo dead" class="imagenSalto">

    <script>
        //Script para reproducir el sonido nada mas entrar en la pagina
        function loseSound(){  
            var audio = document.getElementById("sonidoLose");
            console.log("Sonido de derrota");
            audio.play();
        }

        function easterEgg(event) {
            event.preventDefault(); // Evita el envío inmediato del formulario

            var playerName = document.getElementById("playerName").value;
            var audio = document.getElementById("sonidoEE");
            var audio2 = document.getElementById("sonidoEE2");

            // Compara el nombre de usuario
            if (playerName.toLowerCase() === 'xavi') {
                console.log("Nombre de usuario especial detectado. Reproduciendo sonido...");
                audio.play();  // Reproduce el sonido 

                // Espera a que termine el sonido 8s
                setTimeout(function() {
                    document.querySelector('form').submit();  // Envía el formulario tras el retraso
                }, 8000); 

                return false; // Detiene el envío hasta que pase el tiempo

            } else if(playerName.toLowerCase() === 'jhin') {
                console.log("Nombre de usuario especial detectado2. Reproduciendo sonido...");
                audio2.play();  // Reproduce el sonido 

                // Espera a que termine el sonido 8s
                setTimeout(function() {
                    document.querySelector('form').submit();  // Envía el formulario tras el retraso
                }, 8000);

                return false; 
            } else {
                document.querySelector('form').submit();
                return true; // Si no es el nombre especial, envía el formulario normalmente
            }
        }

        //Script para que cargue el sonido una vez cargue el DOM
        window.onload = function(){
            loseSound();
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