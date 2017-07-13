export class Order {

    //Criando um atributo público fora do construtor não precisamos passar ele toda vez que quisermos instanciar a nossa classe
    //Caso contrário precisáríamos instanciar todos os atributos listados no constructor que pertence a nossa classe
    public $key: string;
    
    constructor(
        public category: string,
        public client: string,
        public driver: string,
        public description: string,
        public date: string,
        public time: string,
        public state: string,
        public photo: string
    ) {
        //Code constructor
    }

}