
class Formulary{


    constructor(name, color, pj, card_elem){
        this.name = name
        this.color = color
        this.pj = pj

        this.card_elem = card_elem //card-container
    }

    createFormulary(){
        //Set name
        // this.card_elem.querySelectorAll(".form-obj input")[0].placeholder = this.name;
        this.card_elem.querySelectorAll(".form-obj input")[0].value = this.name;
        
        //Set color 
        //this.card_elem.querySelectorAll(".formulary")[0].style.background = this.color;
        this.card_elem.querySelectorAll(".colors")[0].value = this.color;

        //Set pj
        let characters = this.card_elem.querySelectorAll(".character-selector td");

        characters.forEach((td,index) => {
            if((this.pj-1) == index){
                td.classList.add("selected")
            }
        });

        
    }


}