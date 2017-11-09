<?php
header("Access-Control-Allow-Origin: *");

require 'flight/Flight.php';
require 'model/ClassConnexion.php';
require 'model/BddManager.php';
require 'model/RepositoryUser.php';
require 'model/RepositoryPokedex.php';
require 'model/RepositoryPokedexUser.php';
require 'model/ClassUser.php';
require 'model/ClassPokedex.php';
require 'model/ClassPokedexUser.php';

session_start();

Flight::route('/', function(){



});

Flight::route('/login', function(){
    
    $username = Flight::request()->query["username"];
    $password = Flight::request()->query["password"];
    $counter = 0;

    $user = new ClassUser(array(
        'username' => $username,
        'password' => $password,
        'counter' => $counter
    ));
    $bdd = new BddManager();

    $check = $user->checkUser($bdd);

    if(!empty($check)){

        echo json_encode($check);

    }
    else{

        echo json_encode('false');

    }
    
});

Flight::route('/signup', function(){
    
    $username = Flight::request()->query["username"];
    $password = Flight::request()->query["password"];
    $counter = 0;

    $user = new ClassUser(array(
        'username' => $username,
        'password' => $password,
        'counter' => $counter
    ));
    
    $bdd = new BddManager();

    $check = $user->checkUser($bdd);

    if(empty($check) || $check == false || $check == []){

        $val = $user->insertDresseur($bdd);
        $check = $user->checkUser($bdd);
        echo json_encode($check);

    }
    else{

        echo json_encode('false');

    }
    
});

Flight::route('/pokedex', function(){

    $type = Flight::request()->query["type"];

    $bdd = new BddManager();
    $pokedex = new ClassPokedex($bdd, $type);
    $tab = $pokedex->jsonSerialize();

    echo json_encode($tab);

});

Flight::route('/updatePokedex', function(){

    $pokemon = Flight::request()->query["poke"];
    $username = Flight::request()->query["username"];

    $bdd = new BddManager();
    $user = new ClassUser(array('username' => $username));
    $user_id = $user->getUserId($bdd);
    $pokedex = new ClassPokedexUser(array(
        'pokemon' => $pokemon,
    ));
    $pokedex->setUserid($user_id);
    $pokedex->insertPokedex($bdd);

    echo json_encode($user_id);

});

Flight::route('/updateUser', function(){

    $counter = Flight::request()->query["counter"];
    $username = Flight::request()->query["username"];

    $bdd = new BddManager();
    $user = new ClassUser();
    $user->setCounter($counter);
    $user->setUsername($username);
    $user->updateCounter($bdd);

    echo json_encode('updatedUser');

});

Flight::route('/getPokedex', function(){

    $user_id = Flight::request()->query["userid"];

    $bdd = new BddManager();
    $user = new ClassPokedexUser();
    $user->setUserid($user_id);
    $tab = $user->selectMyPokedex($bdd);

    echo json_encode($tab);

});

Flight::route('POST /pokedexslack', function(){

    $bdd = new BddManager();
    $user = new ClassPokedexUser();
    $user->setUserid(2);
    $tab = $user->selectMyPokedex($bdd);
    $images = [];

    foreach($tab as $table){

        // foreach($table as $t){

            array_push( $images, 
            [
                "text" => $table['title'],
                 "image_url" => "https://a96be937.ngrok.io/Jerome/TP_JS/js/".($table['url'])
            ]);
        //}

    };

    $data = [

        'attachments' => $images
        
    ];

    header('Content-Type: application/json');
    echo json_encode($data);

});

Flight::start();
?>
