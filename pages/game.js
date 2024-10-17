document.addEventListener("DOMContentLoaded", function() {



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

     // click
 const cells = document.getElementsByClassName("selectCells");
 

 for(let cell of cells){

     // creamos una función anónima en la que le pasamos los parámetros que queremos
     cell.addEventListener("click",function(event){ 
         discoverCell(event,dicShells);
     }); 
 }

    chronometer();
    
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

                    // añadimos esta coordenada a las de touched
                    shell.touchedCoordinates.push(coordinateClickedCell);
                    console.log("coordenada añadida")

                    // comprobar si todo el grupo ha sido descubierto
                    groupIsDiscovered = isGrupShellDiscovered(shell);

                    if(groupIsDiscovered){
                        cellState="groupShell";
                    }

                    //si has acertado, añade puntos
                    pointsAdd();

                    return [touch,cellState,groupIsDiscovered];
                }
            }
        }

        // si es agua

        //resta puntos
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
            messageElement.style.color = "rgb(26, 182, 26)";

        }
        else{
            messageElement.style.border = "3px solid red";
            messageElement.style.borderLeft = "5px solid red";
            messageElement.style.color = "rgb(245, 30, 30)"
        }

        // Que desaparezca el mensaje
        setTimeout(function() {
            messageElement.innerHTML = "";
            messageElement.style.border = "none";
        }, 8000);
    }

    // función click
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
                    printMessageOnClick('win');

                    //calcular puntos del final
                    endgamePoints();

                    // después de 2 segundo te vas a win.php
                    setTimeout(function() {
                        document.getElementById("endForm").submit();
                        //window.location.href = "win.php";
                    }, 2000);
                }
                    
            }

            console.log("touch es "+touch+ "\n y cellState es "+cellState+" y el grupo está descubierto? "+groupIsDiscovered);

        }

        for(const shell of dicShells){
            console.log(shell);
        }
    }

    function calculatePointsByTime(){
        timerPoints = 100000*((9/Math.pow(100,(totalSeconds/300)))+1); //formula que añade un multiplicador a un valor inicial; cuando totalSeconds=0, el multiplicador es cercano a 10, y a más avanza totalSeconds el multiplicador se va acercando a 1 
        //el ritmo de la formula se puede modificar cambiando los valores 100 y 300; ahora mismo en 150 segundos el multiplicador es alrededor de 2, y en 300 segundos es cercano a 1
        roundedPoints = Math.round(timerPoints); //redondeamos porque a nadie le gusta ver decimales en la puntuación
      }
      
      function pointsAdd(){
        if(lastHit === true){streak++};
        lastHit = true;
        actionPoints = actionPoints + 5000;
        //document.getElementById('shipScore').innerHTML =  actionPoints;
        document.getElementById('totalScore').innerHTML =  roundedPoints + actionPoints;
      }
      
      function pointsSubstract(){
        lastHit = false;
        if(streak>maxStreak){maxStreak=streak}; //guardar racha maxima para aplicarla al final de la partida
        if(streak>0){actionPoints = actionPoints * streak}; //al finalizar racha existente, multiplicar puntos de barcos por racha y reiniciar la racha a 0
        streak = 0;
        actionPoints = actionPoints - 250;
        //document.getElementById('shipScore').innerHTML =  actionPoints;
        document.getElementById('totalScore').innerHTML =  roundedPoints + actionPoints;
      }
      
      function endgamePoints(){
        stopChronometer(); //paramos el reloj
        if(streak==0){streak = 1}; //vamos a multiplicar la racha actual así que debemos evitar el 0
        let totalPoints = (roundedPoints + (actionPoints * streak)) * maxStreak; //los puntos totales son la suma de puntos de tiempo + (puntos de celdas * racha actual) y todo multiplicado por la racha máxima de la partida 
        document.getElementById('totalScore').innerHTML =  totalPoints;
        document.getElementById('endgameHidden').value =  totalPoints;
        return totalPoints;
      }
      
      
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
      
      function stopChronometer() {
        clearTimeout(countUp); //clearTimeout detiene el setTimeout cuyo ID le pases por parametro 
      }
      
      function formatTime(i) {
          if (i < 10 && typeof i != "string") {i = "0" + i};  // añade un 0 delante en forma de string en los dígitos simples, ademas contempla que la variable no sea string: importante para que no se añada un 0 adicional en cada llamada
          return i;
      }   


});



