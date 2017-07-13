import { StateOrderPage } from './../state-order/state-order';
import { StateOrderProvider } from './../../providers/state-order/state-order';
import { AuthProvider } from './../../providers/auth/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StateOrder } from './../../models/state-order';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';

/**
 * Generated class for the StateOrderEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-state-order-edit',
  templateUrl: 'state-order-edit.html',
})
export class StateOrderEditPage {

  view: string = 'Atualizar Status';
  currentState: StateOrder;
  stateOrderForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public authProvider: AuthProvider,
    public stateOrderProvider: StateOrderProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
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
        description: [''],
        state: ['', [Validators.required, Validators.minLength(1)]]
      }); 

      //Pegamos o parâmetro enviado pela página "category-edit.page.html"
      this.currentState = this.navParams.get('state');    
  }

  //Primeiro LifeCicleEvent a ser executado, verificando a autenticidade do usuário e se ele tem permissão para estar na devida página
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  //É executado quando a página foi carregada. Esse evento só acontece uma vez por página sendo criada.
  ionViewDidLoad() {
    this.currentState = this.navParams.get('state');    
  }

  //Executa quando a página está prestes a ser destruída e ter seus elementos removidos.
  ionViewWillUnload(){
    this.navCtrl.setRoot( StateOrderPage );
  }

  //Aqui é executado o código para salvar no banco de dados os dados inseridos
  onSubmit(): void {    

    //console.log( this.userForm.value );

    //Chama o método loading
    let loading: Loading = this.showLoading();
    
    //"formUser" recupera todos os valores "Dados" do formulário
    let formState = this.stateOrderForm.value;
    let name: string = formState.name;

    this.stateOrderProvider.stateOrderExists(name)
      .first()
      .subscribe((stateOrderExists: boolean) => {
        if (!stateOrderExists) {
            //Cadastra no "Firebase Database"
            this.stateOrderProvider.edit( this.currentState )
              .then(() => {
                //Mensagem de atualizado com sucesso
                this.stateOrderUpdateToastSuccess();
                //Aqui encontrei essa solução, após atualizar a categoria selecionada, o sistema mantém a categoria anterior, então aqui estou deletando a categoria anterior
                this.stateOrderProvider.delete( this.currentState );
                //Direciona ousuário para a página de lista de categoria
                this.navCtrl.setRoot( StateOrderPage );
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível atualizar a categoria
                this.stateOrderUpdateToastErr();
                //Destrói o loading
                loading.dismiss();
                this.showAlert(error);
              });                
        } else {
            //Cadastra no "Firebase Database"
            this.stateOrderProvider.edit( this.currentState ) //this.currentCategory
              .then(() => {
                //Mensagem de atualizado com sucesso
                this.stateOrderUpdateToastSuccess();
                //Aqui encontrei essa solução, após atualizar a categoria selecionada, o sistema mantém a categoria anterior, então aqui estou deletando a categoria anterior
                //this.stateOrderProvider.delete( this.currentState );
                //Direciona ousuário para a página de lista de categoria
                this.navCtrl.setRoot( StateOrderPage );
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível atualizar a categoria
                this.stateOrderUpdateToastErr();
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
  stateOrderUpdateToastSuccess(){
      this.toastCtrl.create({
        message: 'State General successfully updated!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível cadastrar
  stateOrderUpdateToastErr(){
      this.toastCtrl.create({
        message: 'Unable to update to state general!',
        duration: 3000
      }).present();
  }

}
