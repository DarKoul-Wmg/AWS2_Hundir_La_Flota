<!DOCTYPE html>
<html lang="ca">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trova la petxina</title>
    <link rel="stylesheet" type="text/css" href="style.css?t=<?php echo time();?>"/>
    <script src="game.js"></script>
</head>

<body id="win">
    <!-- FORBIDDEN 403 SI NO VIENE DE GAME.PHP-->
<?php 
session_start();
    // HTTP_REFERER es el encabezado de la pagina (url)
    // verificacion: Si la llamada no viene de game.php o win.php, salta un forbbiden
    if(!isset($_SERVER["HTTP_REFERER"]) || (strpos($_SERVER["HTTP_REFERER"],"game.php")=== false &&
                                            strpos($_SERVER["HTTP_REFERER"],"gameIA.php")=== false &&
                                            strpos($_SERVER["HTTP_REFERER"],"win.php")=== false)){
        header('HTTP/1.1 403 Forbidden');
        echo "<div class ='forbidden'>
            <h1>403 Forbidden</h1>
            <h2>Acces no autoritzat a win.php, accedeix guanyant</h2>
           </div>\n</body>\n</html>";
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


    <img src="images/medusaWin.png" alt="medusa kawaii" class="imagenSalto">
    <img src="images/estrellaWin.png" alt="estrella kawaii" class="imagenGiro">

<!-- Div principal-->
    <div class="winBox">
        <p class="winVictoryMsg">Has guanyat!</p>
<?php
date_default_timezone_set('Europe/Madrid');

                    //condicion                     valorTrue    valorFalse             
$playerName = isset($_SESSION['playerName']) ? $_SESSION['playerName'] : "";  //recupermas nombre de variable de session

$score = isset($_POST["score"]) ? $_POST["score"] : 0;  //recuperamos score

$_SESSION["score"] = $score; //pasar a variable de sesion

//comprobación creada para ver si recibe o no la puntuacion 
// if(isset($_POST["score"])){
//     echo ' entran:'.$_POST["score"];
// }else{
//     echo 'entra nada';
// }

$date = date('Y-m-d h:i:s', time());

echo '<p class="winScoreTitle">Puntuació: ',$_POST["score"],'</p>';
echo '<p class="winScoreDesc">Registra el nom al Hall of fame: </p>';


echo '
<form  action="ranking.php" method="post" onsubmit="easterEgg(event)">
    <input type="text" id="playerName" name="playerName" minlength="3" maxlength="30" value ="',$playerName,'" required>
    <input type="hidden" name="score" value="',$score,'">
    <button type="submit" class="winRegisterButton">Registra</button>
</form>';
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

    <img src="images/conchaWin.png" alt="concha kawaii" class="imagenGiro">
    <img src="images/pulpoWin.png" alt="pulpo kawaii" class="imagenSalto">

    <script>
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