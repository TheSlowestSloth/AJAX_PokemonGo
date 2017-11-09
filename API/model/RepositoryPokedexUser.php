<?php

class RepositoryPokedexUser{

    private $connexion;

    public function __construct($connexion){
        $this->connexion = $connexion;
    }

    public function insertNewPokedex(ClassPokedexUser $pokedex){

        $user_id = $pokedex->getUserId();
        $pokemon = $pokedex->getPokemon();

        $object = $this->connexion->prepare("INSERT INTO pokedex SET user_id=:user_id, positionLat=:positionLat, positionLng=:positionLng, title=:title, type=:type, element=:element, indexx=:index, url=:url, lvl=:lvl, pv=:pv, attack=:attack");
        $object->execute(array(
            'user_id' => $user_id,
            'positionLat' => $pokemon[0],
            'positionLng' => $pokemon[1],
            'title' => $pokemon[2],
            'type' => $pokemon[3],
            'element' => $pokemon[4],
            'index' => $pokemon[5],
            'url' => $pokemon[6],
            'lvl' => $pokemon[7],
            'pv' => $pokemon[8],
            'attack' => $pokemon[9],
        ));

    }

    public function selectPokedex(ClassPokedexUser $pokedex){

        $user_id = $pokedex->getUserId();

        $object = $this->connexion->prepare("SELECT * FROM pokedex WHERE user_id=:user_id");
        $object->execute(array(
            'user_id' => $user_id
        ));
        $result = $object->fetchAll(PDO::FETCH_ASSOC);
        return $result;

    }

}

?>