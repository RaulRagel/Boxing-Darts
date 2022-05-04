
var sections;
var numbers = [20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];

function initializeBoard(){
    
    sections = document.querySelectorAll(".section");
    
    //Creation of sections
    var color;
    sections.forEach((section,index) => {
        
        if(index%2 == 0) color = "black";
        else color = "white";
        
        section.style.background = `conic-gradient(${color} 18deg, transparent 0%)`;
        section.style.transform = `rotate(${index*18}deg)`;

        // section.style.background = `conic-gradient(from ${index*18}deg, ${color} 18deg, transparent 0%)`;

    });

    //Creation of borders
    var borders = document.querySelectorAll(".border");

    borders.forEach((border,index) => {

        border.style.transform = `rotate(${index*18}deg)`;
    })
}

function paintTarget(weakPoints, healingPoint){ //[20,18,17],5

    resetColors();

    //ya que secions tiene los números podemos seleccionar el que vamos a cambiar
    sections.forEach((section,index) => {
    
        //pintamos el de curación
        if(healingPoint == numbers[index]) paintSection(section, "green");

        //pintamos el de daño o ambos
        for(i in weakPoints){

            if(weakPoints[i] == numbers[index]){ //coincide weak con ese numero

                if(weakPoints[i] == healingPoint){  //si ademas coincide con el healing pintamos ambos
                    
                    paintSection(section,"green","red");

                }else{ //si no pues solo de rojo

                    paintSection(section, "red");
                }

                //comprobamos si un rojo se repite
                var r = 0;
                for(j in weakPoints){
                    if(weakPoints[j] == weakPoints[i]){

                        r++; //veces que aparece
                    }
                }

                if(r > 1){ //si weakPoints[i] se repite dos veces o más entramos aqui

                    if(weakPoints[i] == healingPoint){  //si ademas coincide con el healing pintamos ambos
                    
                        paintSection(section,"green","darkred"); //!aqui sería gradiente de granate y verde
    
                    }else{ //si no pues solo de rojo oscuro
    
                        paintSection(section, "darkred");
                    }
                }
            }


        }
    });
}

function paintSection(section, color, color2){ //si el color está vacío pintamos de ambos colores

    
    if(!section) return console.warn("Sección no especificada");
    if(!color) return console.warn("Color no especificado");

    if(color2){

        section.style.background = `conic-gradient(${color} 1deg, ${color2} 18deg, transparent 0%)`;
    }else{

        section.style.background = `conic-gradient(${color} 18deg, transparent 0%)`;
    }
}

function resetColors(){

    sections = document.querySelectorAll(".section");

    var color;
    sections.forEach((section,index) => {
        
        if(index%2 == 0) color = "black";
        else color = "white";
        
        section.style.background = `conic-gradient(${color} 18deg, transparent 0%)`;
    });
}



//---------TOAST ANIMATIONS


var modalTimeout;
var aliveTime = 30000;


function showToast(id){ // "board-toast"

    var toast = document.getElementById(id);

    toast.style.transform = "translateX(500px)";

    closeToastDelay(toast);
}


function forceCloseToast(toast){

    //! lo ideal sería hacer un timeout para cada toast, pero de momento solo hay uno
    stopTimeout(); //cancelamos el timeout para hacer el close directamente

    //console.log("[forceCloseToast]");
    if(toast){

        toast.style.transform = "translateX(-500px)";
    }else{
        //buscamos el primer toast de la página
        document.querySelector(".toast").style.transform = "translateX(-500px)";
    }

}

function closeToastDelay(toast){

    stopTimeout(); //necesario para que si se activa dos veces, cancele el timeout anterior e inicie otro

    //console.log("Timeout started");
    modalTimeout = setTimeout(()=>{
        
        //console.log("[closeToast]");
        toast.style.transform = "translateX(-400px)";
    }, aliveTime);
    
}

function stopTimeout(){

    //console.log("Timeout stopped");
    clearTimeout(modalTimeout);
}