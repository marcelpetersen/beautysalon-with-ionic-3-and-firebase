import { StateLevelDetailsPage } from './../state-level-details/state-level-details';
import { StateLevelEditFotoPage } from './../state-level-edit-foto/state-level-edit-foto';
import { StateLevelEditPage } from './../state-level-edit/state-level-edit';
import { AuthProvider } from './../../providers/auth/auth';
import { StateLevelProvider } from './../../providers/state-level/state-level';
import { UserProvider } from './../../providers/user/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseListObservable } from 'angularfire2';
import { StateLevel } from './../../models/state-level';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Loading } from 'ionic-angular';

/**
 * Generated class for the StateLevelPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-state-level',
  templateUrl: 'state-level.html',
})
export class StateLevelPage {

  state: StateLevel;

  stateslevel: FirebaseListObservable<StateLevel[]>;
  view: string = 'Status Ativos';

  stateLevelForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userProvider: UserProvider,
    public stateLevelProvider: StateLevelProvider,
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
    this.stateLevelForm = this.formBuilder.group({
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
    this.stateslevel = this.stateLevelProvider.stateslevel;   
  }

  //Método responsável por realizar um filtro, quando estivermos na ABA "category" ele filtra na lista de categorias que estamos procurando no campo "Search"
  filterItems(event: any): void {
    //Variável "searchTerm" do tipo "string" usada para guardar o valor da nossa busca 
    let searchTerm: string = event.target.value;
    //Lista de categorias
    this.stateslevel = this.stateLevelProvider.stateslevel;   
    //Lista de usuários
    //this.users = this.userService.users;
    //Caso submetemos a uma busca por dados no "searchTerm"
    if (searchTerm) {
      //Um "switch case" para a troca de "Views [categorias e usuários]"
      switch(this.view) {
        //Caso "view-category list" seja escolhida e haja alguma busca no "searchTerm"
        case 'Status Ativos':
          this.stateslevel = <FirebaseListObservable<StateLevel[]>>this.stateslevel
            .map((stateslevel: StateLevel[]) => stateslevel.filter((state: StateLevel) => (state.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
          break;

        case 'Status Bloqueados':
          this.stateslevel = <FirebaseListObservable<StateLevel[]>>this.stateslevel
            .map((stateslevel: StateLevel[]) => stateslevel.filter((state: StateLevel) => (state.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
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
  onStateLevelCreate( state: StateLevel ): void {
    //console.log( 'StateLevel:', state );    
  }

  //Atualizar categoria
  onStateLevelUpdate( state: StateLevel ) {
    this.navCtrl.push( StateLevelEditPage, { 'state': state } ); 
  } 

  //Atualizar categoria
  onStateLevelUpdateFoto( state: StateLevel ) {
    this.navCtrl.push( StateLevelEditFotoPage, { 'state': state } ); 
  } 

  onStateLevelDetails( state: StateLevel ) {
    this.navCtrl.push( StateLevelDetailsPage, { 'state': state } ); 
  } 

  //Deletar categoria selecionada
  onStateLevelDelete( state: StateLevel ){    
      this.alertCtrl.create({
          message: 'Deseja realmente deletar o status?',
          buttons: [
              {
                  text: 'Yes',
                  handler: () => {
                    //Delete Realtime Database
                    this.stateLevelProvider.delete( state )
                    .then( (sucesso) => {  
                    //Delete Success
                    this.stateLevelDeleteToastSuccess();
                    })
                    .catch( (error) => {
                    //Delete Err
                    this.stateLevelDeleteToastErr();
                    });
                  }
              },
              {
                  text: 'Cancel',
                  handler:() => {
                    //Direciona o usuário para página de lista
                    this.navCtrl.setRoot(StateLevelPage);                    
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
    let formState = this.stateLevelForm.value;
    let name: string = formState.name;

    this.stateLevelProvider.stateLevelExists(name)
      .first()
      .subscribe((stateLevelExists: boolean) => {
        //Caso já exista o cadastro do nome iunserido no formulário
        if (!stateLevelExists) {
            //Cadastra no "Firebase Database"
            this.stateLevelProvider.create(formState)
              .then(() => {
                //Mensagem de cadastrado com sucesso
                this.stateLevelAddToastSuccess();
                //Direciona o usuário para página de lista
                this.navCtrl.setRoot(StateLevelPage);
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível cadastrar
                this.stateLevelAddToastErr();
                //Destrói o loading
                loading.dismiss();
              });        
        } else {
          //Mensagem caso o nome inserido já está consta no banco de dados
          this.showAlert(`O nome ${name} já está sendo usado!`);
          //Direciona ousuário para a página de lista de categoria
          this.navCtrl.setRoot( StateLevelPage );
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
  stateLevelAddToastSuccess(){
      this.toastCtrl.create({
        message: 'State added successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível cadastrar
  stateLevelAddToastErr(){
      this.toastCtrl.create({
        message: 'Unable to add to state!',
        duration: 3000
      }).present();
  }

  //Mensagem de deletado com sucesso
  stateLevelDeleteToastSuccess(){
      this.toastCtrl.create({
        message: 'State deleted successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível deletar
  stateLevelDeleteToastErr(){
      this.toastCtrl.create({
        message: 'Unable to delete to state!',
        duration: 3000
      }).present();
  }


}
