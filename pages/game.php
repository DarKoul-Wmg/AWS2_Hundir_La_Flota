<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Troba la petxina</title>
    <script src="gameScript.js"></script>
</head>
<body id="game" onload="chronometer() ">
    <span>puntos:</span><div id="score"></div>
    <span>cronometro:</span> <div id="chrono"></div>
    <button type="button" onclick="stopChronometer()">Stop</button>
    <button type="button" onclick="chronometer()">Resume</button>
    <button type="button" onclick="testAdd()">hit ship</button>
    <button type="button" onclick="testSubstract()">miss ship</button>
    <span>puntos de aciertos:</span><div id="shipScore">0</div>
    <span>total puntos:</span><div id="totalScore"></div>
    <form action="win.php" method="post">
        <button type="button" onclick="endgamePoints()">End Game</button>
        <input type="hidden" id="endgameHidden" name="score">
        <div id="endgame" name="score"></div>
        <input type="submit" onclick="endgamePoints()" value="End Game PHP"> 
    </form>
</body>
</html>