//todo: rachas, fallos, máxima racha

var timerPoints = -5;
var actionPoints = 0;
var roundedPoints = 0;
var lastHit = false;
var seconds = 0;
var totalSeconds = 0;
var minutes = 0;
var countUp = 0;

function calculatePoints(){
  timerPoints = 1000*((9/Math.pow(100,(totalSeconds/300)))+1); //formula que añade un multiplicador a un valor inicial; cuando totalSeconds=0, el multiplicador es cercano a 10, y a más avanza totalSeconds el multiplicador se va acercando a 1 
  //el ritmo de la formula se puede modificar cambiando los valores 100 y 300; ahora mismo en 150 segundos el multiplicador es alrededor de 2, y en 300 segundos es cercano a 1
  roundedPoints = Math.round(timerPoints);
  totalPoints = roundedPoints;
}

function testAdd(){
  actionPoints = actionPoints + 5000;
  document.getElementById('shipScore').innerHTML =  actionPoints;
}


function chronometer() {
  seconds++;
  totalSeconds++;
  if (seconds > 59){seconds = 0; minutes++;}; //cuando los segundos llegan a superar 59, ponerlos a 0 y sumar un minuto
  seconds = formatTime(seconds);
  minutes = formatTime(minutes);
  calculatePoints();
  document.getElementById('chrono').innerHTML =  minutes + ":" + seconds; //printear cronometro
  document.getElementById('score').innerHTML =  roundedPoints;
  
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

