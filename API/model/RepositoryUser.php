<?php

class RepositoryUser{

    private $connexion;

    public function __construct($connexion){
        $this->connexion = $connexion;
    }

    public function checkUsername(ClassUser $user){

        $username = $user->getUsername();
        $password = $user->getPassword();

        $object = $this->connexion->prepare("SELECT * FROM dresseur WHERE username=:username");
        $object->execute(array(
            'username' => $username,
        ));
        $result = $object->fetch(PDO::FETCH_ASSOC);
        if($result['password'] == $password){
            return $result;
        }
        else{
            return false;
        }

    }

    public function UserId(ClassUser $user){

        $username = $user->getUsername();

        $object = $this->connexion->prepare("SELECT id FROM dresseur WHERE username=:username");
        $object->execute(array(
            'username' => $username,
        ));
        $result = $object->fetch(PDO::FETCH_ASSOC);
        return $result['id'];

    }

    public function insertUser(ClassUser $user){

        $username = $user->getUsername();
        $password = $user->getPassword(); 
        $counter = $user->getCounter(); 

        $object = $this->connexion->prepare("INSERT INTO dresseur SET username=:username, password=:password, counter=:counter");
        $object->execute(array(
            "username" => $username,
            "password" => $password,
            "counter" => $counter,
        ));
    }

    public function updateCount(ClassUser $user){

        $username = $user->getUsername();
        $counter = $user->getCounter(); 

        $object = $this->connexion->prepare("UPDATE dresseur SET counter=:counter WHERE username=:username");
        $object->execute(array(
            "username" => $username,
            "counter" => $counter,
        ));
    }

}