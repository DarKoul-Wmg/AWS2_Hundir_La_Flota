<!DOCTYPE html>
<html lang="ca">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Troba la petxina</title>
    <link rel="stylesheet" type="text/css" href="style.css" />
    <script src="game.js"></script>
</head>

<body id="index" class="landingPageBody">
    <noscript>
        <div class="noscript-overlay">
            <div class="noscript-warning">
                <p>JavaScript está deshabilitado en tu navegador. Activa JavaScript para poder jugar.</p>
            </div>
        </div>
        <style>
            /* Superposición de fondo opaco que cubre toda la pantalla */
            .noscript-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                /* Fondo negro con opacidad */
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                /* Asegura que esté encima de todo */
            }

            /* Estilo del mensaje centrado */
            .noscript-warning {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
                /* Sombra para destacar */
                font-size: 22px;
                font-weight: bold;
                color: red;
                text-align: center;
            }

            /* Ocultar el contenido principal del juego cuando JavaScript está desactivado */
            .main {
                display: none;
            }
        </style>
    </noscript>

    <audio id="sonidoAccion">
        <source src="sounds/action.mp3" type="audio/mpeg">
        Sonido no habilitado
    </audio>

    <div class="landingPageBox">
        <p class="landingPageTitle">Troba la petxina</p>
        <p class="landingPageDescription">
            Troba totes les petxines com més aviat millor!
        </p>

        <?php
    // Crear sesión y guardar el nombre del jugador en una variable de sesión
    session_start();

    if(isset($_POST["playerName"])){ //si tenemos nombre registrado, mostrar botones de juego activos
        $_SESSION["playerName"] = $_POST["playerName"];
        echo'
            <div class="landingPageCenterButtons">
                <a href="game.php" class="landingPageStartLinkBtn">
                    <button type="button" class="landingPageNewGameButton">Tutorial</button>
                </a>
                <a href="game.php" class="landingPageStartLinkBtn">
                    <button type="button" class="landingPageNewGameButton">Vs CPU</button>
                </a>
                <a href="ranking.php?page=1">
                    <button type="button" class="landingPageRankingButton">Ranking</button>
                </a>
            </div>
        ';
    } else{ //si NO tenemos nombre registrado, mostrar form con botones de juego desabilitados

        echo'
        <form action="index.php" method="post">
            <div class="landingPageCenterTextbox">
                <input type="text" id="playerName" name="playerName"  placeholder="Registra el teu nom per jugar" minlength="3" maxlength="30" required>
                <input type="submit" class="landingPageRegisterButton" value="Registra">
            </div>
            <div class="landingPageCenterButtons">
                <a href="game.php" class="landingPageStartLinkBtn">
                    <button type="button" class="landingPageNewGameButton" disabled>Tutorial</button>
                </a>
                <a href="game.php" class="landingPageStartLinkBtn">
                    <button type="button" class="landingPageNewGameButton" disabled>Vs CPU</button>
                </a>
                <a href="ranking.php?page=1">
                    <button type="button" class="landingPageRankingButton">Ranking</button>
                </a>
            </div>
        </form>
        ';
    };

?>
        <button type="button" id="landingPageOptionsButton" class="landingPageOptionsButton"><img
                src="images/options.png" class="optionImg"></button>
        <div class="landingPageOptions" id="landingPageOptions">
            <div class="landingPageCheckboxWrapper">
                <label for="limmitedAmmoCheckbox" class="landingPageLabel">Munició limitada</label>
                <input type="checkbox" id="limmitedAmmoCheckbox" class="landingPageCheckbox">
            </div>
            <div class="landingPageCheckboxWrapper">
                <label for="ironcladShipsCheckbox" class="landingPageLabel">Vaixells acoirassats</label>
                <input type="checkbox" id="ironcladShipsCheckbox" class="landingPageCheckbox" disabled>
            </div>
            <div class="landingPageCheckboxWrapper">
                <label for="specialAttacksCheckbox" class="landingPageLabel">Atacs especials</label>
                <input type="checkbox" id="specialAttacksCheckbox" class="landingPageCheckbox" disabled>
            </div>
        </div>
        <!--
        en la especificación no pone nada de que el menú de opciones tenga un botón de Guardar, así que tal vez sea mejor guardar las opciones en JS
        -->
        <script>
            function init() {
                var checkbox = document.getElementById("limmitedAmmoCheckbox");
                //comprobar valor de la variable en la cookie de sesión
                //cambiar checkbox en la página
                if (sessionStorage.ammoCheckbox == 'true') {
                    checkbox.checked = true; 
                } else {
                    checkbox.checked = false;
                }
                checkbox.addEventListener("change", save); //llamar a save() cuando la checkbox cambia de estado
            }

            //guardar estado de la checkbox en una cookie
            function save() {
                var ammoCheckboxVal = document.getElementById("limmitedAmmoCheckbox").checked;
                sessionStorage.setItem('ammoCheckbox', ammoCheckboxVal);
            }

            //ejecutar script después de cargar el DOM
            window.addEventListener("DOMContentLoaded", init);
        </script>
</body>

</html>
