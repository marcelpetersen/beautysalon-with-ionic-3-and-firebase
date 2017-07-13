import { ClientDetailsPage } from './../client-details/client-details';
import { ClientEditFotoPage } from './../client-edit-foto/client-edit-foto';
import { ClientEditPage } from './../client-edit/client-edit';
import { AuthProvider } from './../../providers/auth/auth';
import { StateGeneralProvider } from './../../providers/state-general/state-general';
import { ClientProvider } from './../../providers/client/client';
import { UserProvider } from './../../providers/user/user';
import { StateGeneral } from './../../models/state-general';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseListObservable } from 'angularfire2';
import { Client } from './../../models/client';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Loading } from 'ionic-angular';

/**
 * Generated class for the ClientPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-client',
  templateUrl: 'client.html',
})
export class ClientPage {

  client: Client;

  customers: FirebaseListObservable<Client[]>;
  view: string = 'Clientes Ativos';

  clientForm: FormGroup;

  statesgeneral: FirebaseListObservable<StateGeneral[]>;  

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public clientProvider: ClientProvider,
    public stateGeneralProvider: StateGeneralProvider,
    public authProvider: AuthProvider,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController 
    ) {
      this.initialize();
  }

  //Método executado sempre que a página é iniciada
  initialize(){
    
    //Variável responsável por limitar o uso de caracteres inválidos no formulário
    //let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    //Aqui ocorre a vlidação do formulário propriamente dito
    this.clientForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      rg: [''],
      cpf: [''],
      cep: [''],
      uf: [''],
      estado: [''],
      cidade: [''],
      bairro: [''],
      logradouro: [''],
      numero: [''],
      complemento: [''],
      residencia: [''],
      celular: [''],
      comercial: [''],
      quantidade: [''],
      email: [''],
      observacao: [''],
      state: ['', [Validators.required, Validators.minLength(1)]]
    });  

    this.statesgeneral = this.stateGeneralProvider.statesgeneral; 

  }

  //O primeiro LifeCycleEvent a ser executado
  //Verificação de autenticação de qualquer usuário, caso ele já esteja autenticado ele poderá entrar na página, caso contrário "NÃO PODERÁ ENTRAR"
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }  

  //O segundo LifeCycleEvent a ser executado
  ionViewDidLoad() {
    this.customers = this.clientProvider.customers;    
    this.statesgeneral = this.stateGeneralProvider.statesgeneral; 
  }

  //Método responsável por realizar um filtro, quando estivermos na ABA "category" ele filtra na lista de categorias que estamos procurando no campo "Search"
  filterItems(event: any): void {
    //Variável "searchTerm" do tipo "string" usada para guardar o valor da nossa busca 
    let searchTerm: string = event.target.value;
    //Lista de categorias
    this.customers = this.clientProvider.customers;   
    //Lista de usuários
    //this.users = this.userService.users;
    //Caso submetemos a uma busca por dados no "searchTerm"
    if (searchTerm) {
      //Um "switch case" para a troca de "Views [categorias e usuários]"
      switch(this.view) {
        //Caso "view-category list" seja escolhida e haja alguma busca no "searchTerm"
        case 'Clientes Ativos':
          this.customers = <FirebaseListObservable<Client[]>>this.customers
            .map((customers: Client[]) => customers.filter((client: Client) => (client.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
          break;

        case 'Clientes Bloqueados':
          this.customers = <FirebaseListObservable<Client[]>>this.customers
            .map((customers: Client[]) => customers.filter((client: Client) => (client.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
          break;
          
        /*
        //Caso "view-users-list" seja escolhida e haja alguma busca no "searchTerm"
        case 'users':
          this.users = <FirebaseListObservable<User[]>>this.users
            .map((users: User[]) => users.filter((user: User) => (user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)));
          break;
        */
        
      }
    }    
  }

  //Cadastrar clientes
  onClientCreate( client: Client ): void {
    //console.log( 'Client:', client );    
  }

  //Atualizar cliente
  onClientUpdate( client: Client ) {
    this.navCtrl.push( ClientEditPage, { 'client': client } ); 
  } 

  //Atualizar foto cliente
  onClientUpdateFoto( client: Client ) {
    this.navCtrl.push( ClientEditFotoPage, { 'client': client } ); 
  } 

  onClientDetails( client: Client ) {
    this.navCtrl.push( ClientDetailsPage, { 'client': client } ); 
  } 

  //Deletar categoria selecionada
  onClientDelete( client: Client ){    
      this.alertCtrl.create({
          message: 'Deseja realmente deletar o cliente?',
          buttons: [
              {
                  text: 'Yes',
                  handler: () => {
                    //Delete Realtime Database
                    this.clientProvider.delete( client )
                    .then( (sucesso) => {  
                    //Delete Success
                    this.clientDeleteToastSuccess();
                    })
                    .catch( (error) => {
                    //Delete Err
                    this.clientDeleteToastErr();
                    });
                  }
              },
              {
                  text: 'Cancel',
                  handler:() => {
                    //Direciona o usuário para página de lista
                    this.navCtrl.setRoot(ClientPage);                    
                  }
              }
          ]
      }).present(); 

  } 

  //Método responsável por cadastrar no banco de dados
  onSubmit(): void {

    //console.log( this.signupForm.value );

    //Chama o método loading
    let loading: Loading = this.showLoading();

    //"formClient" recupera todos os valores "Dados" do formulário
    let formClient = this.clientForm.value;
    let name: string = formClient.name;

    this.clientProvider.clientExists(name)
      .first()
      .subscribe((clientExists: boolean) => {
        //Caso já exista o cadastro do nome iunserido no formulário
        if (!clientExists) {
            //Cadastra no "Firebase Database"
            this.clientProvider.create(formClient)
              .then(() => {
                //Mensagem de cadastrado com sucesso
                this.clientAddToastSuccess();
                //Direciona o usuário para página de lista
                this.navCtrl.setRoot(ClientPage);
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível cadastrar
                this.clientAddToastErr();
                //Destrói o loading
                loading.dismiss();
              });         
        } else {
          //Mensagem caso o nome inserido já está consta no banco de dados
          this.showAlert(`O nome ${name} já está sendo usado!`);
          //Direciona ousuário para a página de lista de categoria
          this.navCtrl.setRoot( ClientPage );
          //Destrói o loading
          loading.dismiss();
        }

      });

  }  

  //Mensagem de aguarde por favor
  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    return loading;
  }

  //Mensagem de alerta ao usuário
  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }

  //Refresh na página
  onRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
 
  //Mensagem de cadastrado com sucesso
  clientAddToastSuccess(){
      this.toastCtrl.create({
        message: 'Client added successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível cadastrar
  clientAddToastErr(){
      this.toastCtrl.create({
        message: 'Unable to add to client!',
        duration: 3000
      }).present();
  }

  //Mensagem de deletado com sucesso
  clientDeleteToastSuccess(){
      this.toastCtrl.create({
        message: 'Client deleted successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível deletar
  clientDeleteToastErr(){
      this.toastCtrl.create({
        message: 'Unable to delete to client!',
        duration: 3000
      }).present();
  }


}
