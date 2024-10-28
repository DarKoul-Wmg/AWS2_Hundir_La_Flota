document.addEventListener("DOMContentLoaded", function () {

    // Asignar los audios a variables
    let sonidoAccion = document.getElementById('sonidoAccion');
    let sonidoAgua = document.getElementById('sonidoAgua');
    let sonidoAcierto = document.getElementById('sonidoAcierto');

    // Selecciona todos los botones en la página (sonido DEFAULT para todos los botones)
    let botones = document.querySelectorAll('button');

    // Añade un evento 'click' a cada botón para reproducir el sonido
    botones.forEach(function (boton) {
        boton.addEventListener('click', function () {
            sonidoAccion.play();
        });
    });

    // variables de tiempo
    var timerPoints = 0; //puntos por tiempo
    var actionPoints = 0; //puntos por aciertos/fallos
    var roundedPoints = 0; //puntos por tiempo sin decimales
    var lastHit = false; //comprobar rachas
    var streak = 0; //racha actual
    var maxStreak = 1; //racha maxima de la partida
    var seconds = 0; //segundos del cronometro
    var totalSeconds = 0; //segundos totales de partida, para calcular puntos
    var minutes = 0; //minutos del cronometro
    var countUp = 0; //ID del cronometro

    // variable de mensaje css
    let messageTimeout = null;


    // variables de munición
    const contenedorMunicion = document.getElementById('contenedorMunicion');

    if (contenedorMunicion) {
        const limitedMunition = contenedorMunicion.getAttribute('data-limitedMunition');
        var isLimitedMunition = limitedMunition === 'true'; // Convertir el valor de string a booleano
        // Lo he cambiado de const a var, si no peta como si nunca estuviese declarada.
    }

    // variables de control de si se han acabado la munición
    let isMunitionUserSpent = false;
    let isMunitionIaSpent = false;

    //variables de acorazados
    const  contenedorAcorazados = document.getElementById('contenedorAcorazados');
    if (contenedorAcorazados){
        const ironcladShips = contenedorAcorazados.getAttribute('data-ironcladShips');
        var isIroncladShips = ironcladShips === 'true';
    }

    // variable de las celdas que puedes darle click
    const cells = document.getElementsByClassName("selectCellsUser");


    var gameMode = 1;   // Especificar tipo de juego; numérico para añadir más tipos de juego en el futuro
    // gameMode 0 => Tutorial
    // gameMode 1 => VS CPU
    var turn = true;    // turnos: TRUE => Jugador, FALSE => CPU

    if (window.location.href == "http://localhost:8080/game.php") {
        gameMode = 0;
    }
    if (window.location.href == "http://localhost:8080/gameIA.php") {
        gameMode = 1;
    }

    if (gameMode == 1) {
        //dar estilos iniciales a las tablas para representar el turno
        const tableIA = document.getElementById("tableIA");
        const tableUser = document.getElementById("tableUser");
        if (tableIA) {
            tableIA.classList.add("tableDisabler");
            tableUser.classList.add("tableEnabler");
        }
    }

    // evento click a cada celda
    for (let cell of cells) {
        // creamos una función para poder pasar el parámetro event         
        cell.addEventListener("click", eventHandler);
    };


    // MUNICIÓN --

    // función que devuelve cuánta munición tenemos puesta que se muestra en el html
    function getCurrentMunition(turn) {

        if (turn) {
            return parseInt(document.getElementById('userMunition').innerHTML);
        }
        return parseInt(document.getElementById('iaMunition').innerHTML);

    }

    // función que comprueba si se te acaba la munición
    function checkMunition() {

        // comprueba la del usuario
        if (getCurrentMunition(true) == 0) {
            isMunitionUserSpent = true;
        }
        // comprueba la de la máquina
        if (getCurrentMunition(false) == 0) {
            isMunitionIaSpent = true;
        }
    }

    function checkGameOverByMunition() {

        // compruebo, por si acaso, si se han acabado las municiones
        checkMunition();

        if (isMunitionUserSpent && isMunitionIaSpent) {

            // función auxiliar
            function sumDiscovered(dic) {

                let totalGroup = 0;
                let totalShells = 0;

                for (const shell of dic) {
                    if (isGrupShellDiscovered(shell)) {
                        totalGroup++;
                    }

                    for (const coordinate of shell.coordinates) {

                        for (const touchedCoordinate of shell.touchedCoordinates) {

                            if (compareCoordinates(coordinate, touchedCoordinate)) {
                                totalShells++;
                                break;
                            }
                        }
                    }
                }

                return { totalGroup, totalShells };
            }

            let resultUser = sumDiscovered(dicShellsUser);
            let resultIa = sumDiscovered(dicShellsIA);

            // mira quién ha ganado
            let userWin = false;

            if (resultUser.totalGroup > resultIa.totalGroup) {
                userWin = true;
            }
            else if (resultIa.totalGroup > resultUser.totalGroup) {
                userWin = false;
            }
            else {
                if (resultUser.totalShells > resultIa.totalShells) {
                    userWin = true;
                }
                else if (resultIa.totalShells > resultUser.totalShells) {
                    userWin = false;
                }
                else {
                    userWin = false;
                }
            }


            // acaba la partida
            if (userWin) {
                //Sonido win
                sonidoWin.play();
                printMessageOnClick('win');

                //calcular puntos del final
                endgamePoints();

                // después de 2 segundo te vas a win.php
                setTimeout(function () {
                    document.getElementById("endForm").submit();
                    //window.location.href = "win.php";
                }, 6000);
            }

            else if (!userWin) {
                //Sonido win
                sonidoCpuWin.play();
                printMessageOnClick('lose');

                //calcular puntos del final
                loseEndgamePoints();

                // después de 2 segundo te vas a win.php
                setTimeout(function () {
                    document.getElementById("loseEndForm").submit();
                    //window.location.href = "lose.php";
                }, 4000);
            }

        }
    }


    // TURNOS --


    //cambiada función anónima para poder referenciarla en el removeEventListener
    function eventHandler(event) {
        //event.target.removeEventListener("click",eventHandler);
        if (gameMode == 0) {
            discoverCell(event, dicShellsUser);
        }
        if (gameMode == 1) {
            if (turn) {

                // munición user
                if (isLimitedMunition) {
                    let updatedMunitionValue = getCurrentMunition(turn);

                    if (updatedMunitionValue > 0) {
                        updatedMunitionValue--;
                        document.getElementById('userMunition').innerHTML = updatedMunitionValue;
                    }

                }

                // si TIENE munición el user
                if (!isMunitionUserSpent) {
                    console.log("Llamando a discoverCell");
                    var [cellState, life] = discoverCell(event, dicShellsUser) ;
                    console.log(life);
                    if (cellState === 'water' || life > 0) { //si la celda clicada es agua pasar el turno a la CPU
                        turn = false;
                        console.log(life);
                        //estilos que marcan el turno de la CPU
                        styleTurnCPU();

                        if (!isMunitionIaSpent) {
                            setTimeout(() => turnCPU(event, dicShellsIA), 2000);
                        } else {
                            returnTurnToPlayer(); //esto es para evitar que el jugador pueda volver a clicar celdas descubiertas
                        }
                    }
                }

                else if (isMunitionUserSpent) {
                    // si NO tiene munición el user
                    printMessageOnClick('userNotMun');
                    console.log("mensaje de que no tiene munición el user ")
                    turn = false;
                    styleTurnCPU();
                    setTimeout(() => turnCPU(event, dicShellsIA), 2000);
                }
                checkGameOverByMunition();
            }
        }
        resetClickEvent();
    }

    function styleTurnPlayer() { //estilos que marcan el turno del usuario
        tableUser.classList.add("tableEnabler");
        tableUser.classList.remove("tableDisabler");
        tableIA.classList.add("tableDisabler");
        tableIA.classList.remove("tableEnabler");
    }

    function styleTurnCPU() { //estilos que marcan el turno de la CPU
        tableUser.classList.add("tableDisabler");
        tableUser.classList.remove("tableEnabler");
        tableIA.classList.add("tableEnabler");
        tableIA.classList.remove("tableDisabler");
    }

    function resetClickEvent() {
        for (let cell of cells) {
            //quitamos el evento click de las celdas       
            cell.removeEventListener("click", eventHandler);
        };
        for (let cell of cells) {
            let life = parseInt(cell.getAttribute('data-life'));
            if (life > 0) { //solo devoler el evento a las celdas con vida
                cell.addEventListener("click", eventHandler);
            }
        };
    }

    // función que devuelve el turno al jugador; lo muestra en estilos en las celdas y reaplica el evento click
    function returnTurnToPlayer() {
        styleTurnPlayer();
        resetClickEvent();
        /* for (let cell of cells) {
             if ((cell.getAttribute('data-photo')) === 'none') { //solo devoler el evento a las celdas vacías, importante para no perder turnos en celdas ya clicadas
                 cell.addEventListener("click", eventHandler);
             }
 
         };*/
        turn = true;
    }

    // diccionario que lleva la lista de movimientos posibles para la CPU
    var cpuLeftCells = [];
    
    for (let x = 1; x < 11; x++) {
        for (let y = 1; y < 11; y++) {
            cpuLeftCells.push({
                x: x,
                y: y
            })
        }
    }
    var selectedHits = [];
    var initialHit = [];

    function turnCPU(e, dicShellsIA) {
        if (!turn) {
            for (let cell of cells) {
                //quitamos el evento click de las celdas hasta que le vuelva a tocar al jugador         
                cell.removeEventListener("click", eventHandler);
            };

            // comprobar si la ia tiene munición
            if (isLimitedMunition) {
                let updatedMunitionValue = getCurrentMunition(turn);

                if (updatedMunitionValue > 0) {
                    updatedMunitionValue--;
                    document.getElementById('iaMunition').innerHTML = updatedMunitionValue;
                }
            }

            // si TIENE munición la ia
            if (!isMunitionIaSpent) {
                logicCPU(e, dicShellsIA)


            }
            // si NO tiene munición la ia
            else if (isMunitionIaSpent) {
                printMessageOnClick('iaNotMun');
                console.log("mensaje de que la ia no tiene munición")
                setTimeout(returnTurnToPlayer, 500);
            }

            checkGameOverByMunition();
        }
    }

    function logicCPU(e, dicShellsIA) {

        var isRandom = true;
        var targetSelection;
        
            if (selectedHits.length > 0) { //si hay movimientos disponibles en la lista de movimientos seleccionados usarlos
                isRandom = false; 
                targetSelection = [selectedHits[0][0], selectedHits[0][1]];
            } else {
                isRandom = true;
                let randomIndex = Math.floor(Math.random() * cpuLeftCells.length); // seleccionar índice aleatorio de la lista de movimientos restantes
                targetSelection = [cpuLeftCells[randomIndex].x, cpuLeftCells[randomIndex].y];
            }
    
            //cpuTargetSelection(dicShellsIA);
            for (let cell of cellsTableIA) {
                let x = parseInt(cell.getAttribute('data-x'));
                let y = parseInt(cell.getAttribute('data-y'));
                var currentCell = [x, y];                
                
                if (compareCoordinates(currentCell, targetSelection)) {
                    cell.style.backgroundColor= "blue"; //marcar la celda escogida como primer hit
                    cell.style.border = "2px solid blue";                
                    var [touch, cellState, groupIsDiscovered, life] = checkClickedCell(dicShellsIA, targetSelection);               
                    cell.setAttribute('data-life', life); //cambiamos vida en la casilla
                    if(life < 1){
                        console.log("vida menor a 1");
                        cell.style.backgroundColor= "red"; //marcar la celda escogida como hit definitivo
                        cell.style.border = "2px solid red";
                        // Actualiza cpuLeftCells eliminando la celda tocada
                        for (let i = 0; i < cpuLeftCells.length; i++) {
                            console.log("x: ",x, " y: ",y, " cpuX: ",cpuLeftCells[i].x, " cpuY: ", cpuLeftCells[i].y);
                            if (cpuLeftCells[i].x === x && cpuLeftCells[i].y === y) {
                                console.log("borrando movimientos");
                                cpuLeftCells.splice(i, 1); // Elimina la celda tocada
                                selectedHits.splice(0, 1); //borrar movimiento de la lista de posibles
    
                                break;
                            }
                        }
                    } else {
                        touch = false; //si la celda aún tiene vida no repetir turno
                    }
                    console.log("break");
    
                    break;
                }
            }
            if ( life > 0 ) {
                console.log(possibleAdjacentCells(targetSelection, dicShellsIA));
                initialHit = targetSelection; //guardamos el impacto inicial
                if (life > 1){
                    console.log("añadiendo celda actual");

                    selectedHits.push(targetSelection);
                }
                selectedHits = selectedHits.concat(possibleAdjacentCells(targetSelection, dicShellsIA));
            }
            if (groupIsDiscovered){ //si descubre un grupo borrarlo de la lista
                for (let i = 0; i < cpuLeftCells.length; i++) {
                    for (hit of selectedHits){
                        if(hit[0] === cpuLeftCells[i].x && hit[1] === cpuLeftCells[i].y){
                            cpuLeftCells.splice(i, 1); // Elimina la celda tocada

                        }
                    }
                }
                selectedHits = []; //vaciar lista de siguientes ataques
            }

            console.log(selectedHits);


        
        console.log(dicShellsIA);

        printMessageOnClick(cellState);

        if (isWin(dicShellsIA)) {
            //Sonido win
            sonidoCpuWin.play();
            printMessageOnClick('win');

            //calcular puntos del final
            loseEndgamePoints();

            // después de 2 segundo te vas a win.php
            setTimeout(function () {
                document.getElementById("loseEndForm").submit();
                //window.location.href = "lose.php";
            }, 4000);
        }


        if (touch) { //HARDCODEAR DEMO
            //setTimeout(() => turnCPU(e, dicShellsIA), 2000); //Repetir turno CPU a los 2 segundos
            setTimeout(() => turnCPU(e, dicShellsIA), 500);


        } else { //HARDCODEAR DEMO
            //setTimeout(returnTurnToPlayer, 2000); //devolver turno al jugador a los 2 segundos
            setTimeout(() => turnCPU(e, dicShellsIA), 500); //Repetir turno CPU al milisegundo
            // la línea de arriba hace que solo juegue la CPU, deshabilitar returnToPlayer y invertir las líneas del if anterior
        }

    }

    function cpuRandomSelection(dicShellsIA){


    }

    function cpuTargetSelection(){
        let randomIndex = Math.floor(Math.random() * selectedHits.length); //buscamos casilla random de la lista de hits seleccionados
        for (let cell of cellsTableIA) {
            let x = parseInt(cell.getAttribute('data-x'));
            let y = parseInt(cell.getAttribute('data-y'));
            const currentCell = [x, y];
            let rndSelection = [selectedHits[randomIndex][0], selectedHits[randomIndex][1]];
            if (compareCoordinates(currentCell, rndSelection)) {
                cell.style.backgroundColor= "blue"; //marcar la celda escogida
                cell.style.border = "2px solid blue";
                coordinateInCPUTable = currentCell;
                
                // Actualiza cpuLeftCells eliminando la celda tocada
                for (let i = 0; i < cpuLeftCells.length; i++) {
                    if (cpuLeftCells[i].x === x && cpuLeftCells[i].y === y) {
                        cpuLeftCells.splice(i, 1); // Elimina la celda tocada
                        break;
                    }
                }

            }
        }
    }

    //función que devuelve las celdas válidas adyacentes, es decir: que estén dentro de la tabla y que no estén tocadas
    function possibleAdjacentCells(cell){
        let adjacentCells = []
        let possibilities = [
            [cell[0] - 1, cell[1]], //arriba
            [cell[0] + 1, cell[1]], //abajo
            [cell[0], cell[1] - 1], //izquierda
            [cell[0], cell[1] + 1] //derecha
        ];
        for (let pos of possibilities) {
            let invalid = false; //reiniciamos para cada posibilidad
            if (!isValidCell(pos)){ //si la posibilidad se sale de la tabla no hay nada que hacer
                invalid = true;
            }
            if (!invalid){ //si la posibilidad es viable
                for (let cells of cellsTableIA){
                    let x = parseInt(cells.getAttribute('data-x'));
                    let y = parseInt(cells.getAttribute('data-y'));
                    let life = parseInt(cells.getAttribute('data-life'));
                    const currentCell = [x, y];

                        if (compareCoordinates(currentCell, pos) && life < 1){
                            invalid = true; //si la posibilidad coincide con una celda ya tocada, marcar como inviable
                            break;
                        }
                    
                    if (invalid){
                        break;
                    }              
                }
            }

            if (!invalid){
                console.log("Celdas adyacentes posibles:", pos);
                adjacentCells.push(pos); //insertar posibilidad si las condiciones se cumplen
            }
        }
        
        return adjacentCells;    
    }
    function isValidCell([x, y]){
        return x >= 1 && x <= 10 && y >= 1 && y <= 10; 
    }

    // LOGICA DE TOCAR --

    // Marcar la celda como tocada
    function markCellAsTouched([x, y]) {
        for (let cell of cellsTableIA) {
            const cellX = parseInt(cell.getAttribute('data-x'));
            const cellY = parseInt(cell.getAttribute('data-y'));
            if (cellX === x && cellY === y) {
                cell.setAttribute('data-touched', 'true'); // Marca la celda como tocada

                // Actualiza cpuLeftCells eliminando la celda tocada
                for (var j = 0; j < cpuLeftCells.length; j++) {
                    if (cpuLeftCells[j].x === x && cpuLeftCells[j].y === y) {
                        cpuLeftCells.splice(j, 1); // Elimina la celda tocada
                        break;
                    }
                }
                break;
            }
        }
    }

    // Función para obtener las celdas adyacentes
    function getAdjacentCells([x, y]) {
        const adjacent = [];
        const directions = [
            [0, 1],   // derecha
            [1, 0],   // abajo
            [0, -1],  // izquierda
            [-1, 0],  // arriba
        ];

        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 1 && newX <= 10 && newY >= 1 && newY <= 10) {
                adjacent.push([newX, newY]);
            }
        }
        return adjacent;
    }

    // Función para verificar si la celda está disponible
    function isCellAvailable([x, y]) {
        // Comprobar si la celda ha sido tocada
        for (const cell of cellsTableIA) {
            const cellX = parseInt(cell.getAttribute('data-x'));
            const cellY = parseInt(cell.getAttribute('data-y'));
            if (cellX === x && cellY === y) {
                return cell.getAttribute('data-touched') === 'false'; // Solo devolver true si no ha sido tocada
            }
        }
        return false; // Si la celda no existe o ya ha sido tocada
    }


    // Nueva función para encontrar celdas adyacentes a aciertos
    function findNextAttackFromHits(hits) {
        const adjacentCells = new Set();

        hits.forEach(function (hit) {
            const cells = getAdjacentCells(hit);
            cells.forEach(function (cell) {
                if (isCellAvailable(cell)) {
                    adjacentCells.add(JSON.stringify(cell)); // Usa un Set para evitar duplicados
                }
            });
        });

        if (adjacentCells.size > 0) {
            const randomCell = Array.from(adjacentCells)[Math.floor(Math.random() * adjacentCells.size)];
            return JSON.parse(randomCell);
        }

        return null; // Si no hay celdas adyacentes disponibles
    }

    // Verifica si la celda es un acierto
    function checkIfHit(cell, dicShells) {
        return dicShells.some(function (shell) {
            return shell.touchedCoordinates.some(function (touched) {
                return compareCoordinates(touched, cell);
            });
        });
    }


    // mostrar todas las imagenes en tu tablero
    const cellsTableIA = document.getElementsByClassName("selectCellsIA");

    for (let cell of cellsTableIA) {


        let x = parseInt(cell.getAttribute('data-x'));
        let y = parseInt(cell.getAttribute('data-y'));
        const coordinateCellClicked = [x, y];

        let isShell = false;

        for (const shell of dicShellsIA) {
            for (const coordinate of shell.coordinates) {


                if (compareCoordinates(coordinate, coordinateCellClicked)) {

                    const tipeShell = shell.shellType;
                    cell.setAttribute('data-photo', tipeShell);
                    isShell = true;
                }
            }
        }

        if (!isShell) {
            cell.setAttribute('data-photo', 'sand');
        }

    }

    // función auxiliar que compara dos coordenadas: devuelve true si son iguales or false si no son iguales
    function compareCoordinates(coord1, coord2) {
        return coord1[0] === coord2[0] && coord1[1] === coord2[1];
    }

    // comprueba si se ha destapado todo el grupo de conchas
    function isGrupShellDiscovered(shell) {

        for (const coordinate of shell.coordinates) {

            let found = false;

            for (const touchedCoordinate of shell.touchedCoordinates) {

                if (compareCoordinates(coordinate, touchedCoordinate)) {
                    found = true;
                    break;
                }
            }

            // si no ha encontrado la coordenada en touchedCoordinates
            if (!found) {
                return false;
            }
        }

        return true;
    }

    // comprueba si se han destapado todos los grupos de conchas
    function isWin(dicShells) {

        for (const shell of dicShells) {
            if (!isGrupShellDiscovered(shell)) {
                return false;
            }
        }

        return true;
    }

    // comprueba si la celda tocada es aigua o qué 
    function checkClickedCell(dicShells, coordinateClickedCell) {

        // valores auxiliares
        let touch = false;
        let cellState = "water";
        let groupIsDiscovered = false;
        

        for (const shell of dicShells) {
            let index = 0;
            for (const coordinate of shell.coordinates) {
                
                // se tienen que comparar cada una de las coordenadas, sino compara la dirección de memoria del objeto
                if (compareCoordinates(coordinate, coordinateClickedCell)) { // si es una concha
                    touch = true;
                    cellState = "shell";
                    
                    //Sonido de acierto
                    sonidoAcierto.play();
                    
                    //reducimos en 1 la vida de la casilla
                    console.log(shell.lives);
                    shell.lives[index]--;
                    life = shell.lives[index];
                    console.log(shell.lives);
                    // añadimos esta coordenada a las de touched cuando su vida es 0
                    if (shell.lives[index] < 1){
                        shell.touchedCoordinates.push(coordinateClickedCell);
                        console.log("coordenada añadida")
                    }

                    // comprobar si todo el grupo ha sido descubierto
                    groupIsDiscovered = isGrupShellDiscovered(shell);

                    if (groupIsDiscovered) {
                        cellState = "groupShell";
                    }

                    //si has acertado, añade puntos
                    if (turn) {
                        pointsAdd();
                    }
                    
                    return [touch, cellState, groupIsDiscovered, life];
                }
                index++;
            }
        }

        // si es agua
        //resta puntos y sonido

        sonidoAgua.play();
        if (turn) {
            pointsSubstract();
        }
        life = 0; // si no es una concha la vida de la casilla es 0
        return [touch, cellState, groupIsDiscovered, life];

    }

    // mostrar la imagen en la celda
    function setImageInCell(dicShells, coordinateClickedCell, e) {
        const cell = e.target;

        let isShell = false;

        for (const shell of dicShells) {
            let index = 0;
            for (const coordinate of shell.coordinates) {

                if (compareCoordinates(coordinate, coordinateClickedCell)) {

                    const tipeShell = shell.shellType;
                    console.log(tipeShell);
                    //No mostrar la imagen de la concha hasta ser descubierta del todox
                    if(shell.lives[index] > 0){
                        cell.style.backgroundColor = "blue";
                    }else{                     
                        cell.setAttribute('data-photo', tipeShell);
                    }
                    isShell = true;
                }
                index++;
            }
        }

        if (!isShell) {
            cell.setAttribute('data-photo', 'sand');
        }

    }

    // printea el mensaje
    function printMessageOnClick(cellState) {

        // diccionario de mensajes
        const messageClickCells = {
            water: "Informació<br/><br/>Aigua",
            shell: "Informació<br/><br/>Tocat",
            groupShell: "Informació<br/><br/>Tocal i enfonsat",
            win: "Èxit<br/><br/>Has guanyat!",
            lose: "Perill<br/><br/>Has perdut!",
            userNotMun: "Informació<br/><br/>Ja no tens més munició",
            iaNotMun: "Informació<br/><br/>L'ia ja no té més munició",

        };

        // Mostrar el string en el div con id="resultado" | <div id="message"></div>
        const messageElement = document.getElementById("message"); // se guarda el elemento
        messageElement.innerHTML = messageClickCells[cellState];

        if (cellState == 'win') {
            messageElement.style.border = "3px solid green";
            messageElement.style.borderLeft = "5px solid green";
            messageElement.style.color = "rgb(4, 155, 4)";
            messageElement.style.backgroundColor = "rgba(255, 253, 253, 0.365)";
        }

        else if (cellState == 'userNotMun' || cellState == 'iaNotMun') {
            messageElement.style.border = "3px solid yellow";
            messageElement.style.borderLeft = "5px solid yellow";
            messageElement.style.color = "rgb(231, 211, 63)";
            messageElement.style.backgroundColor = "rgba(147, 147, 147, 0.614)";
        }

        else if (cellState == 'lose') {
            messageElement.style.border = "3px solid red";
            messageElement.style.borderLeft = "5px solid red";
            messageElement.style.color = "rgb(241, 12, 12)";
            messageElement.style.backgroundColor = "rgba(147, 147, 147, 0.614)";
        }


        else {

            messageElement.style.border = "3px solid blue";
            messageElement.style.borderLeft = "5px solid blue";
            messageElement.style.color = "rgb(20, 20, 249)"
            messageElement.style.backgroundColor = "rgba(255, 253, 253, 0.365)";
        }

        // Limpiar el timeout anterior si existe
        if (messageTimeout !== null) {
            clearTimeout(messageTimeout);
        }

        // Establecer un nuevo timeout para ocultar el mensaje
        messageTimeout = setTimeout(function () {
            messageElement.innerHTML = "";
            messageElement.style.border = "none";
            messageElement.style.backgroundColor = "transparent";
        }, 4000);
    }

    // función click - descrubrir la celda - LA PRINCIPAL
    function discoverCell(e, dicShells) {
        const cell = e.target;

        let x = parseInt(cell.getAttribute('data-x'));
        let y = parseInt(cell.getAttribute('data-y'));
        const cellIsTouched = cell.getAttribute('data-touched');
        let cellLife = parseInt(cell.getAttribute('data-life'));
        const coordinateCellClicked = [x, y];
   

        console.log(coordinateCellClicked);


        // si no se ha tocado aún
        //if (cellIsTouched === 'false') {
        // if (cellLife > 0 ) {

            //cell.classList.add(nameOfClass);

            let [touch, cellState, groupIsDiscovered, life] = checkClickedCell(dicShells, coordinateCellClicked);
            // cambiar el estado de la celda para que no vuelvas a girarla
            cell.setAttribute('data-touched', 'true');

            cell.setAttribute('data-life', life);

            // mostrar la imagen de la celda
            setImageInCell(dicShells, coordinateCellClicked, e);

            // mostrar el mensaje
            printMessageOnClick(cellState);

            // comprueba si has ganado la partida
            if (groupIsDiscovered) {
                if (isWin(dicShells)) {
                    //Sonido win
                    sonidoWin.play();
                    printMessageOnClick('win');

                    //calcular puntos del final
                    endgamePoints();

                    // después de 2 segundo te vas a win.php
                    setTimeout(function () {
                        document.getElementById("endForm").submit();
                        //window.location.href = "win.php";
                    }, 6000);
                }
            }

            console.log("touch es " + touch + "\n y cellState es " + cellState + " y el grupo está descubierto? " + groupIsDiscovered);
            return [cellState, life]; //necesito un return para saber si el jugador acierta y su turno sigue
        // }
        // return [cellState, life]; //necesito un return para saber si el jugador acierta y su turno sigue
    
        for (const shell of dicShells) {
            console.log(shell);
        }
    }



    // PUNTUACIÓN --

    // función calcular puntos
    function calculatePointsByTime() {
        timerPoints = 100000 * ((9 / Math.pow(1000, (totalSeconds / 4000))) + 1); //formula que añade un multiplicador a un valor inicial; cuando totalSeconds=0, el multiplicador es cercano a 10, y a más avanza totalSeconds el multiplicador se va acercando a 1 
        //el ritmo de la formula se puede modificar cambiando los valores 100 y 300; ahora mismo en 150 segundos el multiplicador es alrededor de 2, y en 300 segundos es cercano a 1
        //para ver la curva sobre el tiempo se puede usar WolframAlpha: plot 100000*9/1000^(x/4000)+1, x=0 to 900
        //curva de pérdida de puntos cambiada a más relajada; más o menos baja a la mitad a los 300 segundos y a los 900 segundos está cerca de los 200000 puntos
        roundedPoints = Math.round(timerPoints); //redondeamos porque a nadie le gusta ver decimales en la puntuación
    }

    // función añadir puntos
    function pointsAdd() {
        if (lastHit === true) { streak++ };
        lastHit = true;
        actionPoints = actionPoints + 5000;
        //document.getElementById('shipScore').innerHTML =  actionPoints;
        document.getElementById('totalScore').innerHTML = roundedPoints + actionPoints;
    }

    // función quitar puntos
    function pointsSubstract() {
        lastHit = false;
        if (streak > maxStreak) { maxStreak = streak }; //guardar racha maxima para aplicarla al final de la partida
        if (streak > 0) { actionPoints = actionPoints * streak }; //al finalizar racha existente, multiplicar puntos de barcos por racha y reiniciar la racha a 0
        streak = 0;
        actionPoints = actionPoints - 250;
        //document.getElementById('shipScore').innerHTML =  actionPoints;
        document.getElementById('totalScore').innerHTML = roundedPoints + actionPoints;
    }

    // función de guardar los puntos final
    function endgamePoints() {
        //desactivar input jugador
        for (let cell of cells) {
            //quitamos el evento click de las celdas       
            cell.removeEventListener("click", eventHandler);
            console.log("hola");
        }
        stopChronometer(); //paramos el reloj
        if (streak == 0) { streak = 1 }; //vamos a multiplicar la racha actual así que debemos evitar el 0
        let totalPoints = 200000 + (roundedPoints + (actionPoints * streak)) * maxStreak; //los puntos totales son la suma de puntos de tiempo + (puntos de celdas * racha actual) y todo multiplicado por la racha máxima de la partida 
        document.getElementById('totalScore').innerHTML = totalPoints;
        document.getElementById('endgameHidden').value = totalPoints;
        return totalPoints;
    }

    // función de perder puntos
    function loseEndgamePoints() {
        stopChronometer(); //paramos el reloj
        let totalPoints =  roundedPoints + actionPoints -200000;
        document.getElementById('totalScore').innerHTML = totalPoints;
        document.getElementById('loseEndgameHidden').value = totalPoints;
        return totalPoints;
    }



    // CRONOMETRO --

    //llamar al cronómetro si existe el elemento en la página
    const clock = document.getElementById('chrono');
    if (clock) {
        chronometer();
    }

    // función del cronómetro
    function chronometer() {
        seconds++;
        totalSeconds++;
        if (seconds > 59) { seconds = 0; minutes++; }; //cuando los segundos llegan a superar 59, ponerlos a 0 y sumar un minuto
        seconds = formatTime(seconds);
        minutes = formatTime(minutes);
        calculatePointsByTime();
        document.getElementById('chrono').innerHTML = minutes + ":" + seconds; //printear cronometro
        //document.getElementById('score').innerHTML =  roundedPoints; 
        document.getElementById('totalScore').innerHTML = roundedPoints + actionPoints;
        countUp = setTimeout(chronometer, 1000); //chronometer se llama a sí misma pasados 1000ms, o lo que es lo mismo, una vez por segundo
        //setTimeout devuelve un ID que se puede guardar para usarlo luego con clearTimeout y detener el bucle
    }

    // función de parar el cronómetro
    function stopChronometer() {
        clearTimeout(countUp); //clearTimeout detiene el setTimeout cuyo ID le pases por parametro 
    }

    // dar formato al reloj
    function formatTime(i) {
        if (i < 10 && typeof i != "string") { i = "0" + i };  // añade un 0 delante en forma de string en los dígitos simples, ademas contempla que la variable no sea string: importante para que no se añada un 0 adicional en cada llamada
        return i;
    }

});

