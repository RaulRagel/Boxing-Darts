/* Los initializers son las funciones que añaden el onlick o el addEventListener a los botones en tiempo de ejecución */

//Botones de los settings
function initializeSettings(){ //se llama en el onload

    window.addEventListener('keydown', function(e) { //previene que el documento se mueva al darle al espacio
        if(e.code == "Space" && e.target == document.body) {
            e.preventDefault();
        }
    });

    window.addEventListener('keyup', function(e) { //pasamos turno con el espacio
        if(e.code == "Space") {
            if(gameMode !== undefined && gameMode == "playing" && !modalActive){

                nextTurn();
            }else if(modalActive){

                closeModal();
            }
        }
    });

    //Botón de play
    document.getElementById("play-btn").onclick = function(){
        playMode();
    };

    //Botón de volver a jugar
    document.getElementById("refresh-btn").onclick = function(){
        playersMode();
        playMode();
    };


    //Botón de configurar jugadores
    document.getElementById("players-btn").onclick = function(){
        playersMode();
    };


    //Botón de añadir jugadores
    document.getElementById("add-player-btn").onclick = function(){
        addCard();
    };

      //Botón de mostrar diana
    document.getElementById("show-board-btn").onclick = function(){
        displayBoardScheme();
    };


    //Botón de config (modal)
    var configBtn = document.getElementById("config-btn");
    var configModal = document.getElementById("config-modal");

    configBtn.onclick = function(){ //click del boton de config
    
        configModal.style.display = "";
        modalActive = true;
    };


    configModal.onclick = function(e){ //si no estamos haciendo click en el menú, salimos

        // console.log(e.target.id);
        if (e.target.id == "config-modal"){
            closeModal("config-modal");
        }
    };

    //Botón de cómo jugar (modal)
    var tutorialBtn = document.getElementById("tutorial-btn");
    var tutorialModal = document.getElementById("tutorial-modal");

    tutorialBtn.onclick = function(){ //click del boton de tutorial
    
        tutorialModal.style.display = "";
        modalActive = true;
    };


    tutorialModal.onclick = function(e){ //si no estamos haciendo click en el menú, salimos

        // console.log(e.target.id);
        if (e.target.id == "tutorial-modal"){
            closeModal("tutorial-modal");
        }
    };

    //Config vida por defecto
    let barExampleContainer = document.getElementById("hp-example");
    let barExample = new HPBar(barExampleContainer,exampleHP);
    barExample.createHPBar()

    document.getElementById("plus-defh").onclick = ()=>{

        if(exampleHP<30) exampleHP++;
        barExample = new HPBar(barExampleContainer,exampleHP);
        barExample.createHPBar()
    }

    document.getElementById("minus-defh").onclick = ()=>{

        if(exampleHP>3) exampleHP--;
        barExample = new HPBar(barExampleContainer,exampleHP);
        barExample.createHPBar()
    }

    document.getElementById("accept").onclick = ()=>{
        defaultHP = exampleHP;
        document.getElementById('config-modal').style.display="none";

        if(gameMode == "player-config")
        updatePlayers();
    }
}

//Cerrar modal (los menús flotantes)
function closeModal(id){
    if(id){

        document.getElementById(id).style.display="none";
        modalActive = false;
    }else{

        document.querySelectorAll(".modal").forEach((modal)=>{
            modal.style.display="none";
            modalActive = false;
        })
    }
}

//Botones de las cartas
function initializeCardConfigButtons(){

    cards.forEach((card, cardIndex)=>{

        let cardConfigButtons =  Array.from(card.querySelectorAll(".card-config-btn")); //array de los botones [0,1,2]

        cardConfigButtons.forEach((btn, btnIndex)=>{ //a cada uno, añadimos un listener para cambiar su contenido
            
            btn.addEventListener("click",()=>{
                
                this.changeCardContent(card,btnIndex) //este listener está conectado con el método de abajo, que la pasamos la carta actual y la posición de cada botón
                
                //vaciamos el array y volvemos a crear los confirmados
                updatePlayers();
            })
        });

        
        card.querySelectorAll(".add-container button")[0].addEventListener("click",()=>{ //Botón de añadir nuevo cada cada carta

            this.changeCardContent(card, 1); //el botón de añadir nos lleva al formulario, por eso mandamos un 1
        });
    });

}

//Botones de la tabla de selección de personaje
function initializePlayersTable(){

    cards.forEach((card)=>{ //por cada carta
        
        card.querySelectorAll(".character-selector td").forEach((td,pos)=>{ //por cada td

            pjs.push(td); //guardamos los personajes en un array para poder usar su posición

            if(td.style.backgroundImage.includes("random")){ //guardamos la posicion del pj random (este valor lo utilizamos para alguna comprobación)

                randomCharPos = pos+1;
            }

            td.onclick = function(){

                var selected;
                if(card.querySelector(".selected")){

                   selected = card.querySelector(".selected"); //buscamos el seleccionado
                   selected.classList.remove("selected"); //lo borramos
                }

                td.classList.add('selected');
            }
        })
    });
}


//Botones del control de vida
function healthController(){

    cards.forEach((card,index)=>{ //no añadimos listeners para evitar que se creen más de los necesarios

        card.querySelectorAll(".health-button")[0].onclick = function(){
            players[index].hpbar.healed();
        }

        card.querySelectorAll(".health-button")[1].onclick = function(){

            if(players[index].hpbar.currentHps_ > 0) players[index].hpbar.damaged();
            if(players[index].hpbar.currentHps_ == 0) killPlayer(index);
        }
        
        
        //Puntos que hacen daño a todos
        card.querySelectorAll(".point").forEach((point)=>{

            //le asgnamos un click a cada punto
            point.onclick = function(){
                
                //buscamos en cada carta
                cards.forEach((c,i)=>{
                    
                    c.querySelectorAll(".point").forEach((p)=>{
                        
                        if(p.parentNode.style.display != "none"){
                            
                            if(point.innerHTML == p.innerHTML && p.parentNode.style.display != "none"){
                                if(p.parentNode.classList[0] == "weak-points"){
    
                                    if(players[i].hpbar.currentHps_ > 0) players[i].hpbar.damaged();
                                    if(players[i].hpbar.currentHps_ == 0) killPlayer(i);
                                    
                                }else{
                                    players[i].hpbar.healed();
                                }
                            }
                        }
                    })
                })
            }
        });
    })
    
}

//Botón de la diana (daño a todos menos al turno actual)
function dartboard(){

    if(gameMode == "playing"){
        players.forEach((player,index)=>{
            if(turn != index) player.hpbar.damaged();
            else player.hpbar.healed();

            if(player.hpbar.currentHps_ == 0) killPlayer(index);
        })
    }
}