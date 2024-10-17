<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Troba la petxina</title>
    <link rel="stylesheet" type="text/css" href="style.css" />

</head>
<a href="index.php">
  <button class="exit">&larrhk;</button>
</a>
<body id="ranking" class="rankingBody">
  <p class="rankingTitle">Hall of Fame</p>
<?php
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
  if($_GET["page"]!=1) {
    $startLine = (($_GET["page"]-1)*25+1);
    $endLine = $startLine+24;
  }else {
    $startLine = 0;
    $endLine = $startLine+25;
  };
  
  if($linecount >= $startLine&&$linecount <= $endLine){

    $values = explode(',',$line);
    echo'
        <tr>
            <td>',$values[0],'</td>
            <td>',$values[1],'</td>
            <td>',$values[2],'</td>
        </tr>
    ';
  } ;

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
  echo'<div>';
}
fclose($file);
?>
</body>
</html>