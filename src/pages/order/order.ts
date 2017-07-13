import * as firebase from 'firebase';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { OrderDetailsPage } from './../order-details/order-details';
import { OrderEditFotoPage } from './../order-edit-foto/order-edit-foto';
import { OrderEditPage } from './../order-edit/order-edit';
import { AuthProvider } from './../../providers/auth/auth';
import { StateOrderProvider } from './../../providers/state-order/state-order';
import { OrderProvider } from './../../providers/order/order';
import { DriverProvider } from './../../providers/driver/driver';
import { ClientProvider } from './../../providers/client/client';
import { CategoryProvider } from './../../providers/category/category';
import { UserProvider } from './../../providers/user/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Order } from './../../models/order';
import { StateOrder } from './../../models/state-order';
import { Driver } from './../../models/driver';
import { Client } from './../../models/client';
import { Category } from './../../models/category';
import { FirebaseListObservable } from 'angularfire2';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, LoadingController, ToastController, Loading } from 'ionic-angular';

/**
 * Generated class for the OrderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  //Lista as categorias na página de "CategoryPage"
  categories: FirebaseListObservable<Category[]>;
  //Lista os clientes na página de "ClientPage"
  customers: FirebaseListObservable<Client[]>;
  //Lista os motoristas na página de "DriverPage"
  drivers: FirebaseListObservable<Driver[]>;
  //Lista os status do serviço na página de "StateOrderPage"
  statesorder: FirebaseListObservable<StateOrder[]>;
  //Lista as ordens de serviços na página de "Order List"
  orders: FirebaseListObservable<Order[]>;
  //Objeto "order" da nossa classe "OrderModel"
  order: Order;
  //Título a ser exibido da nossa "toolbar"
  view: string = 'Serviços Agendados';
  //variável responsável por capturar os valores informados no nosso formulário na página "Order.html"
  orderForm: FormGroup;
  //Variável responsável por armazenar o usuário atual logado no sistema
  currentUser: any;
  //Variáveis responsáveis por emitir as notificações ao usuário quando se aproximar a data e hora da execução dos serviços
  rememberDate: any;
  rememberTime: any;
  //Variável responsável por ouvir quando o usuário clicar no evento emitido pelo "LocalNotification"
  notification: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public userProvider: UserProvider,
    public categoryProvider: CategoryProvider,
    public clientProvider: ClientProvider,
    public driverProvider: DriverProvider,
    public orderProvider: OrderProvider,
    public stateOrderProvider: StateOrderProvider,
    public authProvider: AuthProvider,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public localNotifications: LocalNotifications
    ) {
      this.initialize();
  }

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

    this.statesorder = this.stateOrderProvider.statesorder; 

    this.currentUser = firebase.auth().currentUser.uid;

    //this.rememberDateTime();
    //this.rememberDateTimeObservable();
        
  }

  //O primeiro LifeCycleEvent a ser executado
  //Verificação de autenticação de qualquer usuário, caso ele já esteja autenticado ele poderá entrar na página, caso contrário "NÃO PODERÁ ENTRAR"
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }  

  //O segundo LifeCycleEvent a ser executado
  ionViewDidLoad() {

    //Habilita o menu do usuário logado "user-menu", podendo ser criado múltiplos menus, para cada tipo de usuário
    this.menuCtrl.enable(true, 'user-menu');

    this.categories = this.categoryProvider.categories;
    this.customers = this.clientProvider.customers;
    this.drivers = this.driverProvider.drivers;
    this.statesorder = this.stateOrderProvider.statesorder; 

    this.orders = this.orderProvider.orders;
    
    //this.rememberDate = this.order.date;
    //this.rememberTime = this.order.time;

  }

  //Método responsável por observar a data e hora de cada serviço agendado e executar uma notificação de lembrete
  rememberDateTime(){
    
    let dataHoje: any = "07/07/2017";
    let horaAgora: any = "12:30";

    if(dataHoje == new Date()){
      if(horaAgora == new Date().getTime()){

        this.localNotifications.schedule([{
          id: 1,
          text: 'Fique atento a data e hora de execução do serviço...',
          //sound: isAndroid ? 'file://sound.mp3': 'file://beep.caf',
          data: { secret: 'Lembrete automático da data' }
          },{
          id: 2,
          text: 'Lembrar mais tarde!',
          at: new Date(new Date().getTime() + 3600),
          led: 'FF0000',
          sound: null      
        }]); 

      }
    }


  }

  //Executado quando o usuário conseguir visualizar a notificação enviada pelo método "rememberDateTime(){...}"
  rememberDateTimeObservable(){
    this.localNotifications.on( 'click', (notification, state) => {
      this.notification = notification;
    });
    //Toast "Notification viewed successfully"
    this.rememberDateTimeObservableToast();
  }

  //Método responsável por realizar um filtro, quando estivermos na ABA "category" ele filtra na lista de categorias que estamos procurando no campo "Search"
  clientFilterItems(event: any): void {
    //Variável "searchTerm" do tipo "string" usada para guardar o valor da nossa busca 
    let searchTerm: string = event.target.value;
    //Lista de categorias
    this.orders = this.orderProvider.orders;   
    //Lista de usuários
    //this.users = this.userService.users;
    //Caso submetemos a uma busca por dados no "searchTerm"
    if (searchTerm) {
      //Um "switch case" para a troca de "Views [categorias e usuários]"
      switch(this.view) {
        //Caso "view-category list" seja escolhida e haja alguma busca no "searchTerm"
        case 'Serviços Agendados':
          this.orders = <FirebaseListObservable<Order[]>>this.orders
            .map((orders: Order[]) => orders.filter((order: Order) => (order.client.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
          break;

        case 'Serviços Executados':
          this.orders = <FirebaseListObservable<Order[]>>this.orders
            .map((orders: Order[]) => orders.filter((order: Order) => (order.client.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
          break;

        case 'Serviços Cancelados':
          this.orders = <FirebaseListObservable<Order[]>>this.orders
            .map((orders: Order[]) => orders.filter((order: Order) => (order.client.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
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

  //Cadastra order
  onOrderCreate( order: Order ): void {
    //console.log( 'Order:', order );    
  }

  //Atualizar order
  onOrderUpdate( order: Order ) {
    this.navCtrl.push( OrderEditPage, { 'order': order } ); 
  } 

  //Atualizar order foto
  onOrderUpdateFoto( order: Order ) {
    this.navCtrl.push( OrderEditFotoPage, { 'order': order } ); 
  } 

  //Passa o parâmetro "{ 'order': order }" para a página de ddetalhes da ordem de serviço
  onOrderDetails( order: Order ) {
    this.navCtrl.push( OrderDetailsPage, { 'order': order } ); 
  } 

  //Deletar order selecionada
  onOrderDelete( order: Order ){    
      this.alertCtrl.create({
          message: 'Deseja realmente deletar a orderm de serviço?',
          buttons: [
              {
                  text: 'Yes',
                  handler: () => {
                    //Delete Realtime Database
                    this.orderProvider.delete( order )
                    .then( (sucesso) => {  
                    //Delete Success
                    this.orderDeleteToastSuccess();
                    })
                    .catch( (error) => {
                    //Delete Err
                    this.orderDeleteToastErr();
                    });
                  }
              },
              {
                  text: 'Cancel',
                  handler:() => {
                    //Direciona o usuário para página de lista
                    this.navCtrl.setRoot(OrderPage);                    
                  }
              }
          ]
      }).present(); 

  }   

  //Método responsável por registrar no banco de dados
  onSubmit(): void {
    //Chama o método loading
    let loading: Loading = this.showLoading();
    //"formClient" recupera todos os valores "Dados" do formulário
    let formOrder = this.orderForm.value;    
    //Variável responsável por pegar o cliente inserido no formulário
    let client: string = formOrder.client;
    //Variável responsável por pegar o state inserido no formulário
    let state: string = formOrder.state;                 
    //Checa se já existe uma ordem de serviço solicitada em andamento para o cliente em questão
    this.orderProvider.orderCreateExists( client, state )
      //Pega o primeiro registro, pois é o que nos interessa
      .first()
      //Aqui vamos Sobreescrever o método "orderCreateExists", como uma tomada de decisão, "true" ou "false"
      .subscribe((orderCreateExists: boolean) => {
        //Caso não existe uma ordem de serviço solicitada em andamento para o cliente em questão
        if (!orderCreateExists) {
            //Cadastra no "Firebase Database"
            this.orderProvider.create(formOrder)
              .then(() => {
                //Mensagem de cadastrado com sucesso
                this.orderAddToastSuccess();
                //Direciona o usuário para página de lista
                this.navCtrl.setRoot(OrderPage);
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível cadastrar
                this.orderAddToastErr();
                //Destrói o loading
                loading.dismiss();
              });         
        } else {
          //Caso já existe uma ordem de serviço solicitada em andamento para o cliente em questão
          //this.showAlert(`Já existe uma ordem de serviço com status ${state} para o senhor(a) ${client}!`);
          this.showAlert(`Já existe uma ordem de serviço expedida para o senhor(a) ${client}!`);
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
  orderAddToastSuccess(){
      this.toastCtrl.create({
        message: 'Order added successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível cadastrar
  orderAddToastErr(){
      this.toastCtrl.create({
        message: 'Unable to add to order!',
        duration: 3000
      }).present();
  }

  //Mensagem de deletado com sucesso
  orderDeleteToastSuccess(){
      this.toastCtrl.create({
        message: 'Order deleted successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível deletar
  orderDeleteToastErr(){
      this.toastCtrl.create({
        message: 'Unable to delete to order!',
        duration: 3000
      }).present();
  }

  //Mensagem de não foi possível deletar
  rememberDateTimeObservableToast(){
      this.toastCtrl.create({
        message: 'Notification viewed successfully!',
        duration: 3000
      }).present();
  }


}
