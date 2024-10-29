<!DOCTYPE html>
<html lang="ca">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" type="text/css" media="screen" href="style.css">
	<script src="game.js"></script>
    
    <title>Trova la petxina VS IA</title>
</head>

<body id="gameIA">

    <!-- Aud  -->
    <audio id="sonidoAccion">
        <source src="sounds/action.mp3" type="audio/mpeg">
        Sonido no habilitado
    </audio>

    <audio id="sonidoAgua">
        <source src="sounds/water2.mp3" type="audio/mpeg">
        Sonido no habilitado
    </audio>

    <audio id="sonidoAcierto">
        <source src="sounds/discovered.mp3" type="audio/mpeg">
        Sonido no habilitado
    </audio>

    <audio id="sonidoWin">
        <source src="sounds/win.mp3" type="audio/mpeg">
        Sonido no habilitado
    </audio>
    <audio id="sonidoCpuWin">
        <source src="sounds/cpuwin.mp3" type="audio/mpeg">
        Sonido no habilitado
    </audio>
    <audio id="sonidoEspera">
        <source src="sounds/shot.mp3" type="audio/mpeg">
        Sonido no habilitado
    </audio>
    
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
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }

            /* Estilo del mensaje centrado */
            .noscript-warning {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
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

    <?php
        session_start();
        //almacenamos nombre de jugador en sesión
        $_SESSION["playerName"] = $_POST["playerName"];

        // valores de los checkboxes enviados desde el formulario
        $limmitedAmmo = isset($_POST['limmitedAmmoCheckbox']) ? true : false;
        $ironcladShips = isset($_POST['ironcladShipsCheckbox']) ? true : false;
        $specialAttacks = isset($_POST['specialAttacksCheckbox']) ? true : false;

        // Guardar valores en la sesión para pasar a php2
        $_SESSION["limmitedAmmo"] = $limmitedAmmo;
        $_SESSION["ironcladShips"] = $ironcladShips;
        $_SESSION["specialAttacks"] = $specialAttacks;

        // Regoger valores de los checkboxes
        $limmitedAmmo = isset($_SESSION["limmitedAmmo"]) && $_SESSION["limmitedAmmo"];
        //$ironclad = isset($_SESSION["ironclad"]) && $_SESSION["ironclad"];
        $specialAttacks = isset($_SESSION["specialAttacks"]) && $_SESSION["specialAttacks"];

        // crear dos tableros 10x10 - por defecto sin conchas
        $boardUser = array_fill(1, 10, array_fill(1, 10, false));
        $boardIA = array_fill(1, 10, array_fill(1, 10, false));

        // Verificar que una celda es válida
        function isValidCell($x, $y, $board) {
            if ($x < 1 || $y < 1 || $x > 10 || $y > 10) {
                return true; // Consideramos las celdas fuera del tablero como válidas (para evitar errores)
            }
    
            // La ! es para Devolver false si esta ocupada (la posicion[x][y] es true) o true si esta libre (la posicion[x][y] es false)
            return !$board[$x][$y]; 
        }

        // Función para comprobar si hay espacio disponible para un barco
        function isEmpty($startX, $startY, $size, $direction, $board) {
            for ($i = 0; $i < $size; $i++) {
                if ($direction == 'horizontal') {
                    $x = $startX + $i;
                    $y = $startY;
                } else {
                    $x = $startX;
                    $y = $startY + $i;
                }
                //todas las opciones posibles para cada casilla
                if (!isValidCell($x, $y, $board) || 
                    !isValidCell($x - 1, $y, $board) || 
                    !isValidCell($x + 1, $y, $board) || 
                    !isValidCell($x, $y - 1, $board) || 
                    !isValidCell($x, $y + 1, $board)) {
                    return false;
                }
            }
            return true;
        }


        // Función para colocar un barco en el tablero
        function placeShip(&$ship, $size, $type, &$board) { // Cambia $ships a $ship
            $placed = false;
            while (!$placed) {
                $direction = rand(0, 1) > 0 ? 'horizontal' : 'vertical';
                if ($direction == 'horizontal') {
                    $startX = rand(1, 11 - $size);
                    $startY = rand(1, 10);
                } else {
                    $startX = rand(1, 10);
                    $startY = rand(1, 11 - $size);
                }
        
                if (isEmpty($startX, $startY, $size, $direction, $board)) {
                    $shipCoordinates = [];
        
                    for ($i = 0; $i < $size; $i++) {
                        if ($direction == 'horizontal') {
                            $board[$startX + $i][$startY] = true;
                            $shipCoordinates[] = [$startX + $i, $startY];
                        } else {
                            $board[$startX][$startY + $i] = true;
                            $shipCoordinates[] = [$startX, $startY + $i];
                        }
                    }
        
                    // Aquí asignas las coordenadas al barco actual
                    $ship['coordinates'] = $shipCoordinates;
        
                    $placed = true;
                }
            }
        }

         // Función para generar barcos (los colores pueden ser sustituidos por imágenes en un futuro)
        function generateShips(&$board) {
            $ships = [];
            $types = ["ermitano", "caparazon", "caparazon2", "caracol","caracola","concha","erizo","mejillon","nautilus","estrella"];
            $shipSizes = [1,1,1,1,2,2,2,3,3,4];

            foreach ($shipSizes as $size) {
                $randomIndex = array_rand($types);
                $type = $types[$randomIndex];
                array_splice($types, $randomIndex, 1);

                $ship = [ // Crear un nuevo barco
                    'size' => $size,
                    'coordinates' => [], // Inicialmente vacío
                    'touchedCoordinates' => [],
                    'shellType' => $type
                ];

                placeShip($ship, $size, $type, $board); // Pasar el barco actual a la función

                $ships[] = $ship; // Agregar el barco a la lista de barcos
            }

            return $ships;
        }

        // Generar barcos y tablero
        $shipsUser = generateShips($boardUser);
        $shipsIA = generateShips($boardIA);

        // pasar a js el diccionario de conchas
        echo    "<script>
                    var dicShellsUser = " . json_encode($shipsUser) . ";
                    var dicShellsIA = " . json_encode($shipsIA) . ";
                </script>";
    ?>

    <div class ="main">

        <div class ="leftContainer">

            <!-- botón hacia atrás -->
            <a href="index.php" ><button id ="btnAccion" class="exit">&larrhk;</button></a>
            
            <!-- información de la munición -->
             <?php
                
                // poner que se vea o no
                $visibilityStyleMunition = $limmitedAmmo ? 'visible' : 'hidden';
                $limmitedAmmoStr = $limmitedAmmo ? 'true' : 'false';
                
                // hardcodear munición
                echo '
                    <div id="contenedorMunicion" data-limitedMunition="' . $limmitedAmmoStr . '" style="visibility: ' . $visibilityStyleMunition . ';">
                        <div id="contenidoHidMunicion">
                            <h3> Munición disponible </h3>
                            <div class="linea">
                                <p>User:</p> 
                                <p id="userMunition">40</p> 
                                <p> /40</p>
                            </div>
                            <div class="linea">
                                <p>IA:</p> 
                                <p id="iaMunition">40</p> 
                                <p> /40</p>
                            </div>
                        </div>
                    </div>
                ';
            ?>

            <!-- tablero de la ia -->
            <table id="tableIA">
                <?php
                    $filas = 11;
                    $columnas = 11;

                    for ($i = 0; $i < $filas; $i++) {
                        echo "<tr>";
                        for ($j = 0; $j < $columnas; $j++) {
                            # Crear un ID único para cada celda
                            # En el caso de que sea el puesto superior izquierda no pinte nada
                            if ($j == 0 && $i == 0) {
                                echo "<td class='empty'>⛧</td>";

                            # primera columna
                            } elseif ($j == 0 && $i >= 1) {
                                echo "<td class='number'> $i </td>";
                            
                            # primera columna
                            } elseif ($j >= 1 && $i == 0) {
                                $chrx = chr(64 + $j);
                                echo "<td class='letter'> $chrx </td>";
                            } else {
                                
                                // Mostrar la celda como ocupada si contiene un barco (true) esto es solo para enseñar donde se colocan
                                echo "<td class='selectCellsIA' data-x=$i data-y=$j data-touched='false' data-photo='none'></td>";
                            }
                        }
                        echo "</tr>";
                    }
                ?>

            </table>

        </div>


        <div class="centerContainer">
            <!-- información de los ataques especiales -->
            <?php
                // poner que se vea o no
                $visibilityStyleSpecialAttack = $specialAttacks ? 'visible' : 'hidden';
                echo '
                    <div id="contenedorSpecialAttack" style="visibility: ' . $visibilityStyleSpecialAttack . ';">
                        <img class="pala" data-selected="false" data-used="false" src="images/palaPlaceHolder.png" alt="pala de minecraft">
                        <img class="pala" data-selected="false" data-used="false" src="images/palaPlaceHolder.png" alt="pala de minecraft">
                    </div>
                ';
            ?>
            <!-- tablero del usuario-->
            <table id="tableUser">
                <?php
                $filas = 11;
                $columnas = 11;
                for ($i = 0; $i < $filas; $i++) {
                    echo "<tr>";
                    for ($j = 0; $j < $columnas; $j++) {
                        # Crear un ID único para cada celda
                        # En el caso de que sea el puesto superior izquierda no pinte nada
                        if ($j == 0 && $i == 0) {
                            echo "<td class='empty'>⛧</td>";

                        # primera columna
                        } elseif ($j == 0 && $i >= 1) {
                            echo "<td class='number'> $i </td>";
                        
                        # primera columna
                        } elseif ($j >= 1 && $i == 0) {
                            $chrx = chr(64 + $j);
                            echo "<td class='letter'> $chrx </td>";
                        } else {
                            // Mostrar la celda como ocupada si contiene un barco (true) esto es solo para enseñar donde se colocan
                            echo "<td class='selectCellsUser' data-x=$i data-y=$j data-touched='false' data-photo='none'></td>";
                        }
                    }
                    echo "</tr>";
                }
                ?>
            </table>
        </div>
        
        <div class ="rightContainer">
            <!-- nombre -->
            <?php
                $playerName = isset($_SESSION['playerName']) ? $_SESSION['playerName'] : "";  // Recuperar nombre de variable de sesión
                echo '<p class="userName">',$playerName,'</p>';
            ?>

            <!-- Contador -->
            <div id="time">
                <div id="chrono"></div>
            </div>
            <!-- Points -->
            <div id="points">
                <div id="totalScore"></div>
            </div>

            <!-- Message Log -->
            <div id="containerMessage">
                <div id="message"></div>
            </div>        
        </div>

        <form class="endForm" id="endForm" action="win.php" method="post">
            <input type="hidden" id="endgameHidden" name="score">
            <!--<input class="buttonEnd" type="submit" onclick="endgamePoints()" value="End Game PHP">-->
        </form>
        <form class="endForm" id="loseEndForm" action="lose.php" method="post">
            <input type="hidden" id="loseEndgameHidden" name="score">
        </form>
    
    </div>

    <script>
        var playerName = "<?php echo $playerName; ?>"; 

        document.addEventListener("DOMContentLoaded", function() {

            if(playerName === "win") {
                
                document.getElementById("endForm").submit();

            }else if(playerName === "lose"){
                document.getElementById("loseEndForm").submit();
            }
        });
    </script>

</body>

</html>