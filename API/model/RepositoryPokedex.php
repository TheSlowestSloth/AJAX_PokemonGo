<?php

class RepositoryPokedex{

    private $connexion;

    public function __construct($connexion){
        $this->connexion = $connexion;
    }

    public function getAllPokedex(ClassPokedex $pokedex){

        $object = $this->connexion->prepare("SELECT * FROM pokemon");
        $object->execute(array(
        ));
        $result = $object->fetchAll(PDO::FETCH_ASSOC);
        return $result;

    }

    public function getTypePokedex(ClassPokedex $pokedex){

        $type = $pokedex->getType();

        $object = $this->connexion->prepare("SELECT * FROM pokemon WHERE type=:type");
        $object->execute(array(
            'type' => $type
        ));
        $result = $object->fetchAll(PDO::FETCH_ASSOC);
        return $result;

    }

}