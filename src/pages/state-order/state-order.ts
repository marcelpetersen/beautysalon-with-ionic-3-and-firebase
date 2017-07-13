import { StateOrderDetailsPage } from './../state-order-details/state-order-details';
import { StateOrderEditFotoPage } from './../state-order-edit-foto/state-order-edit-foto';
import { StateOrderEditPage } from './../state-order-edit/state-order-edit';
import { AuthProvider } from './../../providers/auth/auth';
import { StateOrderProvider } from './../../providers/state-order/state-order';
import { UserProvider } from './../../providers/user/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseListObservable } from 'angularfire2';
import { StateOrder } from './../../models/state-order';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Loading } from 'ionic-angular';

/**
 * Generated class for the StateOrderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-state-order',
  templateUrl: 'state-order.html',
})
export class StateOrderPage {

  state: StateOrder;

  statesorder: FirebaseListObservable<StateOrder[]>;
  view: string = 'Status Ativos';

  stateOrderForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userProvider: UserProvider,
    public stateOrderProvider: StateOrderProvider,
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
    this.stateOrderForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      state: ['', [Validators.required, Validators.minLength(1)]]
    });   

  }

  //O primeiro LifeCycleEvent a ser executado
  //Verificação de autenticação de qualquer usuário, caso ele já esteja autenticado ele poderá entrar na página, caso contrário "NÃO PODERÁ ENTRAR"
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  //O segundo LifeCycleEvent a ser executado
  ionViewDidLoad(){    
    this.statesorder = this.stateOrderProvider.statesorder;   
  }

  //Método responsável por realizar um filtro, quando estivermos na ABA "category" ele filtra na lista de categorias que estamos procurando no campo "Search"
  filterItems(event: any): void {
    //Variável "searchTerm" do tipo "string" usada para guardar o valor da nossa busca 
    let searchTerm: string = event.target.value;
    //Lista de categorias
    this.statesorder = this.stateOrderProvider.statesorder;   
    //Lista de usuários
    //this.users = this.userService.users;
    //Caso submetemos a uma busca por dados no "searchTerm"
    if (searchTerm) {
      //Um "switch case" para a troca de "Views [categorias e usuários]"
      switch(this.view) {
        //Caso "view-category list" seja escolhida e haja alguma busca no "searchTerm"
        case 'Status Ativos':
          this.statesorder = <FirebaseListObservable<StateOrder[]>>this.statesorder
            .map((statesorder: StateOrder[]) => statesorder.filter((state: StateOrder) => (state.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
          break;

        case 'Status Bloqueados':
          this.statesorder = <FirebaseListObservable<StateOrder[]>>this.statesorder
            .map((statesorder: StateOrder[]) => statesorder.filter((state: StateOrder) => (state.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
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

  //Criar catgoria
  onStateOrderCreate( state: StateOrder ): void {
    //console.log( 'StateOrder:', state );    
  }

  //Atualizar categoria
  onStateOrderUpdate( state: StateOrder ) {
    this.navCtrl.push( StateOrderEditPage, { 'state': state } ); 
  } 

  //Atualizar categoria
  onStateOrderUpdateFoto( state: StateOrder ) {
    this.navCtrl.push( StateOrderEditFotoPage, { 'state': state } ); 
  } 

  onStateOrderDetails( state: StateOrder ) {
    this.navCtrl.push( StateOrderDetailsPage, { 'state': state } ); 
  } 

  //Deletar categoria selecionada
  onStateOrderDelete( state: StateOrder ){    
      this.alertCtrl.create({
          message: 'Deseja realmente deletar o status?',
          buttons: [
              {
                  text: 'Yes',
                  handler: () => {
                    //Delete Realtime Database
                    this.stateOrderProvider.delete( state )
                    .then( (sucesso) => {  
                    //Delete Success
                    this.stateOrderDeleteToastSuccess();
                    })
                    .catch( (error) => {
                    //Delete Err
                    this.stateOrderDeleteToastErr();
                    });
                  }
              },
              {
                  text: 'Cancel',
                  handler:() => {
                    //Direciona o usuário para página de lista
                    this.navCtrl.setRoot(StateOrderPage);                    
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

    //"formCategory" recupera todos os valores "Dados" do formulário
    let formState = this.stateOrderForm.value;
    let name: string = formState.name;

    this.stateOrderProvider.stateOrderExists(name)
      .first()
      .subscribe((stateOrderExists: boolean) => {
        //Caso já exista o cadastro do nome iunserido no formulário
        if (!stateOrderExists) {
            //Cadastra no "Firebase Database"
            this.stateOrderProvider.create(formState)
              .then(() => {
                //Mensagem de cadastrado com sucesso
                this.stateOrderAddToastSuccess();
                //Direciona o usuário para página de lista
                this.navCtrl.setRoot(StateOrderPage);
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível cadastrar
                this.stateOrderAddToastErr();
                //Destrói o loading
                loading.dismiss();
              });        
        } else {
          //Mensagem caso o nome inserido já está consta no banco de dados
          this.showAlert(`O nome ${name} já está sendo usado!`);
          //Direciona ousuário para a página de lista de categoria
          this.navCtrl.setRoot( StateOrderPage );
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
  stateOrderAddToastSuccess(){
      this.toastCtrl.create({
        message: 'State added successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível cadastrar
  stateOrderAddToastErr(){
      this.toastCtrl.create({
        message: 'Unable to add to state!',
        duration: 3000
      }).present();
  }

  //Mensagem de deletado com sucesso
  stateOrderDeleteToastSuccess(){
      this.toastCtrl.create({
        message: 'State deleted successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível deletar
  stateOrderDeleteToastErr(){
      this.toastCtrl.create({
        message: 'Unable to delete to state!',
        duration: 3000
      }).present();
  }


}
