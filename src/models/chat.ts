export class Chat {

    //Criando um atributo público fora do construtor não precisamos passar ele toda vez que quisermos instanciar a nossa classe
    //Caso contrário precisáríamos instanciar todos os atributos listados no constructor que pertence a nossa classe
    public $key: string;

    constructor(
        public lastMessage: string,
        public timestamp: any,
        public title: string,
        public photo: string
    ) {}

}