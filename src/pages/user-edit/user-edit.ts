import { UserPage } from './../user/user';
import { StateLevelProvider } from './../../providers/state-level/state-level';
import { StateGeneralProvider } from './../../providers/state-general/state-general';
import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from './../../models/user';
import { StateLevel } from './../../models/state-level';
import { StateGeneral } from './../../models/state-general';
import { FirebaseListObservable } from 'angularfire2';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';

/**
 * Generated class for the UserEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-edit',
  templateUrl: 'user-edit.html',
})
export class UserEditPage {

  statesgeneral: FirebaseListObservable<StateGeneral[]>;
  stateslevel: FirebaseListObservable<StateLevel[]>;

  view: string = 'Atualizar Contato';
  currentUser: User;
  userForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public authProvider: AuthProvider,
    public userProvider: UserProvider,
    public stateGeneralProvider: StateGeneralProvider,
    public stateLevelProvider: StateLevelProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
    ) {
      this.initialize();
  } 

  //Método executado sempre que a página é iniciada
  initialize(){

    //Variável responsável por limitar o uso de caracteres inválidos no formulário
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    //Aqui ocorre a vlidação do formulário propriamente dito
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      //level: ['', [Validators.required, Validators.minLength(1)]],
      //state: ['', [Validators.required, Validators.minLength(1)]],
      //password: ['', [Validators.required, Validators.minLength(6)]]
    });    

    //Pegamos o parâmetro enviado pela página "user-edit.page.html"
    this.currentUser = this.navParams.get('user'); 

    this.statesgeneral = this.stateGeneralProvider.statesgeneral; 
    this.stateslevel = this.stateLevelProvider.stateslevel;

  }

  //Primeiro LifeCicleEvent a ser executado, verificando a autenticidade do usuário e se ele tem permissão para estar na devida página
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  //É executado quando a página foi carregada. Esse evento só acontece uma vez por página sendo criada.
  ionViewDidLoad() {
    this.currentUser = this.navParams.get('user');   

    this.statesgeneral = this.stateGeneralProvider.statesgeneral; 
    this.stateslevel = this.stateLevelProvider.stateslevel;        
  }

  //Executa quando a página está prestes a ser destruída e ter seus elementos removidos.
  ionViewWillUnload(){
    this.navCtrl.setRoot( UserPage );
  }

  //Aqui é executado o código para salvar no banco de dados os dados inseridos
  onSubmit(): void {    

    //console.log( this.userForm.value );

    //Chama o método loading
    let loading: Loading = this.showLoading();
    
    //"formUser" recupera todos os valores "Dados" do formulário
    let formUser = this.userForm.value;
    let name: string = formUser.name;

    this.userProvider.userExists(name)
      .first()
      .subscribe((userExists: boolean) => {
        if (!userExists) {
            //Cadastra no "Firebase Database"
            this.userProvider.edit( this.currentUser )
              .then(() => {
                //Mensagem de atualizado com sucesso
                this.userUpdateToastSuccess();
                //Aqui encontrei essa solução, após atualizar a categoria selecionada, o sistema mantém a categoria anterior, então aqui estou deletando a categoria anterior
                this.userProvider.delete( this.currentUser );
                //Direciona ousuário para a página de lista de categoria
                this.navCtrl.setRoot( UserPage );
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível atualizar a categoria
                this.userUpdateToastErr();
                //Destrói o loading
                loading.dismiss();
                this.showAlert(error);
              }); 
        } else {
            //Cadastra no "Firebase Database"
            this.userProvider.edit( this.currentUser )
              .then(() => {
                //Mensagem de atualizado com sucesso
                this.userUpdateToastSuccess();
                //Aqui encontrei essa solução, após atualizar a categoria selecionada, o sistema mantém a categoria anterior, então aqui estou deletando a categoria anterior
                //this.userProvider.delete( this.currentUser );
                //Direciona ousuário para a página de lista de categoria
                this.navCtrl.setRoot( UserPage );
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível atualizar a categoria
                this.userUpdateToastErr();
                //Destrói o loading
                loading.dismiss();
                this.showAlert(error);
              });              
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

  //Mensagem de alerta de "Ok" para o usuário
  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }

  //Mensagem de alerta de "Erro" para o usuário
  showAlertError(): void {
    this.alertCtrl.create({
      message: 'Teste de erro',
      buttons: ['Ok']
    }).present();
  }

  //Mensagem de cadastrado com sucesso
  userUpdateToastSuccess(){
      this.toastCtrl.create({
        message: 'User successfully updated!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível cadastrar
  userUpdateToastErr(){
      this.toastCtrl.create({
        message: 'Unable to update to user!',
        duration: 3000
      }).present();
  }

}
