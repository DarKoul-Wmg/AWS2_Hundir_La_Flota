

// -------- ex 9 ----------

let ship = {
    size: 3,
    coordinates: [[3,3],[3,4],[3,5]],
    isUsed: false,
    damaged: [[]]
}

// ------ ex10 ---------- 

function modifyCell(cellID){
    const cell = document.getElementById(cellID);
    console.log(cell);

    if(cell){
        cell.style.backgroundColor = "black"; 
        cell.textContent = "X";  
        cell.style.color="red";            
    } else{
        console.log("Cell no exist");
    }
}

// pruebas ex10
let clickCoordinates; // let para reasignar variable

for (let i = 1; i < 5; i++) {
    const randomNum1 = Math.floor(Math.random() * 10) + 1;  
    const randomNum2 = Math.floor(Math.random() * 10) + 1;  

    clickCoordinates = "cell_" + randomNum1 + "_" + randomNum2; // Genera el ID de la celda
    console.log("Coordinate ", i, "-->", clickCoordinates);

    modifyCell(clickCoordinates);  
}

// Ejemplo adicional para modificar una celda específica
modifyCell("cell_2_2");


