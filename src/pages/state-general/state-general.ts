import { StateGeneralDetailsPage } from './../state-general-details/state-general-details';
import { StateGeneralEditFotoPage } from './../state-general-edit-foto/state-general-edit-foto';
import { StateGeneralEditPage } from './../state-general-edit/state-general-edit';
import { AuthProvider } from './../../providers/auth/auth';
import { StateGeneralProvider } from './../../providers/state-general/state-general';
import { UserProvider } from './../../providers/user/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseListObservable } from 'angularfire2';
import { StateGeneral } from './../../models/state-general';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Loading } from 'ionic-angular';

/**
 * Generated class for the StateGeneralPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-state-general',
  templateUrl: 'state-general.html',
})
export class StateGeneralPage {

  state: StateGeneral;

  statesgeneral: FirebaseListObservable<StateGeneral[]>;
  view: string = 'Status Ativos';

  stateGeneralForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userProvider: UserProvider,
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
    this.stateGeneralForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      state: ['', [Validators.required, Validators.minLength(1)]]
      //state: ['', [Validators.required, Validators.minLength(1)]]
    });   

  }

  //O primeiro LifeCycleEvent a ser executado
  //Verificação de autenticação de qualquer usuário, caso ele já esteja autenticado ele poderá entrar na página, caso contrário "NÃO PODERÁ ENTRAR"
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  //O segundo LifeCycleEvent a ser executado
  ionViewDidLoad(){    
    this.statesgeneral = this.stateGeneralProvider.statesgeneral;   
  }

  //Método responsável por realizar um filtro, quando estivermos na ABA "category" ele filtra na lista de categorias que estamos procurando no campo "Search"
  filterItems(event: any): void {
    //Variável "searchTerm" do tipo "string" usada para guardar o valor da nossa busca 
    let searchTerm: string = event.target.value;
    //Lista de categorias
    this.statesgeneral = this.stateGeneralProvider.statesgeneral;   
    //Lista de usuários
    //this.users = this.userService.users;
    //Caso submetemos a uma busca por dados no "searchTerm"
    if (searchTerm) {
      //Um "switch case" para a troca de "Views [categorias e usuários]"
      switch(this.view) {
        //Caso "view-category list" seja escolhida e haja alguma busca no "searchTerm"
        case 'Status Ativos':
          this.statesgeneral = <FirebaseListObservable<StateGeneral[]>>this.statesgeneral
            .map((statesgeneral: StateGeneral[]) => statesgeneral.filter((state: StateGeneral) => (state.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
          break;

        case 'Status Bloqueados':
          this.statesgeneral = <FirebaseListObservable<StateGeneral[]>>this.statesgeneral
            .map((statesgeneral: StateGeneral[]) => statesgeneral.filter((state: StateGeneral) => (state.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
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
  onStateGeneralCreate( state: StateGeneral ): void {
    //console.log( 'StateGeneral:', state );    
  }

  //Atualizar categoria
  onStateGeneralUpdate( state: StateGeneral ) {
    this.navCtrl.push( StateGeneralEditPage, { 'state': state } ); 
  } 

  //Atualizar categoria
  onStateGeneralUpdateFoto( state: StateGeneral ) {
    this.navCtrl.push( StateGeneralEditFotoPage, { 'state': state } ); 
  } 

  onStateGeneralDetails( state: StateGeneral ) {
    this.navCtrl.push( StateGeneralDetailsPage, { 'state': state } ); 
  } 

  //Deletar categoria selecionada
  onStateGeneralDelete( state: StateGeneral ){    
      this.alertCtrl.create({
          message: 'Deseja realmente deletar o status?',
          buttons: [
              {
                  text: 'Yes',
                  handler: () => {
                    //Delete Realtime Database
                    this.stateGeneralProvider.delete( state )
                    .then( (sucesso) => {  
                    //Delete Success
                    this.stateGeneralDeleteToastSuccess();
                    })
                    .catch( (error) => {
                    //Delete Err
                    this.stateGeneralDeleteToastErr();
                    });
                  }
              },
              {
                  text: 'Cancel',
                  handler:() => {
                    //Direciona o usuário para página de lista
                    this.navCtrl.setRoot(StateGeneralPage);                    
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
    let formState = this.stateGeneralForm.value;
    let name: string = formState.name;

    this.stateGeneralProvider.stateGeneralExists(name)
      .first()
      .subscribe((stateGeneralExists: boolean) => {
        //Caso já exista o cadastro do nome iunserido no formulário
        if (!stateGeneralExists) {
            //Cadastra no "Firebase Database"
            this.stateGeneralProvider.create(formState)
              .then(() => {
                //Mensagem de cadastrado com sucesso
                this.stateGeneralAddToastSuccess();
                //Direciona o usuário para página de lista
                this.navCtrl.setRoot(StateGeneralPage);
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível cadastrar
                this.stateGeneralAddToastErr();
                //Destrói o loading
                loading.dismiss();
              });        
        } else {
          //Mensagem caso o nome inserido já está consta no banco de dados
          this.showAlert(`O nome ${name} já está sendo usado!`);
          //Direciona ousuário para a página de lista de categoria
          this.navCtrl.setRoot( StateGeneralPage );
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
  stateGeneralAddToastSuccess(){
      this.toastCtrl.create({
        message: 'State added successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível cadastrar
  stateGeneralAddToastErr(){
      this.toastCtrl.create({
        message: 'Unable to add to state!',
        duration: 3000
      }).present();
  }

  //Mensagem de deletado com sucesso
  stateGeneralDeleteToastSuccess(){
      this.toastCtrl.create({
        message: 'State deleted successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível deletar
  stateGeneralDeleteToastErr(){
      this.toastCtrl.create({
        message: 'Unable to delete to state!',
        duration: 3000
      }).present();
  }


}
