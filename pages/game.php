<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel='stylesheet' type='text/css' media='screen' href='style.css'>
	<script src="game.js"></script>
    <title>Troba la petxina</title>
</head>
<body id="game">
	
    <?php
        $filas=10;
        $columnas=10;
    ?>
	<table>
		<?php
			for($i = 0; $i <= $filas; $i++){
				echo "<tr>";
				for($j = 0; $j <= $columnas; $j++){
					 # Crear un ID único para cada celda
					 $id = "cell_" . $i . "_" . $j;
					# En el caso de que sea el puesto superior izquierda no pinte nada
					if($j==0 && $i==0){
						echo "<td> </td>";
					}
					# En el caso de que sea la primera columna
					else if($j==0 && $i>=1){
						echo "<td> $i </td>";
					}
					# En el caso de que sea la primera fila 
					else if($j>=1 && $i==0){
						$chrx = chr(64 + $j);
						echo "<td> $chrx </td>";
				
					}
					# Para las demás
					else{
						echo "<td>~</td>";
					}
				}
				echo "</tr>";
			}
		?>
	</table>
</body>
</html>