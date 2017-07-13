import { InitialPage } from './../initial/initial';
//import { HomePage } from './../home/home';
import { FirebaseAuthState } from 'angularfire2';
import { UserProvider } from './../../providers/user/user';
import { FormBuilder } from '@angular/forms';
import { AuthProvider } from './../../providers/auth/auth';
import { FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';

/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  //Variável para tratar validação do formulário
  signupForm: FormGroup;

  //Constructor da classe "SignupPage"
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public userProvider: UserProvider    
    ) {

    //Variável responsável por limitar o uso de caracteres inválidos no formulário
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    //Aqui ocorre a vlidação do formulário propriamente dito
    //state: ['', [Validators.required, Validators.minLength(1)]],
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],      
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SignupPage');
  }

  //Método responsável por registrar o usuário
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
                console.log('Usuario cadastrado!');
                this.navCtrl.setRoot( InitialPage );
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


}

