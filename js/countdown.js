const sonido = cargarSonido("_audio.mp3");

function resetCharada(){
	document.getElementById('btn-iniciar').style.display='inline';
	document.getElementById('cuenta').innerHTML="";
	document.getElementById('input-segundos').value = "";
	document.getElementById('cuenta').innerHTML="";
	document.getElementById('palabraCharada').innerHTML="";
	sonido.pause();
	sonido.currentTime = 0;
}

function palabraRandom(){
	const arrayFrases = JSON.parse(localStorage.getItem("arrayFrases") || "[]");
	const arrayPalabras = [...arrayFrases];
	const positionRandom = Math.floor(Math.random() * (arrayPalabras.length-1));
	const palabra = arrayPalabras[positionRandom];
	document.getElementById('palabraCharada').innerHTML=palabra;
	return palabra;
}

function guardaPalabras(){
	const palabras = document.getElementById('input-palabras').value;
	if(palabras==='' || palabras===0) {alert('Ingresa Datos'); return;}
	const array = palabras.split(',');
	let array_final = [];
	for (let index = 0; index < array.length; index++) {
		array_final.push(array[index].trim());		
	}
	localStorage.setItem("arrayFrases",JSON.stringify(array_final));
	document.getElementById('juego').style.display = 'block';
	document.getElementById('add_palabras').style.display = 'none';
}

function resetPalabras(){
	localStorage.setItem("arrayFrases",JSON.stringify([]));
	localStorage.setItem("arrayCharadas",JSON.stringify({}));
	window.location.reload();
}

function agragarToStorage(palabra){
	const arrayStorage = JSON.parse(localStorage.getItem("arrayCharadas") || "{}");
	if(Object.keys(arrayStorage).length === 0){
		localStorage.setItem("arrayCharadas",'{"palabras":["'+palabra+'"]}');
	}else{
		if(arrayStorage.palabras.length < 5){
			arrayStorage.palabras.push(palabra);
			localStorage.setItem("arrayCharadas",JSON.stringify(arrayStorage));
		}else{
			arrayStorage.palabras.shift();
			arrayStorage.palabras.push(palabra);
			localStorage.setItem("arrayCharadas",JSON.stringify(arrayStorage));
		}
	}
}

function iniciarCharada(){
	document.getElementById('cuenta').innerHTML="";	
	const valSegundos = document.getElementById('input-segundos').value;
	if(valSegundos==='' || valSegundos===0) {alert('Ingresa los segundos'); return;}

	const palabra = palabraRandom();

	const ahoraMoment = moment().subtract(5, 'hours').add(valSegundos, 's');
	const yearMoment = moment(ahoraMoment).get('y');
	const mesMoment = moment(ahoraMoment).get('month')+1;
	const diaMoment = moment(ahoraMoment).get('D');
	const horaMoment = moment(ahoraMoment).get('H');
	const minutoMoment = moment(ahoraMoment).get('m');
	const segundoMoment = moment(ahoraMoment).get('s');

	simplyCountdown('#cuenta', {
		year: yearMoment, // required
		month: mesMoment, // required
		day: diaMoment, // required
		hours: horaMoment, // Default is 0 [0-23] integer
		minutes: minutoMoment, // Default is 0 [0-59] integer
		seconds: segundoMoment, // Default is 0 [0-59] integer
		words: { //words displayed into the countdown
			days: 'Día',
			hours: 'Hora',
			minutes: 'Minuto',
			seconds: 'Segundo',
			pluralLetter: 's'
		},
		plural: true, //use plurals
		inline: false, //set to true to get an inline basic countdown like : 24 days, 4 hours, 2 minutes, 5 seconds
		inlineClass: 'simply-countdown-inline', //inline css span class in case of inline = true
		// in case of inline set to false
		enableUtc: true, //Use UTC as default
		onEnd: function() {
			agragarToStorage(palabra);
			document.getElementById('cuenta').innerHTML='<img src="./img/loco.webp" class="img-fluid" alt="Tiempo Expirado">';
			document.getElementById('btn-iniciar').style.display='inline';
			ultmasCharadas();
			sonido.play();
			setTimeout(() => {
				sonido.pause();
				sonido.currentTime = 0;
			}, 5000);
			return; 
		}, //Callback on countdown end, put your own function here
		refresh: 1000, // default refresh every 1s
		sectionClass: 'simply-section', //section css class
		amountClass: 'simply-amount', // amount css class
		wordClass: 'simply-word', // word css class
		zeroPad: false,
		countUp: false
	});

	document.getElementById('btn-iniciar').style.display='none';
}

function ultmasCharadas(){
	const arrayStorage = JSON.parse(localStorage.getItem("arrayCharadas") || "{}");
	if(Object.keys(arrayStorage).length === 0){
		document.getElementById('ultimasCharadas').innerHTML="...";
	}else{
		let htmlPalabras = '';
		const reverso = arrayStorage.palabras.reverse();
		reverso.forEach((palabra)=>{
			htmlPalabras+=`<h5>* ${palabra}</h5>`;
		});
		document.getElementById('ultimasCharadas').innerHTML = htmlPalabras;
	}
}

function cargarSonido(fuente) {
    const sonido = document.createElement("audio");
    sonido.src = fuente;
    sonido.setAttribute("preload", "auto");
    sonido.setAttribute("controls", "none");
    sonido.style.display = "none"; // <-- oculto
    document.body.appendChild(sonido);
    return sonido;
};

document.addEventListener("DOMContentLoaded",()=>{
	const arrayFrases = JSON.parse(localStorage.getItem("arrayFrases") || "[]");
	if(arrayFrases.length === 0){
		document.getElementById('juego').style.display = 'none';
	}else{
		document.getElementById('add_palabras').style.display = 'none';
	}
	document.getElementById('palabraCharada').innerHTML="";
	ultmasCharadas();
})