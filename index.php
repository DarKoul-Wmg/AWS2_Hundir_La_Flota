<!DOCTYPE html>
<html lang="ca">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Troba la petxina</title>
    <link rel="stylesheet" type="text/css" href="style.css" />
</head>

<body id="index" class="landingPageBody">
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
                background-color: rgba(0, 0, 0, 0.7); /* Fondo negro con opacidad */
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999; /* Asegura que esté encima de todo */
            }

            /* Estilo del mensaje centrado */
            .noscript-warning {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5); /* Sombra para destacar */
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
  
    <div class="landingPageBox">
        <p class="landingPageTitle">Troba la petxina</p>
        <p class="landingPageDescription">
            Troba totes les petxines com més aviat millor!
        </p>
        <div class="landingPageCenterButtons">
            <a href="game.php" class="landingPageStartBtn">
                <button type="button" class="landingPageNewGameButton">Nova Partida</button>
            </a>
            <a href="ranking.php?page=1">
                <button type="button" class="landingPageRankingButton">Ranking</button>
            </a>
        </div>
    </div>    
</body>
</html>