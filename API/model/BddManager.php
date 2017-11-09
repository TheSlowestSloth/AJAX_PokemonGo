<?php

class BddManager{

    private $connexion;
    private $userRepository;
    private $pokedexRepository;
    private $pokedexUserRepository;

    public function setUserRepository($userRepository){
        $this->userRepository = $userRepository;
    }

    public function getUserRepository(){
        return $this->userRepository;
    }

    public function setPokedexRepository($pokedexRepository){
        $this->pokedexRepository = $pokedexRepository;
    }

    public function getPokedexRepository(){
        return $this->pokedexRepository;
    }

    public function setPokedexUserRepository($pokedexUserRepository){
        $this->pokedexUserRepository = $pokedexUserRepository;
    }

    public function getPokedexUserRepository(){
        return $this->pokedexUserRepository;
    }

    public function __construct(){
        
        $this->connexion = ClassConnexion::getConnexion();
        
        $this->setUserRepository(new RepositoryUser($this->connexion));
        $this->setPokedexRepository(new RepositoryPokedex($this->connexion));
        $this->setPokedexUserRepository(new RepositoryPokedexUser($this->connexion));
        
    }
        
}
        
?>