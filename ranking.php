<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trova la petxina</title>
    <link rel="stylesheet" type="text/css" href="style.css" />
    <script src="game.js"></script>

</head>



<body id="ranking">
<a href="index.php">
  <button class="exit">&larrhk;</button>
</a> 
<p class="rankingTitle">Hall of Fame</p>
  <!-- Aud  -->
  <audio id="sonidoAccion">
        <source src="sounds/action.mp3" type="audio/mpeg">
        Sonido no habilitado
  </audio>
<?php
session_start();
$filePath="ranking.txt";
$linecount = 0;
$file = fopen($filePath, "r");
    echo'
    <div class="rankingBox">
    <table class="rankingTable">
      <thead>
        <tr>
          <th>Jugador</th>
          <th>Puntuació</th>
          <th>Data del rècord</th>
        </tr>
      </thead>';
while($line = fgets($file)){ 
  $linecount++;
  
  // Verifica si "page" está definido en la URL
  $startLine = (isset($_GET["page"]) ? ($_GET["page"] - 1) * 25 + 1 : 1);
  $endLine = $startLine + 24;
  
  if($linecount >= $startLine&&$linecount <= $endLine){

    $values = explode(',',$line);
    
    //control de errores para evitar (warnings)
    if (count($values) >= 3) {
      echo '
      <tr>
          <td>',$values[0],'</td>
          <td>',$values[1],'</td>
          <td>',$values[2],'</td>
      </tr>';
    }
  }
}
echo'
</table>
</div>';
if ($linecount>25) {
    # paginador
    $numberOfPages = $linecount / 25;
    $numberOfPages = ceil($numberOfPages);

    echo'<div class="pagination">';
    for ($i=0; $i < $numberOfPages; $i++) { 
      if($_GET["page"]==$i+1){
        $classPaginator = "active";
      }else{
        $classPaginator = "";
      };
      echo'
          <a class="',$classPaginator,'" href="?page=',$i+1,'">',$i+1,'</a>
          ';
  }
  echo'</div>';
}
fclose($file);
?>
</body>
</html>