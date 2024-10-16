<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Troba la petxina</title>
</head>
<body id="ranking">
<?php
$filePath="../sources/ranking.txt";
$linecount = 0;
$file = fopen($filePath, "r");
    echo'<table>';
while(!feof($file)){
  $line = fgets($file);
  $linecount++;
  while($linecount < 26){
    $values = explode(',',$line);
    echo'<tr>
            <td>',$values[0],'</td>
            <td>',$values[1],'</td>
            <td>',$values[2],'</td>
        </tr>
    ';
  } ;
}
if ($linecount>26) {
    # paginador
    $numberOfPages = $linecount / 25;
    $numberOfPages = ceil($numberOfPages);
    echo'
        
    ';
}
echo'</table>';
fclose($file);


?>
</body>
</html>