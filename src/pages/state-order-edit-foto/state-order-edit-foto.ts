import { StateOrderPage } from './../state-order/state-order';
import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { StateOrderProvider } from './../../providers/state-order/state-order';
import { User } from './../../models/user';
import { StateOrder } from './../../models/state-order';
import { FirebaseListObservable } from 'angularfire2';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

/**
 * Generated class for the StateOrderEditFotoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-state-order-edit-foto',
  templateUrl: 'state-order-edit-foto.html',
})
export class StateOrderEditFotoPage {

  image: any;

  view: string = 'Atualizar Foto';
  state: FirebaseListObservable<StateOrder[]>;;

  currentUser: User;
  currentState: StateOrder;
  canEdit: boolean = true;
  uploadProgress: number;
  private filePhoto: File;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public stateOrderProvider: StateOrderProvider,
    public authProvider: AuthProvider,
    public userProvider: UserProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public ngZone: NgZone
    ) {
      this.initialize();
  }  

  //Método executado sempre que a página é iniciada
  initialize(){
      //Pegamos o parâmetro enviado pela página "category-edit.page.html"
      this.currentState = this.navParams.get('state');  
      //console.log('Log', this.currentCategory.name );  
  }  

  //Primeiro LifeCicleEvent a ser executado, verificando a autenticidade do usuário e se ele tem permissão para estar na devida página
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  //Segundo LifeCicleEvent a ser executado
  ionViewDidLoad() {
    this.state = this.stateOrderProvider.state;  
  }

  //Executa quando a página está prestes a ser destruída e ter seus elementos removidos.
  ionViewWillUnload(){
    this.navCtrl.setRoot( StateOrderPage );
  }

  //|Método responsável por atualizar nossos dados do formulário
  onSubmit(event: Event): void {
    event.preventDefault();    
    //Se existir alguma imagem/foto será executado esse método
    if (this.filePhoto) {
      let uploadTask = this.stateOrderProvider.uploadPhoto(this.filePhoto, this.currentState.name);
      uploadTask.on('state_changed', (snapshot) => {
      this.uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      }, (error: Error) => {
        // catch error
      }, () => {
        //Atualiza a imagem 
        this.editStateOrderComFoto(uploadTask.snapshot.downloadURL);
        //Mensagem de upload com sucesso
        this.stateOrderUpdateToastSuccess();        
        //Direciona o usuário para página de lista
        this.navCtrl.setRoot( StateOrderPage );
      });
    //Se não existir nenhuma imagem/foto será executado esse método
  } else {    
      //Mensagem de por favor selecione uma imagem
      this.galleryNoImage();
      //Direciona o usuário para página de lista
      this.navCtrl.setRoot( StateOrderPage );
    }
  }

  //Método verifica se foi passado algum arquivo alvo como para ser atribuído a variável "filephoto"
  onPhoto(event): void {  
    this.filePhoto = event.target.files[0];
    this.readPhoto( this.filePhoto );
  }

  //Método responsável por atualizar nossos dados
  private editStateOrderComFoto(photoUrl?: string): void {
    this.stateOrderProvider
      .editComFoto({
        name: this.currentState.name,
        photo: photoUrl || this.currentState.photo || ''
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
  stateOrderUpdateToastSuccess(){
      this.toastCtrl.create({
        message: 'State general successfully updated!',
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

  //Alerta de mensagem para o usuário, a imagem é obrigatória
  galleryNoImage(){
      this.toastCtrl.create({
        message: 'Please select an image next time!',
        duration: 3000
      }).present();
  }

  
}
