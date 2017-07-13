import { CategoryDetailsPage } from './../category-details/category-details';
import { CategoryEditFotoPage } from './../category-edit-foto/category-edit-foto';
import { FormBuilder } from '@angular/forms';
import { AuthProvider } from './../../providers/auth/auth';
import { StateGeneralProvider } from './../../providers/state-general/state-general';
import { CategoryProvider } from './../../providers/category/category';
import { UserProvider } from './../../providers/user/user';
import { StateGeneral } from './../../models/state-general';
import { FormGroup, Validators } from '@angular/forms';
import { FirebaseListObservable } from 'angularfire2';
import { Category } from './../../models/category';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Loading } from 'ionic-angular';
import { CategoryEditPage } from "../category-edit/category-edit";

/**
 * Generated class for the CategoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {

  categories: FirebaseListObservable<Category[]>;
  view: string = 'Categorias Ativas';

  categoryForm: FormGroup;

  statesgeneral: FirebaseListObservable<StateGeneral[]>;  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userProvider: UserProvider,
    public categoryProvider: CategoryProvider,
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
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: [''],
      observation: [''],
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
    this.categories = this.categoryProvider.categories;   
    this.statesgeneral = this.stateGeneralProvider.statesgeneral;   

  }

  //Método responsável por realizar um filtro, quando estivermos na ABA "category" ele filtra na lista de categorias que estamos procurando no campo "Search"
  filterItems(event: any): void {
    //Variável "searchTerm" do tipo "string" usada para guardar o valor da nossa busca 
    let searchTerm: string = event.target.value;
    //Lista de categorias
    this.categories = this.categoryProvider.categories;   
    //Lista de usuários
    //this.users = this.userService.users;
    //Caso submetemos a uma busca por dados no "searchTerm"
    if (searchTerm) {
      //Um "switch case" para a troca de "Views [categorias e usuários]"
      switch(this.view) {
        //Caso "view-category list" seja escolhida e haja alguma busca no "searchTerm"
        case 'Categorias Ativas':
          this.categories = <FirebaseListObservable<Category[]>>this.categories
            .map((categories: Category[]) => categories.filter((category: Category) => (category.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
          break;

        case 'Categorias Bloqueadas':
          this.categories = <FirebaseListObservable<Category[]>>this.categories
            .map((categories: Category[]) => categories.filter((category: Category) => (category.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
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
  onCategoryCreate( category: Category ): void {
    //console.log( 'Category:', category );    
  }

  //Atualizar categoria
  onCategoryUpdate( category: Category ) {
    this.navCtrl.push( CategoryEditPage, { 'category': category } ); 
  } 

  //Atualizar categoria
  onCategoryUpdateFoto( category: Category ) {
    this.navCtrl.push( CategoryEditFotoPage, { 'category': category } ); 
  } 

  onCategoryDetails( category: Category ) {
    this.navCtrl.push( CategoryDetailsPage, { 'category': category } ); 
  } 

  //Deletar categoria selecionada
  onCategoryDelete( category: Category ){    
      this.alertCtrl.create({
          message: 'Deseja realmente deletar a categoria?',
          buttons: [
              {
                  text: 'Yes',
                  handler: () => {
                    //Delete Realtime Database
                    this.categoryProvider.delete( category )
                    .then( (sucesso) => {  
                    //Delete Success
                    this.categoryDeleteToastSuccess();
                    })
                    .catch( (error) => {
                    //Delete Err
                    this.categoryDeleteToastErr();
                    });
                  }
              },
              {
                  text: 'Cancel',
                  handler:() => {
                    //Direciona o usuário para página de lista
                    this.navCtrl.setRoot(CategoryPage);                    
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
    let formCategory = this.categoryForm.value;
    let name: string = formCategory.name;

    this.categoryProvider.categoryExists(name)
      .first()
      .subscribe((categoryExists: boolean) => {
        //Caso já exista o cadastro do nome iunserido no formulário
        if (!categoryExists) {
            //Cadastra no "Firebase Database"
            this.categoryProvider.create(formCategory)
              .then(() => {
                //Mensagem de cadastrado com sucesso
                this.categoryAddToastSuccess();
                //Direciona o usuário para página de lista
                this.navCtrl.setRoot(CategoryPage);
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível cadastrar
                this.categoryAddToastErr();
                //Destrói o loading
                loading.dismiss();
              });        
        } else {
          //Mensagem caso o nome inserido já está consta no banco de dados
          this.showAlert(`O nome ${name} já está sendo usado!`);
          //Direciona ousuário para a página de lista de categoria
          this.navCtrl.setRoot( CategoryPage );
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
  categoryAddToastSuccess(){
      this.toastCtrl.create({
        message: 'Category added successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível cadastrar
  categoryAddToastErr(){
      this.toastCtrl.create({
        message: 'Unable to add to category!',
        duration: 3000
      }).present();
  }

  //Mensagem de deletado com sucesso
  categoryDeleteToastSuccess(){
      this.toastCtrl.create({
        message: 'Category deleted successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível deletar
  categoryDeleteToastErr(){
      this.toastCtrl.create({
        message: 'Unable to delete to category!',
        duration: 3000
      }).present();
  }


}
