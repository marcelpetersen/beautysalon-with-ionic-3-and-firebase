export class Driver {

    //Criando um atributo público fora do construtor não precisamos passar ele toda vez que quisermos instanciar a nossa classe
    //Caso contrário precisáríamos instanciar todos os atributos listados no constructor que pertence a nossa classe
    public $key: string;
    
    constructor(
        public name: string,
        public rg: string,
        public cnh: string,
        public cpf: string,
        public cep: string,
        public uf: string,
        public estado: string,
        public cidade: string,
        public bairro: string,
        public logradouro: string,
        public numero: string,
        public complemento: string,
        public residencia: string,
        public celular: string,
        public comercial: string,
        public email: string,
        public observacao: string,        
        public state: string,
        public photo: string
    ) {
        //Code constructor
    }

}