class User{

    constructor(username, password){

        this.id = null;
        this.username = username;
        this.password = password;
        this.pokedex = [];
        this.counter = "0";
        this.loged = false;

    }

    login(callback){

        var that = this;

        this.sha256(this.password).then( function( hash ) {

            $.ajax({
                url : "192.168.110.31:8888/Jerome/TP_JS/API/login",
                method : "get",
                dataType: "json",
                data : {
                    username: that.username,
                    password: hash,
                    counter: that.counter
                },
                success : function(data){


                    that.id = data['id'];
                    that.username = data['username'];
                    that.password = null;
                    that.counter = data['counter'];
                    that.loged = true;
                    callback();

                },
                error : function(error){

                    console.log(error)

                }
            });
        
        });

    }

    signup(callback){

        var that = this;

        this.sha256(this.password).then( function( hash ) {

            $.ajax({
                url : "192.168.110.31:8888/Jerome/TP_JS/API/signup",
                method : "get",
                dataType: "json",
                data : {
                    username: that.username,
                    password: hash,
                    counter: that.counter
                },
                success : function(data){

                    this.id = data['id'];
                    this.username = data['username'];
                    this.password = null;
                    this.counter = data['counter'];
                    this.loged = true;
                    callback();

                },
                error : function(error){
                    console.log(error)
                }
            });
        
        });

    }

    getMyPokedex(){

        $.ajax({
            url : "192.168.110.31:8888/Jerome/TP_JS/API/getPokedex",
            method : "get",
            dataType: "json",
            data : {
                userid: this.id
            },
            success : function(data){

                for(var i = 0; i < data.length; i++){

                    var position = data[i].position;
                    var name = data[i].title;
                    var type = data[i].type;
                    var element = data[i].element;
                    var pokeIndex = data[i].indexx;
                    var icone = data[i].url;
                    var content = "<div class='pokemon'></div>";
                    var lvl = data[i].lvl;
                    var pv = data[i].pv;
                    var attack = data[i].attack;
                    var marker = app.addMarker(position, name, 'Pokédex', element, icone, pokeIndex, content, pv, attack, lvl);
                    app.addPokedex(marker.index);
                }

            },
            error : function(error){
                console.log(error)
            }
        });

    }

    hex(buffer) {
        var hexCodes = [];
        var view = new DataView(buffer);
        for (var i = 0; i < view.byteLength; i += 4) {
          // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
          var value = view.getUint32(i)
          // toString(16) will give the hex representation of the number without padding
          var stringValue = value.toString(16)
          // We use concatenation and slice for padding
          var padding = '00000000'
          var paddedValue = (padding + stringValue).slice(-padding.length)
          hexCodes.push(paddedValue);
        }
      
        // Join all the hex strings into one
        return hexCodes.join("");
    }
    
    sha256(str) {
    
        var buffer = new TextEncoder("utf-8").encode(str);

        var that = this;

        return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
            
            return that.hex(hash);
            
        });
    
    }

}