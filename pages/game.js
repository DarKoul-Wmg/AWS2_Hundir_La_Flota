document.addEventListener("DOMContentLoaded", function() {
    
    // diccionario de mensajes
    const messageClickCells = {
        water : "Aigua!",
        shell : "Tocat!",
        groupShell :  "Tocal i enfonsat!"
    };


    // placeholder de celda clicada
    const coordinateClickedCell = [2,5];

    // función auxiliar que compara dos coordenadas: devuelve true si son iguales or false si no son iguales
    function compareCoordinates(coord1, coord2) {
        return coord1[0] === coord2[0] && coord1[1] === coord2[1];
    }
    

    // comprueba si se ha destapado todo el grupo de conchas: le pasas todas las coordenadas
    function isGrupShellDiscovered(shell) {

        // si el grupo de conchas está destapado
        let groupIsDiscovered = false;


        for (const coordinate of shell.coordinates) {

            let found = false;

            for (const touchedCoord of shell.touchedCoordinates) {

                if (compareCoordinates(coordinate, touchedCoord)) {
                    found = true;
                }
                
            }

            // si no ha encontrado la coordenada en touchedCoordinates
            if (!found){
                console.log(`La coordenada ${coordinate} no está en touchedCoordinates.`);
                groupIsDiscovered = false;
            }
            else{
                groupIsDiscovered = true;
            }
        }

        return groupIsDiscovered;
    }
    
    function checkClickedCell(dicShells,coordinateClickedCell){

        // valores auxiliares
        let touch = false;
        let cellState  = "water"; // undefined o los valores del dic messageClickCells
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

    const [touch, cellState,groupIsDiscovered] = checkClickedCell(dicShells,coordinateClickedCell);

    for(const shell of dicShells){
        console.log(shell);
    }

    console.log("touch es "+touch+ "\n y cellState es "+cellState+" y lel grupo está descubierto? "+groupIsDiscovered);

});