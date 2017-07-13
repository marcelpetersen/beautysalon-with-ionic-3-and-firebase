import { Category } from './../../models/category';
import { CategoryProvider } from './../../providers/category/category';
import { FirebaseListObservable } from 'angularfire2';
import { GalleryPage } from './../gallery/gallery';
import { GalleryProvider } from './../../providers/gallery/gallery';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Gallery } from './../../models/gallery';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";

/**
 * Generated class for the GalleryEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-gallery-edit',
  templateUrl: 'gallery-edit.html',
})
export class GalleryEditPage {

  categories: FirebaseListObservable<Category[]>;
  
  view: string = 'Atualizar Foto';
  currentGallery: Gallery;
  galleryForm: FormGroup;

  //statesgeneral: FirebaseListObservable<StateGeneral[]>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public authProvider: AuthProvider,
    public categoryProvider: CategoryProvider,
    public galleryProvider: GalleryProvider,
    //public stateGeneralProvider: StateGeneralProvider,
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
      this.galleryForm = this.formBuilder.group({
        category: ['', [Validators.required, Validators.minLength(1)]],
        name: ['', [Validators.required, Validators.minLength(1)]],
        description: ['']
      }); 

      //Pegamos o parâmetro enviado pela página "gallery-edit.page.html"
      this.categories = this.categoryProvider.categories;
      this.currentGallery = this.navParams.get('gallery');     

      //this.statesgeneral = this.stateGeneralProvider.statesgeneral;

  }

  //Primeiro LifeCicleEvent a ser executado, verificando a autenticidade do usuário e se ele tem permissão para estar na devida página
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  //É executado quando a página foi carregada. Esse evento só acontece uma vez por página sendo criada.
  ionViewDidLoad() {
    this.currentGallery = this.navParams.get('gallery');   
    
    //this.statesgeneral = this.stateGeneralProvider.statesgeneral;      
  }

  //Executa quando a página está prestes a ser destruída e ter seus elementos removidos.
  ionViewWillUnload(){
    this.navCtrl.setRoot( GalleryPage );
  }

  //Aqui é executado o código para salvar no banco de dados os dados inseridos
  onSubmit(): void {    

    //console.log( this.userForm.value );

    //Chama o método loading
    let loading: Loading = this.showLoading();
    
    //"formUser" recupera todos os valores "Dados" do formulário
    let formGallery = this.galleryForm.value;
    let name: string = formGallery.name;

    this.galleryProvider.galleryExists(name)
      .first()
      .subscribe((galleryExists: boolean) => {
        if (!galleryExists) {
            //Cadastra no "Firebase Database"
            this.galleryProvider.edit( this.currentGallery )
              .then(() => {
                //Mensagem de atualizado com sucesso
                this.galleryUpdateToastSuccess();
                //Aqui encontrei essa solução, após atualizar a categoria selecionada, o sistema mantém a categoria anterior, então aqui estou deletando a categoria anterior
                this.galleryProvider.delete( this.currentGallery );
                //Direciona ousuário para a página de lista de categoria
                this.navCtrl.setRoot( GalleryPage );
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível atualizar a categoria
                this.galleryUpdateToastErr();
                //Destrói o loading
                loading.dismiss();
                this.showAlert(error);
              }); 
        } else {
            //Cadastra no "Firebase Database"
            this.galleryProvider.edit( this.currentGallery )
              .then(() => {
                //Mensagem de atualizado com sucesso
                this.galleryUpdateToastSuccess();
                //Aqui encontrei essa solução, após atualizar a categoria selecionada, o sistema mantém a categoria anterior, então aqui estou deletando a categoria anterior
                //this.categoryProvider.delete( this.currentCategory );
                //Direciona ousuário para a página de lista de categoria
                this.navCtrl.setRoot( GalleryPage );
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível atualizar a categoria
                this.galleryUpdateToastErr();
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
  galleryUpdateToastSuccess(){
      this.toastCtrl.create({
        message: 'Image successfully updated!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível cadastrar
  galleryUpdateToastErr(){
      this.toastCtrl.create({
        message: 'Unable to update to image!',
        duration: 3000
      }).present();
  }

}
