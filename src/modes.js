

//--------------------------- MODOS

//Modo configurar jugadores
function playersMode(){

    changeGameMode("player-config");

    forceCloseToast();

    updatePlayers(); //actualizamos los jugadores y sus barras de salud

    //todo falta todo esto entero, que es lo contrario que playing básicamente
}

//Modo jugar
function playMode(){
    
    if(players.length < 2){
        alert("Debe haber almenos dos jugadores confirmados!");
        return;
    }
    
    //borramos las que no tienen nada
    cleanCards();
    
    //actualizamos e inicializamos (primero las cartas porque los jugadores se actualizan por las cartas)
    updateCards(); //como algunas cartas puede que hayan desaparecido, actualizamos cards (guardamos las no ocultas)
    updatePlayers(); //antes los jugadores estaban ligados a las cartas, ahora están ligados solo a las cartas jugables (esto solo es necesario si añadimos jugadores en cartas vacías)
    

    //cambiando a playing
    changeGameMode("playing");

    //preparamos la info de la partida
    turn = 0;
    round = 1;
    document.getElementById("player-turn").innerHTML = players[turn].name;
    document.getElementById("round").innerHTML = round;

    //nos aseguramos de reiniciar los puntos vitales por si se quedó alguno activo la última partida
    cards.forEach((card)=>{
        card.querySelector(".weak-points").style.display = "";
        card.querySelector(".safe-points").style.display = "none";
    })

    //y el turno del primer jugador
    cards[0].querySelector(".weak-points").style.display = "none";
    cards[0].querySelector(".safe-points").style.display = "";

    //que se note quien va primero
    cards[0].style.boxShadow = "rgb(255 219 118) 2px 2px 25px 7px";

    //ya que hemos cambiado cosas en el los puntos vitales es importante el orden
    healthController(); //inicializamos el control de la vida
    assignPoints(); //cada vez que se llama al método, cambian los números

    remainingPlayers = players;
    // console.log("Jugadores",players);

    //Mostramos un esquema de dónde debe lanzar el jugador
    displayBoardScheme();
}


function assignPoints(){ //points[1-20]

    //inner html en los points
    //!!solo reasignamos en los jugadores vivos
    
    cards.forEach((card,index)=>{
        card.querySelectorAll(".point").forEach((point)=>{

            if(players[index].hpbar.currentHps_ > 0){ //si está vivo reasignamos

                point.innerHTML = Math.floor(Math.random()*20)+1;
            }
        })
    })
}

function nextTurn(){ //playableCards, players, turn?

    if(remainingPlayers.length == 1) return; //si solo queda uno pues no pasamos turno

    turn++;

    if(turn == cards.length){ //si hemos llegado al final, cambiamos de ronda
        turn = 0;
        round++;
        document.getElementById("round").innerHTML = round;
    }

    if(players[turn].hpbar.currentHps_ == 0){ //comprobamos si el jugador ha muerto o no

        // killedPlayers();
        nextTurn();
    }else{

        //reiniciamos los puntos vitales
        //y la sombrita
        cards.forEach((card)=>{
            card.querySelector(".weak-points").style.display = "";
            card.querySelector(".safe-points").style.display = "none";
            card.style.boxShadow = "rgb(105, 105, 105) 2px 2px 25px 7px";
        })

        //Actualizamos la info del turno
        document.getElementById("player-turn").innerHTML = players[turn].name;

        //si es tu turno, aparece tu safe-point
        //y la sombrita
        cards[turn].querySelector(".weak-points").style.display = "none";
        cards[turn].querySelector(".safe-points").style.display = "";
        cards[turn].style.boxShadow = "rgb(255 219 118) 2px 2px 25px 7px";

        //reasignamos los puntos
        assignPoints();

        
        //Mostramos un esquema de dónde debe lanzar el jugador
        displayBoardScheme();

    }
}

