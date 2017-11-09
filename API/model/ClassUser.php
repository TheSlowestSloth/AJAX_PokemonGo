<?php

class ClassUser implements JsonSerializable{

    private $username;
    private $password;
    private $counter;

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
            "username" => $this->username,
            "password" => $this->password,
            "counter" => $this->counter
        ];
    }

    public function getUsername(){
        return $this->username;
    }

    public function setUsername($username){
        $this->username = $username;
    }

    public function getPassword(){
        return $this->password;
    }

    public function setPassword($password){
        $this->password = $password;
    }

    public function getCounter(){
        return $this->counter;
    }

    public function setCounter($counter){
        $this->counter = $counter;
    }

    public function __construct($valeurs = array())
    {
        if(!empty($valeurs))
            $this->hydrate($valeurs);
    }
    

    public function checkUser(BddManager $bddmanager){
        return $bddmanager->getUserRepository()->checkUsername($this);
    }

    public function insertDresseur(BddManager $bddmanager){
        $bddmanager->getUserRepository()->insertUser($this);
    }

    public function updateCounter(BddManager $bddmanager){
        $bddmanager->getUserRepository()->updateCount($this);
    }

    public function getUserId(BddManager $bddmanager){
        return $bddmanager->getUserRepository()->UserId($this);
    }

}