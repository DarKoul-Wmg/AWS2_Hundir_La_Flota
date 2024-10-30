<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trova la petxina</title>
    <link rel="stylesheet" type="text/css" href="style.css?t=<?php echo time();?>"/>
    <script src="game.js"></script>
</head>
<body id="ranking">

<a href="index.php">
  <button class="exit">&larrhk;</button>
</a> 

<p class="rankingTitle">Hall of Fame</p>

<?php
session_start();
// Verifica la procedencia de la página
// if (!isset($_SERVER["HTTP_REFERER"]) || 
//     (strpos($_SERVER["HTTP_REFERER"], "win.php") === false && 
//      strpos($_SERVER["HTTP_REFERER"], "lose.php") === false)) {
//     // Si no viene de win.php o lose.php, redirige a index.php
//     header("Location: ranking.php");
//     exit;
// }

// Procesar el formulario enviado desde win.php y guardar los datos en ranking.txt
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST["playerName"]) && isset($_POST["score"])) {
  $playerName = trim($_POST["playerName"]);
  $score = (int)$_POST["score"];
  $date = date('Y-m-d H:i:s', time());

  $_SESSION['playerName'] = $playerName;
  $_SESSION['score'] = $score;
  $_SESSION['lastDate'] = $date;

  echo "<p> playerName -> {$playerName}
            score -> {$score}
            lastDate ->  {$date}
        </p>";

  if (strlen($playerName) >= 3 && strlen($playerName) <= 30) {
      $line = "$playerName,$score,$date\n";
      file_put_contents('ranking.txt', $line, FILE_APPEND);
      echo "<p> Archic subido - > {$playerName}</p>";
  }
}

$filePath = "ranking.txt";
$file = fopen($filePath, "r");

$ranking = []; // almacena cada jugador del archivo ranking
while ($line = fgets($file)) {
    $values = explode(',', $line);
    
    // control de errores para evitar (warnings)
    if (count($values) >= 3) {
        $ranking[] = [
            'nombre' => trim($values[0]),
            'puntuacion' => (int) $values[1], // parse a int para ordenar
            'fecha' => date("Y-m-d H:i", strtotime(trim($values[2]))) // parse a string
        ]; 
    }
}

fclose($file);

// Ordenar en base a puntuación
usort($ranking, function($a, $b) {
    return $b['puntuacion'] <=> $a['puntuacion'];
});

// Jugador a resaltar (highlight)
$nomPlayer = $_SESSION['playerName'];
$datePlayer = $_SESSION['lastDate'];

// Buscar al jugador en el ranking
$playerPosition = -1;


foreach ($ranking as $index => $player) {
  if ($player['nombre'] === $nomPlayer && date("Y-m-d H:i", strtotime($player['fecha'])) === date("Y-m-d H:i", strtotime($datePlayer))) {
      $playerPosition = $index + 1; // Asigna la posición correcta
      break; // Rompe el bucle al encontrar al jugador
  }
}


// Pagina del jugador
$pagePlayer = ($playerPosition > 0) ? ceil($playerPosition / 25) : 1;

$currentPage = isset($_GET["page"]) ? (int)$_GET["page"] : 1; // Página actual desde la URL

 //redirigir hacia la pagina con el highlight, comprobando que haya player y no sea la pag actual (crea buvle)
 //variable de sesion 'redirected' sirve para redireccionar al highlight solo la primera vez (evita forzar la redireccion) 
if ($nomPlayer && $pagePlayer != $currentPage && $pagePlayer <= ceil(count($ranking) / 25) && isset($_SESSION['redirected'])){
  
  //variable de sesion para controlar la carga del paginator
  unset($_SESSION['redirected']);
  header("Location: ranking.php?page=$pagePlayer");
  exit();
}

// Estructura de la tabla
echo '<div class="rankingBox">
<table class="rankingTable">
  <thead>
    <tr>
      <th>Jugador</th>
      <th>Puntuació</th>
      <th>Data del rècord</th>
    </tr>
  </thead>
  <tbody>';

$start = ($currentPage - 1) * 25;
$entriesToShow = array_slice($ranking, $start, 25);

$num = $start +1;
// Print de las entradas de la tabla
foreach ($entriesToShow as $i => $entry) {
    $positionHighlight = ($start + $i + 1 == $playerPosition) ? "highlight" : ""; // clase para highlight
    echo "<tr class=\"$positionHighlight\"> 
            <td>[{$num}] - {$entry['nombre']}</td>
            <td>{$entry['puntuacion']}</td>
            <td>{$entry['fecha']}</td>
          </tr>";
    $num++;
}

// Cerrar tabla
echo '</tbody>
</table>
</div>';

// Paginador
$numberOfPages = ceil(count($ranking) / 25);
echo '<div class="pagination">';

// Botón de "Primera página"
if ($currentPage > 1) {
  echo '<a href="?page=1" class="first-page"><</a>';
}

for ($i = 1; $i <= $numberOfPages; $i++) {
    $classPaginator = ($currentPage === $i) ? "active" : "";
    echo "<a class=\"$classPaginator\" href=\"?page=$i\">$i</a>";
}

// Botón de "Última página"
if ($currentPage < $numberOfPages) {
  echo '<a href="?page=' . $numberOfPages . '" class="last-page">></a>';
}
echo '</div>';
// unset($_SESSION['playerName']);

?>
</body>
</html>