function displayBoardScheme(){

    if(gameMode == "playing"){

        //recogemos los numeros
        var damageNumbers = [];
        var healNumber = -1;

        cards.forEach((card)=>{

            if(card.querySelector(".weak-points").style.display != "none"){

                card.querySelectorAll(".weak-points .point").forEach((weakPoint)=>{
                    damageNumbers.push(weakPoint.innerHTML);
                });
            }

            if(card.querySelector(".safe-points").style.display != "none"){


                card.querySelectorAll(".safe-points .point").forEach((healPoint)=>{
                    healNumber = healPoint.innerHTML;
                });
            }
        });


        //pintamos la diana
        paintTarget(damageNumbers, healNumber);

        //mostramos la diana
        showToast("board-toast");

    }
}

function killPlayer(index){

    //fondo rojo
    cards[index].querySelectorAll(".final-screen")[0].style.display = "";
    
    //quitamos los puntos vitales
    cards[index].querySelector(".health-controller").style.display = "none";
    cards[index].querySelector(".vital-points").style.display = "none";

    //actualizamos los jugadores que quedan
    remainingPlayers = [];

    players.forEach((player,index)=>{

        if(players[index].hpbar.currentHps_ > 0){

            remainingPlayers.push(player);
        }
    })

    // console.log("Murió:",players[index]);
    // console.log("Quedan estos jugadores:",remainingPlayers);

    //comprobamos si hay ganador
    if(remainingPlayers.length == 1){

        winner(remainingPlayers[0].card_elem)
    }
}

function winner(card){
    card.querySelectorAll(".final-screen")[1].style.display = "";

    //quitamos los puntos vitales
    card.querySelector(".health-controller").style.display = "none";
    card.querySelector(".vital-points").style.display = "none";

    // console.log("Ganador!:",remainingPlayers[0]);
}

//-----------------------------

function changeGameMode(mode){

    console.log("[Cambiando modo de juego]",mode);

    //reseteamos todos los botones de settings
    document.querySelectorAll("#settings-container button").forEach((button)=>{
        button.disabled = false;
        button.style.display = "";
    })

    document.getElementById("refresh-btn").style.display = "none";

    //reseteamos el health-controller
    document.querySelectorAll(".health-controller").forEach((div)=>{
        div.style.display = "";
    })

    //reseteamos el panel de control de cada carta
    document.querySelectorAll(".card-config").forEach((div)=>{
        div.style.display = "";
    })

    //reseteamos la death screen y la win screen
    document.querySelectorAll(".final-screen").forEach((div)=>{
        div.style.display = "none";
    })

    //reseteamos los botones de borra carta
    document.querySelectorAll(".card-remove-btn").forEach((btn)=>{
        btn.style.display = "";
    })

    //reseteamos los puntos vitales
    document.querySelectorAll(".vital-points").forEach((div)=>{
        div.style.display = "";
    })

    //reseteamos el div de información de la partida
    document.querySelectorAll(".game-info-container").forEach((div)=>{
        div.style.display = "";
    })

    //En función del modo de juego, ocultamos solo lo que proceda
    gameMode = mode;

    switch(gameMode){
        case "playing":

            document.getElementsByClassName("game-info-container")[0].style.display = "none";

            document.getElementById("play-btn").style.display = "none";
            document.getElementById("refresh-btn").style.display = "";
            document.getElementById("add-player-btn").disabled = true;

            document.querySelectorAll(".card-config").forEach((div)=>{ //ocultamos el panel de control
                div.style.display = "none";
            });

            document.querySelectorAll(".card-remove-btn").forEach((btn)=>{ //ocultamos el botón de borra carta
                btn.style.display = "none";
            });

            break;
        case "player-config":

            document.getElementsByClassName("game-info-container")[1].style.display = "none";

            document.getElementById("players-btn").disabled = true;

            document.getElementById("show-board-btn").disabled = true;

            document.querySelectorAll(".health-controller").forEach((div)=>{ //ocultamos barra de vida en config
                div.style.display = "none";
            })

            document.querySelectorAll(".vital-points").forEach((div)=>{ //ocultamos los puntos vitales
                div.style.display = "none";
            })

            cards.forEach((card)=>{ //le quitamos la sombrita naranja a todos
                card.style.boxShadow = "rgb(105, 105, 105) 2px 2px 25px 7px";
            })
            break;
        default:

            console.warn("Este modo de juego no existe.");
            break;
    }
    
}



