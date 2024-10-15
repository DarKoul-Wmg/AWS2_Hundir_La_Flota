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
    <span>puntos de aciertos:</span><div id="shipScore"></div>
    <span>total puntos:</span><div id="totalScore"></div>
</body>
</html>