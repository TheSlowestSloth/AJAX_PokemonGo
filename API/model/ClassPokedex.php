<?php

class ClassPokedex implements JsonSerializable{

    private $tab;
    private $type;

    public function getType(){
        return $this->type;
    }

    public function setType($type){
        $this->type = $type;
    }

    public function __construct($bdd, $type){

        $this->setType($type);

        if($type == null){

            $this->tab = $this->getPokedex($bdd);

        }
        else{

            $this->tab = $this->getPokedexType($bdd);

        }

    }

    function jsonSerialize() {

        return [
            $this->tab
        ];
        
    }
    
    public function getPokedex(BddManager $bddmanager){
        return $bddmanager->getPokedexRepository()->getAllPokedex($this);
    }

    public function getPokedexType(BddManager $bddmanager){
        return $bddmanager->getPokedexRepository()->getTypePokedex($this);
    }

}

?>