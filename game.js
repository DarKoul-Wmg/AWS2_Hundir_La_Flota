document.addEventListener("DOMContentLoaded", function() {

    // Asignar los audios a variables
    let sonidoAccion = document.getElementById('sonidoAccion');
    let sonidoAgua = document.getElementById('sonidoAgua');
    let sonidoAcierto = document.getElementById('sonidoAcierto');
  
    // Selecciona todos los botones en la página (sonido DEFAULT para todos los botones)
    let botones = document.querySelectorAll('button');

    // Añade un evento 'click' a cada botón para reproducir el sonido
    botones.forEach(function(boton) {
        boton.addEventListener('click', function() {
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

    // variable de las celdas que puedes darle click
    const cells = document.getElementsByClassName("selectCellsUser");

   
    var gameMode = 1;   // Especificar tipo de juego; numérico para añadir más tipos de juego en el futuro
                        // gameMode 0 => Tutorial
                        // gameMode 1 => VS CPU
    var turn = true;    // turnos: TRUE => Jugador, FALSE => CPU

    
    // evento click a cada celda
    for(let cell of cells){
        // creamos una función para poder pasar el parámetro event         
            cell.addEventListener("click",eventHandler);        
    };  
            
    //cambiada función anónima para poder referenciarla en el removeEventListener
    function eventHandler(event) { 
        if(turn){       
            if(discoverCell(event, dicShellsUser)==='water'){ //si la celda clicada es agua pasar el turno a la CPU
                turn = false;
                setTimeout(() => turnCPU(event, dicShellsIA), 3000);
            }           
        }
    }

    // función que devuelve el evento click a las celdas para que el jugador vuelva a tener turno; se llama al final del turno de la CPU
    function returnTurnToPlayer(){
        for(let cell of cells){
            if((cell.getAttribute('data-photo'))==='none'){ //solo devoler el evento a las celdas vacías, importante para no perder turnos en celdas ya clicadas
                cell.addEventListener("click",eventHandler);  
            }
            turn = true;     
        }; 
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

    function turnCPU(e, dicShellsIA) {
        if (!turn) {
            for (let cell of cells) {
                //quitamos el evento click de las celdas hasta que le vuelva a tocar al jugador         
                cell.removeEventListener("click", eventHandler);
            };
            let randomIndex = Math.floor(Math.random() * cpuLeftCells.length); // seleccionar índice aleatorio de la lista de movimientos restantes
            let coordinateInCPUTable;
            for (let cell of cellsTableIA) {
                let x = parseInt(cell.getAttribute('data-x'));
                let y = parseInt(cell.getAttribute('data-y'));
                const currentCell = [x, y];
                let aux = [cpuLeftCells[randomIndex].x, cpuLeftCells[randomIndex].y];
                if (compareCoordinates(currentCell, aux)) {
                    cell.setAttribute('data-photo', ''); //marcar la celda escogida, faltan estilos
                    coordinateInCPUTable = currentCell;
                };
            }
            cpuLeftCells.splice(randomIndex, 1); //eliminar la celda escogida de la lista de movimientos restantes
            console.log(dicShellsIA);

            const [touch, cellState, groupIsDiscovered] = checkClickedCell(dicShellsIA, coordinateInCPUTable);
            printMessageOnClick(cellState);
            if (touch) {
                setTimeout(() => turnCPU(e, dicShellsIA), 3000); //Repetir turno CPU a los 3 segundos
            } else {
                setTimeout(returnTurnToPlayer, 3000); //devolver turno al jugador a los 3 segundos
            };
        }
    }
    

    // mostrar todas las imagenes en tu tablero
    const cellsTableIA = document.getElementsByClassName("selectCellsIA");

    for(let cell of cellsTableIA){
    
        let x = parseInt(cell.getAttribute('data-x'));
        let y = parseInt(cell.getAttribute('data-y'));
        const coordinateCellClicked = [x,y];

        let isShell = false;

        for(const shell of dicShellsIA){
            for(const coordinate of shell.coordinates){


                if (compareCoordinates(coordinate,coordinateCellClicked)){

                    const tipeShell = shell.shellType;
                    cell.setAttribute('data-photo', tipeShell);
                    isShell = true;
                }
            }
        }

        if(!isShell){
            cell.setAttribute('data-photo', 'sand');
        }

    }

    //llamar al cronómetro si existe el elemento en la página
    const clock = document.getElementById('chrono');
    if(clock){
        chronometer();
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
            if (!found){
                return false;
            }
        }

        return true;
    }

    // comprueba si se han destapado todos los grupos de conchas
    function isWin(dicShells){

        for(const shell of dicShells){
            if(!isGrupShellDiscovered(shell)){
                return false;
            }
        }

        return true;
    }
    
    // comprueba si la celda tocada es aigua o qué
    function checkClickedCell(dicShells,coordinateClickedCell){

        // valores auxiliares
        let touch = false;
        let cellState  = "water";
        let groupIsDiscovered = false;

        for(const shell of dicShells){
            for(const coordinate of shell.coordinates){
                // se tienen que comparar cada una de las coordenadas, sino compara la dirección de memoria del objeto
                if (compareCoordinates(coordinate,coordinateClickedCell)){ // si es una concha
                    touch = true;
                    cellState = "shell";

                    //Sonido de acierto
                    sonidoAcierto.play();

                    // añadimos esta coordenada a las de touched
                    shell.touchedCoordinates.push(coordinateClickedCell);
                    console.log("coordenada añadida")

                    // comprobar si todo el grupo ha sido descubierto
                    groupIsDiscovered = isGrupShellDiscovered(shell);

                    if(groupIsDiscovered){
                        cellState="groupShell";
                    }

                    //si has acertado, añade puntos
                    if(turn){
                        pointsAdd();
                    }

                    return [touch,cellState,groupIsDiscovered];
                }
            }
        }

        // si es agua
        //resta puntos y sonido

        sonidoAgua.play();
        pointsSubstract();

        return [touch,cellState,groupIsDiscovered];
        
    }

    // mostrar la imagen en la celda
    function setImageInCell(dicShells,coordinateClickedCell,e){
        const cell = e.target;

        let isShell = false;

        for(const shell of dicShells){
            for(const coordinate of shell.coordinates){

                if (compareCoordinates(coordinate,coordinateClickedCell)){

                    const tipeShell = shell.shellType;
                    console.log(tipeShell);
                    cell.setAttribute('data-photo', tipeShell);
                    isShell = true;
                }
            }
        }

        if(!isShell){
            cell.setAttribute('data-photo', 'sand');
        }

    }

    // printea el mensaje
    function printMessageOnClick(cellState){

        // diccionario de mensajes
        const messageClickCells = {
            water : "Informació<br/><br/>Aigua",
            shell : "Informació<br/><br/>Tocat",
            groupShell : "Informació<br/><br/>Tocal i enfonsat",
            win : "Èxit<br/><br/>Has guanyat!"
        };

         // Mostrar el string en el div con id="resultado" | <div id="message"></div>
        const messageElement = document.getElementById("message"); // se guarda el elemento
        messageElement.innerHTML = messageClickCells[cellState];

        if(cellState=='win'){
            messageElement.style.border = "3px solid green";
            messageElement.style.borderLeft = "5px solid green";
            messageElement.style.color = "rgb(4, 155, 4)";
            messageElement.style.backgroundColor = "rgba(255, 253, 253, 0.365)";


        }
        else{
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
        messageTimeout = setTimeout(function() {
            messageElement.innerHTML = "";
            messageElement.style.border = "none";
            messageElement.style.backgroundColor = "transparent";
        }, 4000);
    }

    // función click - descrubrir la celda - LA PRINCIPAL
    function discoverCell(e,dicShells){
        const cell = e.target;

        let x = parseInt(cell.getAttribute('data-x'));
        let y = parseInt(cell.getAttribute('data-y'));
        const cellIsTouched = cell.getAttribute('data-touched');
        const coordinateCellClicked = [x,y];
        
        console.log(coordinateCellClicked);

        // si no se ha tocado aún
        if(cellIsTouched === 'false'){

            //cell.classList.add(nameOfClass);

            const [touch, cellState,groupIsDiscovered] = checkClickedCell(dicShells,coordinateCellClicked);

            // cambiar el estado de la celda para que no vuelvas a girarla
            cell.setAttribute('data-touched', 'true');

            // mostrar la imagen de la celda
            setImageInCell(dicShells,coordinateCellClicked,e);

            // mostrar el mensaje
            printMessageOnClick(cellState);

            // comprueba si has ganado la partida
            if(groupIsDiscovered){
                if(isWin(dicShells)){
                    //Sonido win
                    sonidoWin.play();
                    printMessageOnClick('win');

                    //calcular puntos del final
                    endgamePoints();

                    // después de 2 segundo te vas a win.php
                    setTimeout(function() {
                        document.getElementById("endForm").submit();
                        //window.location.href = "win.php";
                    }, 6000);
                }
            }

            console.log("touch es "+touch+ "\n y cellState es "+cellState+" y el grupo está descubierto? "+groupIsDiscovered);
            return cellState; //necesito un return para saber si el jugador acierta y su turno sigue
        }

        for(const shell of dicShells){
            console.log(shell);
        }
    }


    // función calcular puntos
    function calculatePointsByTime(){
        timerPoints = 100000*((9/Math.pow(1000,(totalSeconds/4000)))+1); //formula que añade un multiplicador a un valor inicial; cuando totalSeconds=0, el multiplicador es cercano a 10, y a más avanza totalSeconds el multiplicador se va acercando a 1 
        //el ritmo de la formula se puede modificar cambiando los valores 100 y 300; ahora mismo en 150 segundos el multiplicador es alrededor de 2, y en 300 segundos es cercano a 1
        //para ver la curva sobre el tiempo se puede usar WolframAlpha: plot 100000*9/1000^(x/4000)+1, x=0 to 900
        //curva de pérdida de puntos cambiada a más relajada; más o menos baja a la mitad a los 300 segundos y a los 900 segundos está cerca de los 200000 puntos
        roundedPoints = Math.round(timerPoints); //redondeamos porque a nadie le gusta ver decimales en la puntuación
    }
    
    // función añadir puntos
    function pointsAdd(){
    if(lastHit === true){streak++};
    lastHit = true;
    actionPoints = actionPoints + 5000;
    //document.getElementById('shipScore').innerHTML =  actionPoints;
    document.getElementById('totalScore').innerHTML =  roundedPoints + actionPoints;
    }
    
    // función quitar puntos
    function pointsSubstract(){
    lastHit = false;
    if(streak>maxStreak){maxStreak=streak}; //guardar racha maxima para aplicarla al final de la partida
    if(streak>0){actionPoints = actionPoints * streak}; //al finalizar racha existente, multiplicar puntos de barcos por racha y reiniciar la racha a 0
    streak = 0;
    actionPoints = actionPoints - 250;
    //document.getElementById('shipScore').innerHTML =  actionPoints;
    document.getElementById('totalScore').innerHTML =  roundedPoints + actionPoints;
    }
    
    // función de guardar los puntos final
    function endgamePoints(){
    stopChronometer(); //paramos el reloj
    if(streak==0){streak = 1}; //vamos a multiplicar la racha actual así que debemos evitar el 0
    let totalPoints = (roundedPoints + (actionPoints * streak)) * maxStreak; //los puntos totales son la suma de puntos de tiempo + (puntos de celdas * racha actual) y todo multiplicado por la racha máxima de la partida 
    document.getElementById('totalScore').innerHTML =  totalPoints;
    document.getElementById('endgameHidden').value =  totalPoints;
    return totalPoints;
    }
    
    // función del cronómetro
    function chronometer() {
    seconds++;
    totalSeconds++;
    if (seconds > 59){seconds = 0; minutes++;}; //cuando los segundos llegan a superar 59, ponerlos a 0 y sumar un minuto
    seconds = formatTime(seconds);
    minutes = formatTime(minutes);
    calculatePointsByTime();
    document.getElementById('chrono').innerHTML =  minutes + ":" + seconds; //printear cronometro
    //document.getElementById('score').innerHTML =  roundedPoints; 
    document.getElementById('totalScore').innerHTML =  roundedPoints + actionPoints;
    countUp = setTimeout(chronometer, 1000); //chronometer se llama a sí misma pasados 1000ms, o lo que es lo mismo, una vez por segundo
    //setTimeout devuelve un ID que se puede guardar para usarlo luego con clearTimeout y detener el bucle
    }
    
    // función de parar el cronómetro
    function stopChronometer() {
    clearTimeout(countUp); //clearTimeout detiene el setTimeout cuyo ID le pases por parametro 
    }
    
    // dar formato al reloj
    function formatTime(i) {
        if (i < 10 && typeof i != "string") {i = "0" + i};  // añade un 0 delante en forma de string en los dígitos simples, ademas contempla que la variable no sea string: importante para que no se añada un 0 adicional en cada llamada
        return i;
    }

});