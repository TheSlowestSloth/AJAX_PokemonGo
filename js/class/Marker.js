class Marker{

    constructor(tab){

        this.name = null;
        this.position = null;
        this.icone = null;
        this.elem = null;
        this.index = 0;
        this.pv = null;
        this.lvl = null;
        this.attack = null;
        this.tab = tab;

        this.randomPokemon();

    }

    randomPokemon(random = null){

        if(random == null){

            var random = Math.round(Math.random()* (this.tab[0].length - 1));

        }

        var carac = Math.round(Math.random()* 99) +1;
        var img = this.tab[0][random].id - 151;

        if(random >136){

            var random2 = Math.round(Math.random()*1);

            if(random2 == 0){

                this.randomPokemon();

            }

        }

        this.name = this.tab[0][random].name;
        this.newPosition();
        this.icone = ("./images/" + img + ".png").toString();
        this.elem = this.tab[0][random].type;
        this.lvl = carac;
        this.pv = (carac * 5) + Math.round(Math.random()* carac);
        this.attack = carac * 2;

        this.index ++;
            
        

    }

    newPosition(){

        var newLatitude = Math.round(((Math.random() * 1/150) - (Math.random() * 1/150) + app.dresseur.position.lat()) * 10000) / 10000;
        var newLongitude = Math.round(((Math.random() * 1/150) - (Math.random() * 1/150) + app.dresseur.position.lng()) * 10000) / 10000;

        this.position = {
            lat: newLatitude,
            lng: newLongitude
        }

    }

}