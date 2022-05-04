
let cards = []; //array de las cartas (todas)

let players = []; //jugadores
let remainingPlayers = []; //jugadores que quedan

let defaultHP = 15;
let exampleHP = 15;
let pjs = []; //guardamos los iconos de los personajes
let randomCharPos;

let gameMode; //player-config, playing
let round = 1;
let turn = 0;
let points = [];
let modalActive = false;

const black = "linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(112, 112, 112) 33%, rgba(255,255,255,1) 100%)";
const blue = "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 33%, rgba(0,212,255,1) 100%)";
const red = "linear-gradient(90deg, rgba(36,23,0,1) 0%, rgba(79,0,0,1) 48%, rgba(255,55,55,1) 100%)";
const green = "linear-gradient(90deg, rgba(36,23,0,1) 0%, rgba(0,57,5,1) 35%, rgba(13,125,0,1) 100%)";
const yellow = "linear-gradient(90deg, rgba(36,23,0,1) 0%, rgba(77,79,0,1) 40%, rgba(194,198,0,1) 100%)";
const purple = "linear-gradient(90deg, rgba(36,23,0,1) 0%, rgba(63,0,79,1) 49%, rgba(156,65,255,1) 100%)";

// let cardConfigButtons;

window.onload = function(){

    //guardamos los puntos que tiene una diana
    for(var x = 1; x < 21; x++){
        points.push(x)
    }

    changeGameMode("player-config"); //comenzamos en el modo de configuración

    //creamos e inicializamos las cartas, que son copias de una plantilla oculta en el html
    addCard(2); //creamos las cartas para que podamos añadir los jugadores 

    //botones de configuración
    initializeSettings();
    
    //preview diana modal
    initializeBoard();
    
    //jugadores por defecto
    setPlayers();
    
}


function setPlayers(){
    
    let card0 = new Card("Jugador 1", "purple", 2, "confirmed", cards[0], defaultHP);
    let card1 = new Card("Jugador 2", "blue", 1, "confirmed", cards[1], defaultHP);
    // let card2 = new Card("Jugador 3", "red", 7, "confirmed", cards[2], defaultHP);
    // let card3 = new Card("Jugador 4", "blue", 6, "confirmed", cards[3], defaultHP);

    createPlayer(cards[0], 0)
    createPlayer(cards[1], 1)
    // createPlayer(cards[2], 2)
    // createPlayer(cards[3], 3)
    
}

function addCard(times=1){ //por defecto crea una extra

    var original = document.querySelector(".card-container");

    for(var t = 0; t < times; t++){

        var clone = original.cloneNode(true);
        clone.style.display = "";
        original.parentNode.appendChild(clone);
    }

    updateCards();
    initializePlayersTable();
    initializeCardConfigButtons();

}

function removeCard(card){

    card.parentNode.parentNode.remove();
    updateCards();
    updatePlayers();
}

function cleanCards(){ //limpia el tablero de cartas no confirmadas

    cards.forEach((card)=>{
        
        if(card.querySelectorAll(".card-content")[2].style.display == "none"){ //si no está confirmado, borramos la carta
            
            card.remove();
        }
    })
}

function updateCards(){ //básicamente aseguramos que cards son las que no están ocultas

    cards = []; //primero vacíamos el array para que no se añadan de nuevo

    document.querySelectorAll(".card-container").forEach((card)=>{

        if(card.style.display != "none") cards.push(card);
    })
}


function createPlayer(card, index){

    //Nombre del jugador
    let name = card.querySelector(".set-player-name").value;

    if(!name) name = card.querySelector(".set-player-name").placeholder;

    name = name.charAt(0).toUpperCase() + name.slice(1); //Primera letra mayúscula

    //Color
    let color = card.querySelector(".colors").value;
    
    //Imagen
    let pj = 1; //si no se encuentra colocamos la primera

    card.querySelectorAll(".character-selector td").forEach((td,pos)=>{
        if(td.classList.contains("selected")){
            pj = pos+1;
        }
    })

    players[index] = new Card(name, color, pj, "confirmed", cards[index], defaultHP);

    if(randomCharPos == pj){

        //sin esta comprobación, se mantendría seleccionado el random y el personaje, por lo que habría dos casillas seleccionadas
        //lo que hacemos es que al confirmar, borramos el selected de aleatorio, por lo que el selected se asigna a otro personaje
        let aux = card.querySelectorAll(".selected")[1]; //el primero [0] siempre es un pj y el segundo [1] es el random, así que borramos el [1]
        aux.classList.remove("selected");
    }

    // console.log("Añadido",players[index]);
}

function updatePlayers(){
    
    // console.log("Actualizando jugadores...");

    players = [];

    cards.forEach((card,index)=>{

        if(card.querySelectorAll(".card-content")[2].style.display != "none"){ //nos aseguramos de que jugadores son solo los confirmados
            createPlayer(card, index);
        }
    })

    cleanPlayers(); //limpiamos los posibles huecos vacíos en el array de jugadores

    // console.log("Actualizado. Jugadores:", players)
}

function cleanPlayers(){ //a veces borramos un jugador del medio del array y se queda undefined
    
    aux = [];

    players.forEach((player)=>{
        aux.push(player)
    })

    players = aux;
}


function applyColor(color){ //color como string a linear

    switch(color){
        case "black": return black;
        case "blue": return blue;
        case "red": return red;
        case "green": return green;
        case "yellow": return yellow;
        case "purple": return purple;
        default: return black;
    }
}



function changeCardContent(card,pos){
    //pos 0 -> editing, pos 1 -> deleted, pos 2 -> confirmed

    card.querySelectorAll(".card-content").forEach((content,index) => { //de la carta recibida, buscamos sus card content (que son 3, cada uno ligado a su botón por la posición)

        if(index != pos){ //index es la posición del card content y pos la posición del botón, por lo que si no coincide es que queremos ocultar 
            content.style.display = "none";
        }else{
            content.style.display = "block";
        }
    });

    card.querySelectorAll(".card-config-btn").forEach((btn)=>{ //activamos todos los botones
        btn.disabled = false

    });

    card.querySelectorAll(".card-config-btn")[pos].disabled = true; //desactivamos el que acabamos de pulsar
    
    if(pos == 0){ //si está borrado, no puedes confirmar ni editar
        card.querySelectorAll(".card-config-btn")[1].disabled = true;
        card.querySelectorAll(".card-config-btn")[2].disabled = true; 
    }
}

function deleteFocus(elem){
   elem.blur()
}