<?php

class ClassPokedexUser implements JsonSerializable{

    private $userid;
    private $pokemon;
    private $pokedex;

    public function hydrate(array $donnees){

        foreach ($donnees as $key => $value){
        
            $method = 'set'.ucfirst($key);
            
            if (method_exists($this, $method)){

            $this->$method($value);

            }

        }

    }

    function jsonSerialize(){
        return [
            $this->pokedex,
        ];
    }

    public function getUserid(){
        return $this->userid;
    }

    public function setUserid($userid){
        $this->userid = $userid;
    }

    public function getPokemon(){
        return $this->pokemon;
    }

    public function setPokemon($pokemon){
        $this->pokemon = $pokemon;
    }

    public function getPokedex(){
        return $this->pokedex;
    }

    public function setPokedex($pokedex){
        $this->pokedex = $poekex;
    }

    public function __construct($valeurs = array())
    {
        if(!empty($valeurs))
            $this->hydrate($valeurs);
    }
    

    public function insertPokedex(BddManager $bddmanager){
        $bddmanager->getPokedexUserRepository()->insertNewPokedex($this);
    }

    public function selectMyPokedex(BddManager $bddmanager){
        return $bddmanager->getPokedexUserRepository()->selectPokedex($this);
    }

}