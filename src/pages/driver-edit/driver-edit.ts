import { DriverPage } from './../driver/driver';
import { StateGeneralProvider } from './../../providers/state-general/state-general';
import { DriverProvider } from './../../providers/driver/driver';
import { AuthProvider } from './../../providers/auth/auth';
import { StateGeneral } from './../../models/state-general';
import { FirebaseListObservable } from 'angularfire2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Driver } from './../../models/driver';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';

/**
 * Generated class for the DriverEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-driver-edit',
  templateUrl: 'driver-edit.html',
})
export class DriverEditPage {

  view: string = 'Atualizar Motorista';
  currentDriver: Driver;
  driverForm: FormGroup;

  statesgeneral: FirebaseListObservable<StateGeneral[]>;  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public authProvider: AuthProvider,
    public driverProvider: DriverProvider,
    public stateGeneralProvider: StateGeneralProvider,
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
      this.driverForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        rg: [''],
        cnh: [''],
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
        email: [''],
        observacao: [''],
        state: ['', [Validators.required, Validators.minLength(1)]]
      }); 

      //Pegamos o parâmetro enviado pela página "category-edit.page.html"
      this.currentDriver = this.navParams.get('driver');    
      this.statesgeneral = this.stateGeneralProvider.statesgeneral;    
  }  

  //Primeiro LifeCicleEvent a ser executado, verificando a autenticidade do usuário e se ele tem permissão para estar na devida página
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  //É executado quando a página foi carregada. Esse evento só acontece uma vez por página sendo criada.
  ionViewDidLoad() {
    this.currentDriver = this.navParams.get('driver');    
    this.statesgeneral = this.stateGeneralProvider.statesgeneral;   
  }

  //Executa quando a página está prestes a ser destruída e ter seus elementos removidos.
  ionViewWillUnload(){
    this.navCtrl.setRoot( DriverPage );
  }

  //Aqui é executado o código para salvar no banco de dados os dados inseridos
  onSubmit(): void {    

    //console.log( this.userForm.value );

    //Chama o método loading
    let loading: Loading = this.showLoading();
    
    //"formUser" recupera todos os valores "Dados" do formulário
    let formCategory = this.driverForm.value;
    let name: string = formCategory.name;

    this.driverProvider.driverExists(name)
      .first()
      .subscribe((driverExists: boolean) => {
        if (!driverExists) {
            //Cadastra no "Firebase Database"
            this.driverProvider.edit( this.currentDriver ) //this.currentCategory
              .then(() => {
                //Mensagem de atualizado com sucesso
                this.driverUpdateToastSuccess();
                //Aqui encontrei essa solução, após atualizar a categoria selecionada, o sistema mantém a categoria anterior, então aqui estou deletando a categoria anterior
                this.driverProvider.delete( this.currentDriver );
                //Direciona ousuário para a página de lista de categoria
                this.navCtrl.setRoot( DriverPage );
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível atualizar a categoria
                this.driverUpdateToastErr();
                //Destrói o loading
                loading.dismiss();
                this.showAlert(error);
              });                
        } else {
            //Cadastra no "Firebase Database"
            this.driverProvider.edit( this.currentDriver ) //this.currentCategory
              .then(() => {
                //Mensagem de atualizado com sucesso
                this.driverUpdateToastSuccess();
                //Aqui encontrei essa solução, após atualizar a categoria selecionada, o sistema mantém a categoria anterior, então aqui estou deletando a categoria anterior
                //this.driverProvider.delete( this.currentDriver );
                //Direciona ousuário para a página de lista de categoria
                this.navCtrl.setRoot( DriverPage );
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível atualizar a categoria
                this.driverUpdateToastErr();
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
  driverUpdateToastSuccess(){
      this.toastCtrl.create({
        message: 'Driver successfully updated!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível cadastrar
  driverUpdateToastErr(){
      this.toastCtrl.create({
        message: 'Unable to update to driver!',
        duration: 3000
      }).present();
  }

}
