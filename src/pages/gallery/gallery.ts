import { CategoryProvider } from './../../providers/category/category';
import { GalleryDetailsPage } from './../gallery-details/gallery-details';
import { GalleryEditFotoPage } from './../gallery-edit-foto/gallery-edit-foto';
import { GalleryEditPage } from './../gallery-edit/gallery-edit';
import { GalleryProvider } from './../../providers/gallery/gallery';
import { Gallery } from './../../models/gallery';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Loading } from 'ionic-angular';
import { Category } from "../../models/category";

/**
 * Generated class for the GalleryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gallery',
  templateUrl: 'gallery.html',
})
export class GalleryPage {

  name: any;
  image: any;

  categories: FirebaseListObservable<Category[]>;
  galleries: FirebaseListObservable<Gallery[]>;
  view: string = 'Exibir Galeria';

  galleryForm: FormGroup;

  currentGallery: Gallery;
  canEdit: boolean = true;
  uploadProgress: number;
  private filePhoto: File;

  //statesgeneral: FirebaseListObservable<StateGeneral[]>;  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userProvider: UserProvider,
    public categoryProvider: CategoryProvider,
    public galleryProvider: GalleryProvider,
    //public stateGeneralProvider: StateGeneralProvider,
    public authProvider: AuthProvider,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, 
    public toastCtrl: ToastController,
    public angularFire: AngularFire,
    public ngZone: NgZone     
    ) {
      this.initialize();

      this.name = this.navParams.get('name');
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

    //this.statesgeneral = this.stateGeneralProvider.statesgeneral; 
    this.currentGallery = this.navParams.get('name');  

  }

  //O primeiro LifeCycleEvent a ser executado
  //Verificação de autenticação de qualquer usuário, caso ele já esteja autenticado ele poderá entrar na página, caso contrário "NÃO PODERÁ ENTRAR"
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  //O segundo LifeCycleEvent a ser executado
  ionViewDidLoad(){    
    this.categories = this.categoryProvider.categories;
    this.galleries = this.galleryProvider.galleries;   

    //this.statesgeneral = this.stateGeneralProvider.statesgeneral; 

  }

  //Método responsável por realizar um filtro, quando estivermos na ABA "category" ele filtra na lista de categorias que estamos procurando no campo "Search"
  filterItems(event: any): void {
    //Variável "searchTerm" do tipo "string" usada para guardar o valor da nossa busca 
    let searchTerm: string = event.target.value;
    //Lista de categorias
    this.galleries = this.galleryProvider.galleries;   
    //Lista de usuários
    //this.users = this.userService.users;
    //Caso submetemos a uma busca por dados no "searchTerm"
    if (searchTerm) {
      //Um "switch case" para a troca de "Views [categorias e usuários]"
      switch(this.view) {
        //Caso "view-category list" seja escolhida e haja alguma busca no "searchTerm"
        case 'Exibir Galeria':
          this.galleries = <FirebaseListObservable<Gallery[]>>this.galleries
            .map((galleries: Gallery[]) => galleries.filter((galleries: Gallery) => (galleries.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
          break;

        /*
        case 'Category List Blocked':
          this.galleries = <FirebaseListObservable<Category[]>>this.galleries
            .map((galleries: Category[]) => galleries.filter((category: Category) => (category.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
          break;
          
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
  onGalleryCreate( gallery: Gallery ): void {
    //console.log( 'Category:', category );    
  }

  //Atualizar categoria
  onGalleryUpdate( gallery: Gallery ) {
    this.navCtrl.push( GalleryEditPage, { 'gallery': gallery } ); 
  } 

  //Atualizar categoria
  onGalleryUpdateFoto( gallery: Gallery ) {
    this.navCtrl.push( GalleryEditFotoPage, { 'gallery': gallery } ); 
  } 

  onGalleryDetails( gallery: Gallery ) {
    this.navCtrl.push( GalleryDetailsPage, { 'gallery': gallery } ); 
  } 

  //Deletar categoria selecionada
  onGalleryDelete( gallery: Gallery ){    
      this.alertCtrl.create({
          message: 'Deseja realmente deletar a foto?',
          buttons: [
              {
                  text: 'Yes',
                  handler: () => {
                    //Delete Realtime Database
                    this.galleryProvider.delete( gallery )
                    .then( (sucesso) => {  
                    //Delete Success
                    this.galleryDeleteToastSuccess();
                    })
                    .catch( (error) => {
                    //Delete Err
                    this.galleryDeleteToastErr();
                    });
                  }
              },
              {
                  text: 'Cancel',
                  handler:() => {
                    //Direciona o usuário para página de lista
                    this.navCtrl.setRoot(GalleryPage);                    
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

    //"formGallery" recupera todos os valores "Dados" do formulário
    let formGallery = this.galleryForm.value;
    let name: string = formGallery.name;

    this.galleryProvider.galleryExists(name)
      .first()
      .subscribe((galleryExists: boolean) => {
        //Caso já exista o cadastro do nome iunserido no formulário
        if (!galleryExists) {
            //Cadastra no "Firebase Database"
            this.galleryProvider.create(formGallery)
              .then(() => {

                //Upload image
                this.onSubmitFoto();
                //Mensagem de cadastrado com sucesso
                this.galeryAddToastSuccess();                
                //Direciona o usuário para página de lista
                this.navCtrl.setRoot(GalleryPage);
                //Destrói o loading
                loading.dismiss();
              }).catch((error: any) => {
                //Mensagem de não foi possível cadastrar
                this.galleryAddToastErr();
                //Destrói o loading
                loading.dismiss();
              });        
        } else {
          //Mensagem caso o nome inserido já está consta no banco de dados
          this.showAlert(`O nome ${name} já está sendo usado!`);
          //Direciona ousuário para a página de lista de categoria
          this.navCtrl.setRoot( GalleryPage );
          //Destrói o loading
          loading.dismiss();
        }      
      });

  }  

  //|Método responsável por atualizar nossos dados do formulário
  onSubmitFoto(){ 
    //Se existir alguma imagem/foto será executado esse método
    if (this.filePhoto) {
      
      let uploadTask = this.galleryProvider.uploadPhoto(this.filePhoto, this.name);
      uploadTask.on('state_changed', (snapshot) => {
      this.uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      }, (error: Error) => {
        // catch error
      }, () => {
        //Atualiza a imagem 
        this.editGalleryComFoto(uploadTask.snapshot.downloadURL);
        //Mensagem de upload com sucesso
        this.galleryUpdateToastSuccess();        
        //Direciona o usuário para página de lista
        this.navCtrl.setRoot( GalleryPage );
      });
    //Se não existir nenhuma imagem/foto será executado esse método
    } else {    
        //Mensagem de por favor selecione uma imagem
        this.galleryNoImage();
        //Direciona o usuário para página de lista
        //this.navCtrl.setRoot( GalleryPage );
      }
  }

  //Método verifica se foi passado algum arquivo alvo como para ser atribuído a variável "filephoto"
  onPhoto(event): void {  
    this.filePhoto = event.target.files[0];
    this.readPhoto( this.filePhoto );
  }

  //Método responsável por atualizar nossos dados
  private editGalleryComFoto(photoUrl?: string): void {
    this.galleryProvider
      .editComFoto({
        name: this.name,
        photo: photoUrl || this.currentGallery.photo || ''
      }).then(() => {
        this.canEdit = false;
        this.filePhoto = undefined;
        this.uploadProgress = 0;
      });
  }

  //Get image e xibe na view html
  readPhoto( filePhoto ){
    let reader = new FileReader();
    reader.onload = ( event ) => {
      this.ngZone.run( () => {
        let path: any = event.target;
        this.image = path.result;
      });

    }
    reader.readAsDataURL( filePhoto );
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
  galeryAddToastSuccess(){
      this.toastCtrl.create({
        message: 'Image added successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível cadastrar
  galleryAddToastErr(){
      this.toastCtrl.create({
        message: 'Unable to add to image!',
        duration: 3000
      }).present();
  }

  //Mensagem de deletado com sucesso
  galleryDeleteToastSuccess(){
      this.toastCtrl.create({
        message: 'Image deleted successfully!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível deletar
  galleryDeleteToastErr(){
      this.toastCtrl.create({
        message: 'Unable to delete to image!',
        duration: 3000
      }).present();
  }

  //Alerta de mensagem para o usuário, a imagem é obrigatória
  galleryNoImage(){
      this.toastCtrl.create({
        message: 'Please select an image next time!',
        duration: 3000
      }).present();
  }


}
