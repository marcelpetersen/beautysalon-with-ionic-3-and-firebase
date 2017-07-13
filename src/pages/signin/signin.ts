import { OrderPage } from './../order/order';
import { SignupPage } from './../signup/signup';
//import { InitialPage } from './../initial/initial';
//import { HomePage } from './../home/home';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Loading, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

/**
 * Generated class for the SigninPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  //Variável para tratar validação do formulário
  signinForm: FormGroup;  

  //Constructor da classe "SigninPage"
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public authProvider: AuthProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController 
    ) {

      //Variável responsável por limitar o uso de caracteres inválidos no formulário
      let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

      //Aqui ocorre a vlidação do formulário propriamente dito
      this.signinForm = this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });      

      //this.onLoginAutomatico();
          
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SigninPage');
  }

  //Método responsável por logar o usuário
  onSubmit(): void {    

    //console.log( this.signinForm.value );

    //Variável "loading" responsável por exibir mensagem de "Please wait..."
    let loading: Loading =  this.showLoading();

    //Aqui é verificado se o usuário está logado ou não
    this.authProvider.signinWithEmail(this.signinForm.value)
    .then((isLogged: boolean) => {
      
      //Se está logado redireciona o usuário para "OrderPage"
      if(isLogged){
        this.navCtrl.setRoot( OrderPage );

        this.toastCtrl.create({
          message: 'Seja bem vindo!',
          duration: 3000
        }).present(); 

        loading.dismiss();
      }

      //Se não está logado, redireciona o usuário para "SigninPage"
    }).catch((error: any) => {
      console.log(error);
      loading.dismiss();
      this.showAlert(error);
    });
    
  }

  //Metodo não retorna nada, por isso o "void", redireciona o usuário para "SignupPage"
  onSignup(): void {
    this.navCtrl.push( SignupPage );
  }
  
  //Exibe uma mensagem de "Please wait..." enquanto os dados são processados
  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    return loading;
  }

  //Exibe uma mensagem ao usuário 
  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }  

  //Exibe uma mensagem no "log" para verificarmos e o usuário tem permissão para estar na devida página solicitada
  onHomepage(): void {
    this.navCtrl.setRoot( OrderPage )
    //"hasAccess" Significa "tem Acesso?"
    .then( (hasAccess: boolean) => {
      //Caso ele tenha acesso concedido ao entrar com login e senha
      //console.log( 'Autorizado!', hasAccess );  

      this.toastCtrl.create({
        message: 'Seja bem vindo!',
        duration: 3000
      }).present();   

    }).catch( err => {
      this.navCtrl.setRoot(SigninPage);
      //Caso ele tenha acesso negado ao enviar dados de login e senha
      //console.log( 'Não autorizado!', err );

      this.toastCtrl.create({
        message: 'Faça seu login!',
        duration: 3000
      }).present();       
      
    })
  }

}
