<!DOCTYPE html>
<html lang="ca">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trova la petxina</title>
    <link rel="icon" href="images/favicon.png" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="style.css?t=<?php echo time();?>"/>
    <script src="game.js"></script>
</head>

<body id="index">
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
        <p class="landingPageTitle">Trova la petxina</p>
        <p class="landingPageDescription">
            Trova totes les petxines com més aviat millor!
        </p>

        <?php
    // Crear sesión y guardar el nombre del jugador en una variable de sesión
    session_start();
    // session_unset(); // Eliminar todas las variables de sesión
    $_SESSION['redirected'] = true;
    
    if(isset($_POST["playerName"])){ //si tenemos nombre registrado, mostrar botones de juego activos
        $_SESSION["playerName"] = $_POST["playerName"];

        // valores de los checkboxes enviados desde el formulario
        $limmitedAmmo = isset($_POST['limmitedAmmoCheckbox']) ? true : false;
        $ironcladShips = isset($_POST['ironcladShipsCheckbox']) ? true : false;
        $specialAttacks = isset($_POST['specialAttacksCheckbox']) ? true : false;

        // Guardar valores en la sesión para pasar a php2
        $_SESSION["limmitedAmmo"] = $limmitedAmmo;
        $_SESSION["ironcladShips"] = $ironcladShips;
        $_SESSION["specialAttacks"] = $specialAttacks;

        echo'
            <div class="landingPageCenterButtons">
                <a href="game.php" class="landingPageStartLinkBtn">
                    <button type="button" class="landingPageNewGameButton">Tutorial</button>
                </a>
                <a href="gameIA.php" class="landingPageStartLinkBtn">
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
                <input type="text" id="playerName" name="playerName" placeholder="Registra el teu nom per jugar"
                    minlength="3" maxlength="30" required>
            </div>

            <div class="landingPageCenterButtons">

                <input type="submit" class="landingPageNewGameButton" id="tutorialBtn" name="tutorial" value="Tutorial"
                    formaction="game.php" disabled>


                <input type="submit" class="landingPageNewGameButton" id="vsCpuBtn" name="vsCPU" value="Vs CPU"
                    formaction="gameIA.php" disabled>

                <a href="ranking.php?page=1">
                    <button type="button" class="landingPageRankingButton">Ranking</button>
                </a>
            </div>

            <button type="button" id="landingPageOptionsButton" class="landingPageOptionsButton">
                <img src="images/options.png" class="optionImg">Opcions
            </button>

            <div class="landingPageOptions" id="landingPageOptions">
                <div class="landingPageCheckboxWrapper">
                    <label for="limmitedAmmoCheckbox" class="landingPageLabel">Usos limitats</label>
                    <input type="checkbox" id="limmitedAmmoCheckbox" name="limmitedAmmoCheckbox"
                        class="landingPageCheckbox">
                </div>
                <div class="landingPageCheckboxWrapper">
                    <label for="ironcladShipsCheckbox" class="landingPageLabel">Petxines amagades</label>
                    <input type="checkbox" id="ironcladShipsCheckbox" name="ironcladShipsCheckbox"
                        class="landingPageCheckbox">
                </div>
                <div class="landingPageCheckboxWrapper">
                    <label for="specialAttacksCheckbox" class="landingPageLabel">Pala especial</label>
                    <input type="checkbox" id="specialAttacksCheckbox" name="specialAttacksCheckbox"
                    class="landingPageCheckbox">

                </div>
            </div>
        </form>
    </div>';
    }
?>


    <!--
        en la especificación no pone nada de que el menú de opciones tenga un botón de Guardar, así que tal vez sea mejor guardar las opciones en JS
        -->
    <script>

        const textbox = document.getElementById("playerName");
        const tutorial = document.getElementById("tutorialBtn");
        const vsCPU = document.getElementById("vsCpuBtn");

        function init() {

            textbox.addEventListener("input", eventHandler);
            function eventHandler(event) {
                if (textbox.value.length > 2) {
                    tutorial.disabled = false;
                    vsCPU.disabled = false;
                }
                if (textbox.value.length < 3) {
                    tutorial.disabled = true;
                    vsCPU.disabled = true;
                }
            }
            // función del botón checkBoxes landingPage
            //landingPage, hacer clic en botón opciones para mostrar/esconder div
            const landingPageOptBtn = document.getElementById("landingPageOptionsButton");
            let showOptions = true;
            landingPageOptBtn.addEventListener("click", function () {
                if (showOptions) {
                    document.getElementById("landingPageOptions").style.display = "block";
                    showOptions = false;
                } else {
                    document.getElementById("landingPageOptions").style.display = "none";
                    showOptions = true;
                }
            });
        }

        window.addEventListener("DOMContentLoaded", init);



    </script>
</body>

</html>