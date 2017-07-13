import { CategoryPage } from './../category/category';
import { AuthProvider } from './../../providers/auth/auth';
import { CategoryProvider } from './../../providers/category/category';
import { Category } from './../../models/category';
import { FirebaseListObservable } from 'angularfire2';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

/**
 * Generated class for the CategoryEditFotoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category-edit-foto',
  templateUrl: 'category-edit-foto.html',
})
export class CategoryEditFotoPage {

  image: any;
  
  view: string = 'Atualizar Foto';
  category: FirebaseListObservable<Category[]>;;

  currentCategory: Category;
  canEdit: boolean = true;
  uploadProgress: number;
  private filePhoto: File;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public categoryProvider: CategoryProvider,
    public authProvider: AuthProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public ngZone: NgZone
    ) {
      this.initialize();
  }  

  //Método executado sempre que a página é iniciada
  initialize(){
      //Pegamos o parâmetro enviado pela página "category-edit.page.html"
      this.currentCategory = this.navParams.get('category');  
      //console.log('Log', this.currentCategory.name );  
  }  

  //Primeiro LifeCicleEvent a ser executado, verificando a autenticidade do usuário e se ele tem permissão para estar na devida página
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  //Segundo LifeCicleEvent a ser executado
  ionViewDidLoad() {
    this.category = this.categoryProvider.category;  
  }

  //Executa quando a página está prestes a ser destruída e ter seus elementos removidos.
  ionViewWillUnload(){
    this.navCtrl.setRoot( CategoryPage );
  }

  //|Método responsável por atualizar nossos dados do formulário
  onSubmit(event: Event): void {
    event.preventDefault();    
    //Se existir alguma imagem/foto será executado esse método
    if (this.filePhoto) {
      let uploadTask = this.categoryProvider.uploadPhoto(this.filePhoto, this.currentCategory.name);
      uploadTask.on('state_changed', (snapshot) => {
      this.uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      }, (error: Error) => {
        // catch error
      }, () => {
        //Atualiza a imagem 
        this.editCategoryComFoto(uploadTask.snapshot.downloadURL);
        //Mensagem de upload com sucesso
        this.categoryUpdateToastSuccess();        
        //Direciona o usuário para página de lista
        this.navCtrl.setRoot( CategoryPage );
      });
    //Se não existir nenhuma imagem/foto será executado esse método
  } else {    
      //Mensagem de por favor selecione uma imagem
      this.galleryNoImage();
      //Direciona o usuário para página de lista
      this.navCtrl.setRoot( CategoryPage );
    }
  }

  //Método verifica se foi passado algum arquivo alvo como para ser atribuído a variável "filephoto"
  onPhoto(event): void {  
    this.filePhoto = event.target.files[0];
    this.readPhoto( this.filePhoto );
    
  }

  //Método responsável por atualizar nossos dados
  private editCategoryComFoto(photoUrl?: string): void {
    this.categoryProvider
      .editComFoto({
        name: this.currentCategory.name,
        photo: photoUrl || this.currentCategory.photo || ''
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
  categoryUpdateToastSuccess(){
      this.toastCtrl.create({
        message: 'Category successfully updated!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível cadastrar
  categoryUpdateToastErr(){
      this.toastCtrl.create({
        message: 'Unable to update to category!',
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
