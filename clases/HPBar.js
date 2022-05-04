
/*
    -El total de HPS no puede ser mayor al valor de initial
    -Todas las barras de salud deben tener la clase hptable
    -Si nos queda por ejemplo 2 puntos de salud y quitamos 3, el resultado será que tenemos 0;
    del mismo modo si el máximo son 5, tenemos 4 y curamos 2, el máximo será 5
    -El id tendrá un número identificativo y la clase no, por ejemplo;
    hptable es la clase y hpbar1 es el id

*/
class HPBar{


    constructor(card_elem, totalHps){ //donde, cuánta vida

        this.totalHps_ = totalHps //puntos de vida totales
        this.currentHps_ = totalHps //puntos de vida que quedan
        this.elem_ = card_elem.querySelector(".hptable-container") //elemento donde se crea la barra de vida (buscamos el hp container en el elemento donde está la carta)

        this.hps_ = [] //array donde se guardan los puntos de vida que quedan

        // this.createHPBar()
    }
    

    createHPBar(){

        this.remove(); //nos aseguramos de que no había alguna ya

        if(this.elem_ !== null && this.totalHps_ > 0){

            let elem_bar =  document.createElement("table") //creamos la tabla y su clase
            elem_bar.classList.add("hptable")

            
            for (let x = 0; x < this.totalHps_; x++) { //puntos de salud vacíos

                this.hps_.push(document.createElement("td")) //añadimos al array 

                this.hps_[x].classList.add("empty")

                elem_bar.appendChild(this.hps_[x]) //añadimos al elemento
            }

            for (let x = 0; x < this.currentHps_; x++) { //puntos de salud rellenos

                this.hps_[x].classList.remove("empty")

                if(x<2) //coloreamos según el tipo de barra
                    this.hps_[x].classList.add("crit")
                    else if(x<5)
                        this.hps_[x].classList.add("low")
                    else 
                        this.hps_[x].classList.add("normal")
            }

            
            this.elem_.appendChild(elem_bar)
        }
    }

    
    healed(times=1){
        //inset 0px 0px 50px 20px rgba(255,0,0,0.75)
        this.elem_.parentNode.parentNode.querySelector(".character").style.boxShadow = "inset 0px 0px 50px 20px rgba(17,255,0,0.75)";

        const timeout = setTimeout(()=>{
            this.elem_.parentNode.parentNode.querySelector(".character").style.boxShadow = "";

            clearTimeout(timeout);
        }, 300);


        if(this.currentHps_ < this.totalHps_){ //si no superamos el máximo, podemos curar

            this.currentHps_ += times //añadimos tantos puntos como marque "times"
            
            if(this.currentHps_ > this.totalHps_) this.currentHps_ = this.totalHps_ //si superamos el total, lo igualamos

            this.createHPBar()
        }else{

            console.warn("Estás al máximo");
        }
    }
    
    damaged(times=1){
        
        //animación de daño
        this.elem_.parentNode.parentNode.querySelector(".character").style.boxShadow = "inset 0px 0px 50px 20px rgba(255,0,0,0.75)";

        const timeout = setTimeout(()=>{
            this.elem_.parentNode.parentNode.querySelector(".character").style.boxShadow = "";

            clearTimeout(timeout);
        }, 300);

        //box-shadow: inset -1px -10px 15px 25px rgba(255, 0, 0, 0.15);

        if(this.currentHps_ > 0){
                 
            this.currentHps_ -= times 

            if(this.currentHps_ < 0) this.currentHps_ = 0 //si quitamos más de cero, será 0

            this.createHPBar()
        }else{

            console.warn("No quedan puntos de salud");
        }

        //!! falta la lógica de cuando llegamos a 0
    }
    
    
    remove(){
        
        let bar = this.elem_.querySelector(".hptable");
        
        if(bar !== null && bar !== undefined){
            
            bar.remove() //buscamos hptable en elem y lo borramos
        }
    }


}
