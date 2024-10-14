<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" media="screen" href="style.css">
	  <script src="game.js"></script>
    <title>Troba la petxina</title>
</head>

<body id="game">

    <?php
    // Crear el tablero de 10x10 (índices 1 a 10), aqui se registra el estado de las celdas del tablero
    $board = array_fill(1, 10, array_fill(1, 10, false));

    // Función para verificar si una celda es válida
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
    function placeShip($size, $color, &$board) {
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
                for ($i = 0; $i < $size; $i++) {
                    if ($direction == 'horizontal') {
                        $board[$startX + $i][$startY] = true;
                    } else {
                        $board[$startX][$startY + $i] = true;
                    }
                }
                $placed = true;
            }
        }
    }

    // Función para generar barcos (los colores pueden ser sustituidos por imagenes en un futuro)
    function generateShips(&$board) {
        $ships = [];
        $colors = ["#6F2DBD", "#B298DC", "#3C3A3E", "#B9FAF8", "#A663CC"];
        $shipSizes = [2, 3, 4, 5];

        foreach ($shipSizes as $size) {
            $randomIndex = array_rand($colors);
            $color = $colors[$randomIndex];
            array_splice($colors, $randomIndex, 1);
            placeShip($size, $color, $board);

            $ships[] = [
                'size' => $size,
                'coordinates' => [], // Aquí podrías almacenar coordenadas si es necesario
                'damaged' => [], // Aquí puedes almacenar las coordenadas tocadas de cada entidad
                'color' => $color
            ];
        }

        return $ships; //array con los barcos (hay que pasarla al js para hacer "magia")
    }

    // Generar barcos y tablero
    generateShips($board);

    // Convertir $board a JSON (esto es solo para hacer el console.log y ver el tablero en terminal)
    $boardJson = json_encode($board);
    ?>
	
<!-- --------------- TABLERO DE JUEGO --------------- -->
    <table>
        <?php
        $filas = 11;
        $columnas = 11;
        for ($i = 0; $i < $filas; $i++) {
            echo "<tr>";
            for ($j = 0; $j < $columnas; $j++) {
				 # Crear un ID único para cada celda
                $id = "cell_" . $i . "_" . $j;
				# En el caso de que sea el puesto superior izquierda no pinte nada
                if ($j == 0 && $i == 0) {
                    echo "<td class='empty'> </td>";

				# primera columna
                } elseif ($j == 0 && $i >= 1) {
                    echo "<td class='number'> $i </td>";
				
				# primera columna
                } elseif ($j >= 1 && $i == 0) {
                    $chrx = chr(64 + $j);
                    echo "<td class='letter'> $chrx </td>";
                } else {
                    // Mostrar la celda como ocupada si contiene un barco (true) esto es solo para enseñar donde se colocan
                    $cellContent = $board[$i][$j] ? "X" : " ";
                    echo "<td id='$id'>$cellContent</td>";
                }
            }
            echo "</tr>";
        }
        ?>
    </table>

    <script>
        // Imprimir el estado del tablero en la consola
        console.log(<?php echo $boardJson; ?>);
    </script>

</body>
</html>
