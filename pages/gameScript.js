//todo:

var timerPoints = 0;
var actionPoints = 0;
var roundedPoints = 0;
var lastHit = false;
var streak = 0;
var maxStreak = 1;
var seconds = 0;
var totalSeconds = 0;
var minutes = 0;
var countUp = 0;

function calculatePointsByTime(){
  timerPoints = 100000*((9/Math.pow(100,(totalSeconds/300)))+1); //formula que añade un multiplicador a un valor inicial; cuando totalSeconds=0, el multiplicador es cercano a 10, y a más avanza totalSeconds el multiplicador se va acercando a 1 
  //el ritmo de la formula se puede modificar cambiando los valores 100 y 300; ahora mismo en 150 segundos el multiplicador es alrededor de 2, y en 300 segundos es cercano a 1
  roundedPoints = Math.round(timerPoints); //redondeamos porque a nadie le gusta ver decimales en la puntuación
}

function testAdd(){
  if(lastHit === true){streak++};
  lastHit = true;
  actionPoints = actionPoints + 5000;
  document.getElementById('shipScore').innerHTML =  actionPoints;
}

function testSubstract(){
  lastHit = false;
  if(streak>maxStreak){maxStreak=streak}; //guardar racha maxima para aplicarla al final de la partida
  if(streak>0){actionPoints = actionPoints * streak}; //al finalizar racha existente, multiplicar puntos de barcos por racha y reiniciar la racha a 0
  streak = 0;
  actionPoints = actionPoints - 250;
  document.getElementById('shipScore').innerHTML =  actionPoints;
}

function endgamePoints(){
  stopChronometer(); //paramos el reloj
  if(streak==0){streak = 1}; //vamos a multiplicar la racha actual así que debemos evitar el 0
  let totalPoints = (roundedPoints + (actionPoints * streak)) * maxStreak; //los puntos totales son la suma de puntos de tiempo + (puntos de celdas * racha actual) y todo multiplicado por la racha máxima de la partida 
  document.getElementById('endgame').innerHTML =  totalPoints;
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

