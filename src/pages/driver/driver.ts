import { DriverDetailsPage } from './../driver-details/driver-details';
import { DriverEditFotoPage } from './../driver-edit-foto/driver-edit-foto';
import { DriverEditPage } from './../driver-edit/driver-edit';
import { AuthProvider } from './../../providers/auth/auth';
import { StateGeneralProvider } from './../../providers/state-general/state-general';
import { DriverProvider } from './../../providers/driver/driver';
import { UserProvider } from './../../providers/user/user';
import { StateGeneral } from './../../models/state-general';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseListObservable } from 'angularfire2';
import { Driver } from './../../models/driver';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Loading } from 'ionic-angular';

/**
 * Generated class for the DriverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-driver',
  templateUrl: 'driver.html',
})
export class DriverPage {

  driver: Driver;

  drivers: FirebaseListObservable<Driver[]>;
  view: string = 'Motoristas Ativos';

  driverForm: FormGroup;

  statesgeneral: FirebaseListObservable<StateGeneral[]>;  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userProvider: UserProvider,
    public driverProvider: DriverProvider,
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

    this.statesgeneral = this.stateGeneralProvider.statesgeneral;  
    
  }

  //O primeiro LifeCycleEvent a ser executado
  //Verificação de autenticação de qualquer usuário, caso ele já esteja autenticado ele poderá entrar na página, caso contrário "NÃO PODERÁ ENTRAR"
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  //O segundo LifeCycleEvent a ser executado
  ionViewDidLoad(){    
    this.drivers = this.driverProvider.drivers;   
    this.statesgeneral = this.stateGeneralProvider.statesgeneral;   
  }

  //Método responsável por realizar um filtro, quando estivermos na ABA "category" ele filtra na lista de categorias que estamos procurando no campo "Search"
  filterItems(event: any): void {
    //Variável "searchTerm" do tipo "string" usada para guardar o valor da nossa busca 
    let searchTerm: string = event.target.value;
    //Lista de categorias
    this.drivers = this.driverProvider.drivers;   
    //Lista de usuários
    //this.users = this.userService.users;
    //Caso submetemos a uma busca por dados no "searchTerm"
    if (searchTerm) {
      //Um "switch case" para a troca de "Views [categorias e usuários]"
      switch(this.view) {
        //Caso "view-category list" seja escolhida e haja alguma busca no "searchTerm"
        case 'Motoristas Ativos':
          this.drivers = <FirebaseListObservable<Driver[]>>this.drivers
            .map((drivers: Driver[]) => drivers.filter((driver: Driver) => (driver.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
          break;

        case 'Motoristas Bloqueados':
          this.drivers = <FirebaseListObservable<Driver[]>>this.drivers
            .map((drivers: Driver[]) => drivers.filter((driver: Driver) => (driver.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
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

  //Cadastrar categorias
  onDriverCreate( driver: Driver ): void {
    //console.log( 'Category:', category );    
  }

  //Atualizar categoria
  onDriverUpdate( driver: Driver ) {
    this.navCtrl.push( DriverEditPage, { 'driver': driver } ); 
  } 

  //Atualizar categoria
  onDriverUpdateFoto( driver: Driver ) {
    this.navCtrl.push( DriverEditFotoPage, { 'driver': driver } ); 
  } 

  onDriverDetails( driver: Driver ) {
    this.navCtrl.push( DriverDetailsPage, { 'driver': driver } ); 
  } 

  //Deletar categoria selecionada
  onDriverDelete( driver: Driver ){    
      this.alertCtrl.create({
          message: 'Deseja realmente deletar o motorista?',
          buttons: [
              {
                  text: 'Yes',
                  handler: () => {
                    //Delete Realtime Database
                    this.driverProvider.delete( driver )
                    .then( (sucesso) => {  
                    //Delete Success
                    this.driverDeleteToastSuccess();
                    })
                    .catch( (error) => {
                    //Delete Err
                    this.driverDeleteToastErr();
                    });
                  }
              },
              {
                  text: 'Cancel',
                  handler:() => {
                    //Direciona o usuário para página de lista
                    this.navCtrl.setRoot(DriverPage);                    
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
    let formDriver = this.driverForm.value;
    let name: string = formDriver.name;

    this.driverProvider.driverExists(name)
      .first()
      .subscribe((driverExists: boolean) => {
        //Caso já exista o cadastro do nome iunserido no formulário
        if (!driverExists) {
            //Cadastra no "Firebase Database"
            this.driverProvider.create(formDriver)
              .then(() => {
                //Mensagem de cadastrado com sucesso
                this.driverAddToastSuccess();
                //Direciona o usuário para página de lista
                this.navCtrl.setRoot(DriverPage);
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível cadastrar
                this.driverAddToastErr();
                //Destrói o loading
                loading.dismiss();
              });        
        } else {
          //Mensagem caso o nome inserido já está consta no banco de dados
          this.showAlert(`O name ${name} já está sendo usado!`);
          //Direciona ousuário para a página de lista de categoria
          this.navCtrl.setRoot( DriverPage );
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
  driverAddToastSuccess(){
      this.toastCtrl.create({
        message: 'Driver added successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível cadastrar
  driverAddToastErr(){
      this.toastCtrl.create({
        message: 'Unable to add to driver!',
        duration: 3000
      }).present();
  }

  //Mensagem de deletado com sucesso
  driverDeleteToastSuccess(){
      this.toastCtrl.create({
        message: 'Driver deleted successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível deletar
  driverDeleteToastErr(){
      this.toastCtrl.create({
        message: 'Unable to delete to driver!',
        duration: 3000
      }).present();
  }


}
