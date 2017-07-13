import { SigninPage } from './../signin/signin';
import { UserDetailsPage } from './../user-details/user-details';
import { UserEditPage } from './../user-edit/user-edit';
import { SignupPage } from './../signup/signup';
import { StateLevelProvider } from './../../providers/state-level/state-level';
import { StateGeneralProvider } from './../../providers/state-general/state-general';
import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { User } from './../../models/user';
import { StateLevel } from './../../models/state-level';
import { StateGeneral } from './../../models/state-general';
import { FirebaseListObservable, FirebaseAuthState } from 'angularfire2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, ToastController } from 'ionic-angular';

/**
 * Generated class for the UserPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  
  statesgeneral: FirebaseListObservable<StateGeneral[]>;
  stateslevel: FirebaseListObservable<StateLevel[]>;

  user: User;

  users: FirebaseListObservable<User[]>;
  view: string = 'Contatos Ativos';

  signupForm: FormGroup;

  //@Input() title: string;
  //@Input() user: UserModel;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, //Não está sendo usado, deletar depois...
    public authProvider: AuthProvider,
    public userProvider: UserProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public stateGeneralProvider: StateGeneralProvider,
    public stateLevelProvider: StateLevelProvider
    ) {
      this.initialize();
  }

  //Método executado sempre que a página é iniciada
  initialize(){

    //Variável responsável por limitar o uso de caracteres inválidos no formulário
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    //Aqui ocorre a vlidação do formulário propriamente dito
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      //level: ['', [Validators.required, Validators.minLength(1)]],
      //state: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });    

    this.statesgeneral = this.stateGeneralProvider.statesgeneral; 
    this.stateslevel = this.stateLevelProvider.stateslevel; 

  }

  //O primeiro LifeCycleEvent a ser executado
  //Verificação de autenticação de qualquer usuário, caso ele já esteja autenticado ele poderá entrar na página "USER", caso contrário "NÃO PODERÁ ENTRAR"
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  onSignup(): void{
    this.navCtrl.push( SignupPage );
  }

  ionViewDidLoad(){
    this.users = this.userProvider.users; 
    
    this.statesgeneral = this.stateGeneralProvider.statesgeneral; 
    this.stateslevel = this.stateLevelProvider.stateslevel;     
  }

  //Método responsável por realizar um filtro, quando estivermos na ABA "category" ele filtra na lista de categorias que estamos procurando no campo "Search"
  filterItems(event: any): void {
    //Variável "searchTerm" do tipo "string" usada para guardar o valor da nossa busca 
    let searchTerm: string = event.target.value;
    //Lista de categorias
    this.users = this.userProvider.users;   
    //Lista de usuários
    //this.users = this.userService.users;
    //Caso submetemos a uma busca por dados no "searchTerm"
    if (searchTerm) {
      //Um "switch case" para a troca de "Views [categorias e usuários]"
      switch(this.view) {
        //Caso "view-users-list" seja escolhida e haja alguma busca no "searchTerm"
        case 'Contatos Ativos':
          this.users = <FirebaseListObservable<User[]>>this.users
            .map((users: User[]) => users.filter((user: User) => (user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)));
          break;        

        case 'Contatos Bloqueados':
          this.users = <FirebaseListObservable<User[]>>this.users
            .map((users: User[]) => users.filter((user: User) => (user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)));
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

  onUserCreate( user: User ): void {
    console.log( 'User:', user );    
  }

  //Atualizar categoria
  onUserUpdate( user: User ) {
    this.navCtrl.push( UserEditPage, { 'user': user } ); 
  } 

  onUserDetails( user: User ) {
    this.navCtrl.push( UserDetailsPage, { 'user': user } ); 
  } 


  //Deletar categoria selecionada
  onUserDelete( user: User ){    
      this.alertCtrl.create({
          message: 'Deseja realmente deletar o usuário?',
          buttons: [
              {
                  text: 'Yes',
                  handler: () => {
                    //Delete Realtime Database
                    this.userProvider.delete( user )
                    .then( (sucesso) => {  
                    //Delete Success
                    this.userDeleteToastSuccess();
                    })
                    .catch( (error) => {
                    //Delete Err
                    this.userDeleteToastErr();
                    });
                  }
              },
              {
                  text: 'Cancel',
                  handler:() => {
                    //Direciona o usuário para página de lista
                    this.navCtrl.setRoot(UserPage);                    
                  }
              }
          ]
      }).present(); 

  }  

  onLogout(): void {
      this.alertCtrl.create({
          message: 'Do you want to quit?',
          buttons: [
              {
                  text: 'Yes',
                  handler: () => {
                      this.authProvider.logout();
                      this.navCtrl.setRoot(SigninPage);
                  }
              },
              {
                  text: 'No'
              }
          ]
      }).present();
  }

  onSubmit(): void {

    //console.log( this.signupForm.value );

    //Chama o método loading
    let loading: Loading = this.showLoading();
    //"formUser" recupera todos os valores "Dados" do formulário
    let formUser = this.signupForm.value;
    let username: string = formUser.username;

    this.userProvider.userExists(username)
      .first()
      .subscribe((userExists: boolean) => {

        if (!userExists) {

          //this.authProvider.createAuthUser({
          this.authProvider.createAuthUser({
            email: formUser.email,
            password: formUser.password
          }).then((authState: FirebaseAuthState) => {

            //Aqui é deletado o "password" no "Firebase Database"
            delete formUser.password;
            
            //Aqui é recuperado o id único do usuário no momento do cadastro de autenticação com email e senha
            let uuid: string = authState.auth.uid;

            //Cadastra no "Firebase Database"
            this.userProvider.create(formUser, uuid)
              .then(() => {                
                console.log('Usuario cadastrado com sucesso!');
                this.authProvider.logout()
                this.navCtrl.setRoot( SigninPage );                
                //this.navCtrl.setRoot(UserPage);
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                console.log(error);
                //Destrói o loading
                loading.dismiss();
                this.showAlert(error);
              });

          }).catch((error: any) => {
            console.log(error);
            //Destrói o loading
            loading.dismiss();
            this.showAlert(error);
          });

        } else {
          this.showAlert(`O username ${username} Já está sendo usado em outra conta!`);
          loading.dismiss();
        }

      });

  }  

  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    return loading;
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }

  //Mensagem de deletado com sucesso
  userDeleteToastSuccess(){
      this.toastCtrl.create({
        message: 'User deleted successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível deletar
  userDeleteToastErr(){
      this.toastCtrl.create({
        message: 'Unable to delete to user!',
        duration: 3000
      }).present();
  }

}
