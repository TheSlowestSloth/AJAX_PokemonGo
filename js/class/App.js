class App {

    constructor(){

        this.$map = $("#map");
        this.$infos = $("#infos");

        this.user = false;
        this.userid = null;
        this.username = 'Red';
        this.tab = [];
        
        this.map = null;
        this.pause = false;
        this.pokemons = [];
        this.center = null;
        this.dresseur = null;
        this.pokedex = [];
        this.counter = 0;
        this.pokeIndex = 0;
        this.pos = [];
        this.lati = 0;
        this.longi = 0;
        this.events = []
        this.element = null;
        this.holidays = [];
        
        this.$date_debut = $("#date_start");
        this.$date_fin = $("#date_end");

        this.main = null; 

        this.takePokedex();
        this.initPickers();

    }

    takePokedex(element){

        var that = this;

        $.ajax({
            url : "192.168.110.31:8888/Jerome/TP_JS/API/pokedex",
            method : "get",
            dataType : "json",
            data : {
                type: element
            },
            success : function(data){

                that.tab = data;

            },
            error : function(error){

                console.log(error)

            }
        });

    }

    initMap(){

        this.map = new google.maps.Map(this.$map[0], {

            center: {

                lat: -34.397,
                lng: 150.644

            },

            zoom: 18

        });

        this.main();

    }

    centerOnGeolocation(callback){

        var that = this; 

        navigator
            .geolocation
            .getCurrentPosition(function( position ){ 

                var pos = {
                    lat : position.coords.latitude,
                    lng : position.coords.longitude
                };

                var latitude =pos.lat;
                var longitude = pos.lng;

                that.newDresseur(latitude, longitude);

                that.map.setCenter(pos);

                callback();

            });
        
    }

    newDresseur(latitude, longitude){

        var marker_name = this.username;
        app.center = {
            lat: latitude,
            lng: longitude
        };
        var marker_position = app.center;
        var marker_icon = {
            url: "./images/red.gif",
            scaledSize: new google.maps.Size(40, 40),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 0) 
        };
        
        var marker_content = "<div class='dresseur'></div>"
    
        var marker = app.addMarker( marker_position, marker_name, 'Dresseur', 'Dresseur', marker_icon, 0, marker_content, 600, 200, 100);
    
        var marker_info = "<div>";
        marker_info += "<h3>Red, la légende vivante</h3>";
        marker_info += "<h3> Pokémon: Pikachu </h3>";
        marker_info += "<p> Niveau: " + this.dresseur.lvl + "</p>";
        marker_info += "<p> Pv: " + this.dresseur.pv + "</p>";
        marker_info += "<p> Attaque: " + this.dresseur.attack + "</p>";
        marker_info += "</div>";
    
        this.addInfos( marker_info, marker );

    }

    addMarker( position, title, type, element, icone, index = 0, content, pv, attack, lvl){
        
        if(type == 'Pokémon' || type == 'Pokédex'){
            var icon = {
                url: icone,
                scaledSize: new google.maps.Size(60, 60),
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point(0, 0) 
            }
        }
        else{
            var icon = icone;
        }
        var marker = new google.maps.Marker({

            position: position,
            map: this.map,
            title: title,
            icon: icon,
            content: content

        });

        marker.type = type;
        marker.element = element;
        marker.index = index;
        marker.lvl = lvl;
        marker.pv = pv;
        marker.attack = attack;

        if(marker.type == 'Dresseur'){

            this.dresseur = marker;

        }

        if(marker.type == 'Pokémon' || marker.type == 'Pokédex'){

            this.pokemons.push( marker );

        }
        
        return marker;
    }

    addInfos( content, marker ) {

        var infowindow = new google.maps.InfoWindow({

            content: content

        });

        var that = this;

        marker.addListener("click", function(){

            infowindow.open(that.map, marker);

        });
    }

    spawn(){

        var pokemon = new Marker(this.tab);
        var marker = this.addMarker(pokemon.position, pokemon.name, 'Pokémon', pokemon.elem, pokemon.icone, this.pokeIndex, "<div class='pokemon'></div>", pokemon.pv, pokemon.attack, pokemon.lvl);
        this.pokeIndex ++;
        this.addInfos("<div class='infoBattle'><h3>" + marker.title + "</h3><p>Niveau: " + marker.lvl + "</p><p>Pv: " + marker.pv + "</p><button class='battle' value='" + marker.index + "'>Combattre!</button>", marker);
        marker.setMap(null);

    }

    pokedexAjax(pokemon, counter){

        var tab=[
            pokemon.position.lat(),
            pokemon.position.lng(),
            pokemon.title,
            pokemon.type,
            pokemon.element,
            pokemon.index,
            pokemon.icon.url,
            pokemon.lvl,
            pokemon.pv,
            pokemon.attack
        ];

        $.ajax({
            url : "192.168.110.31:8888/Jerome/TP_JS/API/updatePokedex",
            method : "get",
            dataType: "json",
            data : {
                poke: tab,
                username: this.username
            },
            success : function(data){

                this.userid = data;

            },
            error : function(error){

                console.log(error)

            }
        });

        $.ajax({
            url : "192.168.110.31:8888/Jerome/TP_JS/API/updateUser",
            method : "get",
            dataType: "json",
            data : {
                count: counter,
                username: this.username
            },
            success : function(data){

            },
            error : function(error){

                console.log(error)

            }
        });

    }

    addPokedex(index){
        for(var key in this.pokemons){
            if(this.pokemons[key].index == index){
                var indexx = key;
                var pokemon = this.pokemons[key];
            }
        }

        this.counter ++;
        
        var flag = false;
        
        for(var poke of this.pokedex){
            if(poke.title == this.pokemons[indexx].title){
                flag = true;
            }
        }
        if(flag == false){
            this.pokedex.push(this.pokemons[indexx]);
        
            var div = "<img class='imgPokedex' src='./images/pokedex-3d-logo.jpg'>";
            div += "<div id='tabPokem'><div id='tabPoke'>";
            var size = 0;
            for(var poke of this.pokedex){
                size ++;
                div += "<img class='pokemon' src='" + poke.icon.url + "'/>";
                        
            }
            var pokedexLenght = 151 - size;
            div += "</div></div>";
            div += "<h2>Vous avez capturé " + this.counter + " Pokémons.</h2>";
            div += "<h2>Il vous manque " + pokedexLenght + " Pokémons pour compléter le pokédex.</h2>";
            $('#info').html(div);
                    
        }
        else{
            var div = "<img class='imgPokedex' src='./images/pokedex-3d-logo.jpg'>";
            div += "<div id='tabPokem'><div id='tabPoke'>";
            var size = 0;
            for(var poke of this.pokedex){
                size ++;
                div += "<img class='pokemon' src='" + poke.icon.url + "'/>";
                        
            }
            var pokedexLenght = 151 - size;
            div += "</div></div>";
            div += "<h2>Vous avez capturé " + this.counter + " Pokémons.</h2>";
            div += "<h2>Il vous manque " + pokedexLenght + " Pokémons pour compléter le pokédex.</h2>";
            $('#info').html(div);
        }
        
        this.pokemons[indexx].setMap(null);
        this.pokemons.splice(indexx,1);

    }

    capture(index){

        for(var key in this.pokemons){
            if(this.pokemons[key].index == index){
                var indexx = key;
                var pokemon = this.pokemons[key];
            }
        }

        var tauxCapture = 1000 - (this.pokemons[indexx].pv);
        var chance = Math.round(Math.random() * 2000);

        if(chance < tauxCapture){

            this.pause = false;

            this.counter ++;

            var flag = false;

            for(var poke of this.pokedex){
                if(poke.title == this.pokemons[indexx].title){
                    flag = true;
                }
            }
            if(flag == false){
                this.pokedex.push(this.pokemons[indexx]);
                this.pokedexAjax(this.pokemons[indexx], this.counter);

                var div = "<img class='imgPokedex' src='./images/pokedex-3d-logo.jpg'>";
                div += "<div id='tabPokem'><div id='tabPoke'>";
                var size = 0;
                for(var poke of this.pokedex){
                    size ++;
                    div += "<img class='pokemon' src='" + poke.icon.url + "'/>";
                            
                }
                var pokedexLenght = 151 - size;
                div += "</div></div>";
                div += "<h2>Vous avez capturé " + this.counter + " Pokémons.</h2>";
                div += "<h2>Il vous manque " + pokedexLenght + " Pokémons pour compléter le pokédex.</h2>";
                $('#info').html(div);

                this.pause = false;
            
            }
            else{
                var div = "<img class='imgPokedex' src='./images/pokedex-3d-logo.jpg'>";
                div += "<div id='tabPokem'><div id='tabPoke'>";
                var size = 0;
                for(var poke of this.pokedex){
                    size ++;
                    div += "<img class='pokemon' src='" + poke.icon.url + "'/>";
                            
                }
                var pokedexLenght = 151 - size;
                div += "</div></div>";
                div += "<h2>Vous avez capturé " + this.counter + " Pokémons.</h2>";
                div += "<h2>Il vous manque " + pokedexLenght + " Pokémons pour compléter le pokédex.</h2>";
                $('#info').html(div);

                this.pause = false;

            }

            this.pokemons[indexx].setMap(null);
            this.pokemons.splice(indexx,1);
            $('.reussite').html("<button class='fuite' value='" + pokemon.index + "'>Fuite</button><p>Succès</p>");

            var timeOut = setTimeout(function(){
                $('#arene').css('display', 'none');
                this.pause = false;
            }, 2000);

            var name = pokemon.title.toString();

            var obj = {

                attachments: [{
                    text : "Vous avez capturé un "+name,
                    image_url: "https://a96be937.ngrok.io/Jerome/TP_JS/js/" + pokemon.icon.url
                }]

            };
                
            $.ajax ({
                url: "https://hooks.slack.com/services/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",
                method : "POST",
                dataType: "json",
                data: {
                    payload : JSON.stringify( obj ),
                },
                success : function(data){
        
                    console.log('slack');
        
                },
                error : function(error){
                    console.log(error)
                }
                    
            })
        }
        else{
            this.dresseur.pv = this.dresseur.pv - pokemon.attack;
            if(this.dresseur.pv <= 0){
                this.gameover();
                $('#arene').css('display', 'none');
                this.pause = false;
                this.dresseur.pv = 600;
            }
            else{
                this.battle(index);
                $('.reussite').html("<button class='fuite' value='" + pokemon.index + "'>Fuite</button><p>Echec</p>");

            }
        }

    }

    move(lati, long){
        var latitude = this.dresseur.position.lat() + lati;
        var longitude = this.dresseur.position.lng() + long;
        var pos = {
            lat: latitude,
            lng: longitude
        };
        this.dresseur.setPosition(pos);
        this.map.setCenter(pos);
        
    }

    calcDistance(lat1, lon1, lat2, lon2){
           
        var earthRadiusKm = 6371;
          
        var dLat = this.degreesToRadians(lat2-lat1);
        var dLon = this.degreesToRadians(lon2-lon1);
          
        lat1 = this.degreesToRadians(lat1);
        lat2 = this.degreesToRadians(lat2);
          
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 

        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

        return earthRadiusKm * c;
        

        

    }

    degreesToRadians(degrees){

        return degrees * Math.PI / 180;

    }

    initPickers(){
        
        var options = {
            dayNames : ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
            dayNamesMin : ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
            monthNames : ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"],
            monthNamesShort : ["Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"],
            firstDay : 1,
            holidays : this.holidays,
            minDate : new Date( 2017, 0, 1 ),
            maxDate : new Date( 2018, 11, 31 ),
            dateFormat : "mm/dd/yy",
            beforeShowDay : $.proxy(this.closedDay, this)
        };
          
        this.$date_debut.datepicker( options );
        this.$date_fin.datepicker( options );
        
    }

    closedDay( date ){
        
        for(var holiday of this.holidays){
            
            if( holiday.toDateString() == date.toDateString() ){
                
                return [false, ""];
            }
        }
        
        return [true, ""];
    }

    addEvent(){

        var date_start = this.$date_debut.val();
        var date_end = this.$date_fin.val();
        var event = {
            start: new Date(date_start),
            end: new Date(date_end),
            type: $('#select').val()
        }
        this.events.push(event);
        this.checkEvent();
        var start = event.start.getTime();
        var end = event.end.getTime();
        var count = 0;
        var tab = [];

        var flag = true;
        for(var i = parseInt(start); i < parseInt(end); i += 86400000){
            
            count ++;  
            tab.push(new Date(i));          

            if(count > 7){
                tab = [];
                alert('Période trop longue ( Période > 7 jours)')
                flag = false
            }
            
        }

        for(var holiday of tab){
            this.holidays.push(holiday);
        }        

        this.$date_debut.datepicker('destroy');
        this.$date_fin.datepicker('destroy');
        this.initPickers();
        this.checkEvent();
        this.displayEvent();
    
    }

    checkEvent(){

        var today = Date.now();

        this.element = null;
        
        for(var event of this.events){
            
            var start = event.start.getTime();
            var end = event.end.getTime();

            if(start < today && today < end){

                this.element = event.type;
                this.takePokedex(this.element);

            }

        }


    }

    displayEvent(){
        
        var today = Date.now();
        var next = {
            start : new Date(today),
            end : new Date(today),
        };
        var prev = {
            start : new Date(today),
            end : new Date(today),
        };
        var now = {
            start : new Date(today),
            end : new Date(today),
        };

        for(var event of this.events){
            if(event.start.getTime() < today && event.end.getTime() > today){
                if(now.start.getTime() == today){
                    now = event
                }
                else if(event.start.getTime() > now.start.getTime()){
                    now = event;
                }
            }
            else if(event.start.getTime() > today){
                if(next.start.getTime() == today){
                    next = event
                }
                else if(event.start.getTime() < next.start.getTime()){
                    next = event;
                }
            }
            else if(event.end.getTime() < today){
                if(prev.start.getTime() == today){
                    prev = event
                }
                else if(event.end.getTime() > prev.end.getTime()){
                    prev = event;
                }
            }
        }

        var divNext = "";
        var divPrev = "";
        var divNow = "<div> Pas d'event actuellement</div>";

        if(next.start.getTime() != today){
            divNext = "<div>Prochain event :" + next.end.getDate() + "/" + (next.end.getMonth() + 1) + "/" + next.end.getFullYear() + "</div>"
        }
        if(prev.start.getTime() != today){
            divPrev = "<div>Dernier event :" + prev.start.getDate() + "/" + (prev.start.getMonth() + 1) + "/" + prev.start.getFullYear() + "</div>"
        }
        if(now.start.getTime() != today){
            divNow = "<div>Event en cours :" + now.start.getDate() + "/" + (now.start.getMonth() + 1) + "/" + now.start.getFullYear() + " au " +  now.end.getDate() + "/" + (now.end.getMonth() + 1) + "/" + now.end.getFullYear()  + "</div>";
        }

        var div = divPrev;
        div += divNow;
        div += divNext;

        $('#curent_event').html(div);
    }

    battle(index){
        
        for(var poke of this.pokemons){
            if(poke.index == index){
                var pokemon = poke;
            }
        }
        $('#arene').css('display', 'block');
        var div = "<div id='areneBattle'>"

            div += "<div class='pokeInfo'>";
                div += "<h3>" + pokemon.title + "</h3>";
                div += "<p>Niveau: " + pokemon.lvl + "</p>";
                div += "<p>PV: " + pokemon.pv + "</p>";

                div += "<div class='infobulle'>";
                    div += "<button class='capture' value='" + pokemon.index + "'></button>";
                    div += "<span>Capturer!</span>";
                div += "</div>";
                
            div+= "</div>";

            div += "<div class='reussite'>";
                div += "<button class='fuite' value='" + pokemon.index + "'>Fuite</button>";
            div += "</div>";

            div += "<div class='dresseurInfo'>";
                div += "<h3>" + this.dresseur.title + " / Pikachu" + "</h3>";
                div += "<p>Niveau: " + this.dresseur.lvl + "</p>";
                div += "<p>PV: " + this.dresseur.pv + "</p>";

                div += "<div class='infobulle'>";
                    div += "<button class='combattre' value='" + pokemon.index + "'></button>";
                    div += "<span>Combattre!</span>";
                div += "</div>";

            div+= "</div>";

            div += "<img class='pokemonBattle' src='" + pokemon.icon.url + "'>";
            
            div += "<div>";
                div += "<img class='dresseurPokemon' src='./images/25.png'>";
                div += "<img class='dresseurBattle' src='./images/redBattle.gif'>";
            div += "</div>";

        div += "</div>";
        $('#arene').html(div);

    }

    fight(index){

        var vitesse = Math.round(Math.random() * 1);

        for(var poke of this.pokemons){
            if(poke.index == index){
                var pokemon = poke;
            }
        }

        for(var indexx in this.pokemons){
            if(this.pokemons[indexx].index == index){
                var ind = indexx;
            }
        }

        if(vitesse == 1){

            pokemon.pv = pokemon.pv - this.dresseur.attack;
            if(pokemon.pv <= 0){
                $('#arene').css('display', 'none');
                this.pause = false;
                this.pokemons[ind].setMap(null);
                this.pokemons.splice(ind,1);

            }
            else{
                this.dresseur.pv = this.dresseur.pv - pokemon.attack;

                if(this.dresseur.pv <= 0){
                    this.gameover();
                    $('#arene').css('display', 'none');
                    this.pause = false;

                    this.dresseur.pv = 600;
                    
                }
                else{
                    this.battle(index);
                }
                
            }
        }
        else if(vitesse == 0){

            this.dresseur.pv = this.dresseur.pv - this.dresseur.attack;

            if(this.dresseur.pv <= 0){
                this.gameover();
                $('#arene').css('display', 'none');
                this.pause = false;

                this.dresseur.pv = 600;

            }
            else{

                pokemon.pv = pokemon.pv - this.dresseur.attack;

                if(pokemon.pv <= 0){

                    $('#arene').css('display', 'none');
                    this.pause = false;
                    this.pokemons[ind].setMap(null);
                    this.pokemons.splice(ind,1);
    
                }
                else{
                    this.battle(index);
                }
            }
        }
    }

    gameover(){

        $('#gameover').css('display', 'block');

        setTimeout(function(){

            $('#gameover').css('display', 'none');

        }, 2000);

    }

    fuite(index){

        for(var poke of this.pokemons){
            if(poke.index == index){
                var pokemon = poke;
            }
        }

        var tauxFuite = Math.round(Math.random() * 2);

        if(tauxFuite == 0){

            this.dresseur.pv = this.dresseur.pv - pokemon.attack;

            if(this.dresseur.pv <= 0){
                this.gameover();
                $('#arene').css('display', 'none');
                this.pause = false;

                this.dresseur.pv = 600;
                
            }
            else{
                this.battle(index);
                $('.reussite').html("<button class='fuite' value='" + pokemon.index + "'>Fuite</button><p>Fuite impossible.</p>");
            }
        }
        else if(tauxFuite != 0){
            $('#arene').css('display', 'none');
            app.pause = false;
        }
    }
    
}