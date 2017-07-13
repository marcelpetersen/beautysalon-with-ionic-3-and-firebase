import { OrderPage } from './../order/order';
import { StateOrderProvider } from './../../providers/state-order/state-order';
import { OrderProvider } from './../../providers/order/order';
import { DriverProvider } from './../../providers/driver/driver';
import { ClientProvider } from './../../providers/client/client';
import { CategoryProvider } from './../../providers/category/category';
import { AuthProvider } from './../../providers/auth/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Order } from './../../models/order';
import { StateOrder } from './../../models/state-order';
import { Driver } from './../../models/driver';
import { Client } from './../../models/client';
import { Category } from './../../models/category';
import { FirebaseListObservable } from 'angularfire2';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';

/**
 * Generated class for the OrderEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-edit',
  templateUrl: 'order-edit.html',
})
export class OrderEditPage {

  categories: FirebaseListObservable<Category[]>;
  customers: FirebaseListObservable<Client[]>;
  drivers: FirebaseListObservable<Driver[]>;
  statesorder: FirebaseListObservable<StateOrder[]>;

  view: string = 'Atualizar Serviço';
  currentOrder: Order;
  orderForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public authProvider: AuthProvider,
    public categoryProvider: CategoryProvider,
    public clientProvider: ClientProvider,
    public driverProvider: DriverProvider,    
    public orderProvider: OrderProvider,
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
      this.orderForm = this.formBuilder.group({
        category: ['', [Validators.required, Validators.minLength(1)]],
        client: ['', [Validators.required, Validators.minLength(1)]],
        //driver: ['', [Validators.required, Validators.minLength(1)]],
        description: ['', [Validators.required, Validators.minLength(3)]],
        date: ['', [Validators.required, Validators.minLength(1)]],
        time: ['', [Validators.required, Validators.minLength(1)]],        
        state: ['', [Validators.required, Validators.minLength(1)]]
      }); 

      //Pegamos o parâmetro enviado pela página "category-edit.page.html"
      this.currentOrder = this.navParams.get('order'); 

      this.categories = this.categoryProvider.categories;
      this.customers = this.clientProvider.customers;
      this.drivers = this.driverProvider.drivers;  
      this.statesorder = this.stateOrderProvider.statesorder; 
              
  }

  //Primeiro LifeCicleEvent a ser executado, verificando a autenticidade do usuário e se ele tem permissão para estar na devida página
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  //É executado quando a página foi carregada. Esse evento só acontece uma vez por página sendo criada.
  ionViewDidLoad() {
    this.currentOrder = this.navParams.get('order');    
    this.statesorder = this.stateOrderProvider.statesorder; 
  }

  //Executa quando a página está prestes a ser destruída e ter seus elementos removidos.
  ionViewWillUnload(){
    this.navCtrl.setRoot( OrderPage );
  }

  //Aqui é executado o código para salvar no banco de dados os dados inseridos
  onSubmit(): void {    

    //console.log( this.userForm.value );

    //Chama o método loading
    let loading: Loading = this.showLoading();
    
    //"formUser" recupera todos os valores "Dados" do formulário
    let formOrder = this.orderForm.value;
    

    let client: string = formOrder.name;
    let state: string = formOrder.state;

    this.orderProvider.orderCreateExists( client, state )
      .first()
      .subscribe((orderCreateExists: boolean) => {
        //Caso não existe uma ordem de serviço solicitada em andamento para o cliente em questão        
        if (orderCreateExists) {
            //Cadastra no "Firebase Database"
            this.orderProvider.edit( this.currentOrder )
              .then(() => {
                //Mensagem de atualizado com sucesso
                this.orderUpdateToastSuccess();
                //Aqui encontrei essa solução, após atualizar a categoria selecionada, o sistema mantém a categoria anterior, então aqui estou deletando a categoria anterior
                //this.orderProvider.delete( this.currentOrder );
                //Direciona ousuário para a página de lista de categoria
                this.navCtrl.setRoot( OrderPage );
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível atualizar a categoria
                this.orderUpdateToastErr();
                //Destrói o loading
                loading.dismiss();
                this.showAlert(error);
              });                
        } else {
          //Mensagem caso o nome inserido já está consta no banco de dados
          //this.showAlert(`Já existe uma ordem de serviço com status ${state} para o senhor(a) ${client}!`);
          this.showAlert(`O cliente não existe!`);
          //Direciona ousuário para a página de lista de categoria
          this.navCtrl.setRoot( OrderPage );
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
  orderUpdateToastSuccess(){
      this.toastCtrl.create({
        message: 'Order successfully updated!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível cadastrar
  orderUpdateToastErr(){
      this.toastCtrl.create({
        message: 'Unable to update to order!',
        duration: 3000
      }).present();
  }

}
