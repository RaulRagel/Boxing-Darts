/*

Esta clase representa el personaje en su totalidad. Guarda la información completa sobre un personaje. El formulario sirve para rellenar esta carta basicamente.

- nombre (por defecto Jugador X)
- color (por defecto negro)
- pj (imagen de jugador, por defecto ??)
- salud (una checkbox de vida por defecto por defecto)
- estado (modo edicion, modo confirmado, modo añadir)

*/
class Card{

    constructor(name, color, pj, status, card_elem, hpbar_totalHps){

        this.name = name
        this.color = color
        this.pj = pj > pjs.length || pj < 1 ? 1 : pj // si no existe cogemos 1
        this.status = status //confirmed, editing, deleted

        this.card_elem = card_elem //card-container
        this.hpbar_totalHps = hpbar_totalHps

        this.createCard()
        this.fillFormulary();
    }

    createCard(){

        //Set name
        this.card_elem.querySelectorAll(".player-name")[0].innerHTML = this.name;

        
        //Set color (convertimos un string a un linear)
        this.card_elem.querySelectorAll(".character")[0].style.background = applyColor(this.color);

        //Set pj
        if(this.pj == randomCharPos){

            this.pj = Math.floor(Math.random() * (randomCharPos-1))+1;
        }

        this.card_elem.querySelectorAll(".character img")[0].src = "./images/fighters/"+this.pj+".gif";

        //Set hpbar
        this.hpbar = new HPBar(this.card_elem, this.hpbar_totalHps); //en esta carta, con esta vida
        this.hpbar.createHPBar();

        //Set status
        this.switchStatus();
    }

    fillFormulary(){

        let form = new Formulary(this.name, this.color, this.pj, this.card_elem);
        form.createFormulary();
    }

    switchStatus(){

        //(editing [0], deleted [1], confirmed [2])
        switch(this.status){
            case "editing":
                changeCardContent(this.card_elem, 0);
                break;
            case "deleted":
                changeCardContent(this.card_elem, 1);
                break;
            case "confirmed":
                changeCardContent(this.card_elem, 2);
                break;
            default:
                console.warn("'"+this.status+"' no es un estado válido.");
                break;
        }
    }

}