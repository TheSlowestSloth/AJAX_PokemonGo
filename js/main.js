var app = new App();
app.main = function(){

    var user = new User('anon', 'anon');

    $(document).on('click', '#submitLog', function(){

        event.preventDefault();

        var username = $('#userLog').val();
        var password = $('#passwordLog').val();

        var user = new User(username, password);
        user.login( function(){


            if(user.loged == true){

                app.username = user.username;
                app.counter = user.counter;
                user.getMyPokedex();
                play();
            
            }

        } );

    })

    $(document).on('click', '#submitSign', function(){

        event.preventDefault();

        var username = $('#userSign').val();
        var password = $('#passwordSign').val();

        var user = new User(username, password);
        user.signup( function(){


            if(user.loged == true){

                app.username = user.username;
                play();
            
            }

        } );

    })

    function play(){

        $('#login').css('display', 'none');

        app.centerOnGeolocation( function(){

            var heal = setInterval(function(){
                if(app.dresseur.pv < 600){
                    app.dresseur.pv += 10;
                }
                if(app.dresseur.pv > 600){
                    app.dresseur.pv = 600;
                }
            }, 2000);

            var spawnInterval = setInterval(function(){
                if(app.pause == false){
                    var size = 0;
                    for(var key of app.pokemons){
                        size++;
                    }
                    if(size < 100){

                        app.spawn();

                    }
                    else{
                        var mark = app.pokemons[0];
                        mark.setMap(null);
                        app.pokemons.splice(0,1)
                        app.spawn();
                            
                    }
                }
                else if(app.pause == true){

                }
                    
            },100);

        });

        app.checkEvent();
        app.displayEvent();

        $(document).on('click', '.capture', function(){

            var index = $(this).val();
            app.capture(index);

        })

        $(document).on('click', '.combattre', function(){
            
            var index = $(this).val();
            app.fight(index);
            
        })

        var $body = document.querySelector('body');
        $body.onkeydown = (function(e) {

            event.preventDefault();
            var keyResult = e.which;

            if(e.which == 38) {
                app.move(5/10000, 0);
            }
            if(e.which == 37) {
                app.move(0, -5/10000);
            }
            if(e.which == 39) {
                app.move(0, 5/10000);
            }
            if(e.which == 40) {
                app.move(-5/10000, 0);
            }

            $(this).css("background-color", "grey");
            
            for(var pokemon of app.pokemons){

                var posDresseur = {
                    lat: app.dresseur.position.lat(),
                    lng: app.dresseur.position.lng()
                }

                var distance = app.calcDistance(posDresseur.lat, posDresseur.lng, pokemon.position.lat(), pokemon.position.lng());
                
                if(distance <= 0.05){
                    pokemon.setMap(app.map);
                }
            }

            $(this).css("background-color", "grey");

        });

        $(document).on('click', '#submit', function(){
            
            event.preventDefault();
            app.addEvent();
            
        })

        $(document).on('click', '#event', function(){
            
            event.preventDefault();
            app.initPickers();
            
        })

        $(document).on('click', '.battle', function(){
            
            event.preventDefault();
            app.pause = true;
            var index = $(this).val();
            app.battle(index);
            
        })

        $(document).on('click', '.fuite', function(){
            
            event.preventDefault();
            var index = $(this).val();
            app.fuite(index);
            
        })
    
    }

}