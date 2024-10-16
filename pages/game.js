document.addEventListener("DOMContentLoaded", function() {
    
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

                    return [touch,cellState,groupIsDiscovered];
                }
            }
        }

        // si es agua
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
            water : "Aigua!",
            shell : "Tocat!",
            groupShell : "Tocal i enfonsat!",
            win : "Has guanyat!"
        };

         // Mostrar el string en el div con id="resultado" | <div id="message"></div>
        const messageElement = document.getElementById("message"); // se guarda el elemento
        messageElement.textContent = messageClickCells[cellState]; // se imprime el mensaje

        // Que desaparezca el mensaje
        setTimeout(function() {

            // para ocultarlo del todo: 'messageElement.style.display = "none"
            messageElement.textContent = "";
        }, 5000);
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

                    // después de 2 segundo te vas a win.php
                    setTimeout(function() {
                        window.location.href = "win.php";
                    }, 2000);
                }
                    
            }

            console.log("touch es "+touch+ "\n y cellState es "+cellState+" y el grupo está descubierto? "+groupIsDiscovered);

        }

        for(const shell of dicShells){
            console.log(shell);
        }
    }


    // click
    const cells = document.getElementsByClassName("selectCells");
    for(let cell of cells){

        // creamos una función anónima en la que le pasamos los parámetros que queremos
        cell.addEventListener("click",function(event){ 
            discoverCell(event,dicShells);
        }); 
    }

});