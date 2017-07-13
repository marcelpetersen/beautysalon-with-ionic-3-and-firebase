export class User {

    //Criando um atributo público fora do construtor não precisamos passar ele toda vez que quisermos instanciar a nossa classe
    //Caso contrário precisáríamos instanciar todos os atributos listados no constructor que pertence a nossa classe
    public $key: string;
    
    constructor(
        public name: string,
        public username: string,
        public email: string,
        public photo: string,
        public level: string,
        public state: string
    ) {
        //Code constructor
    }

}