import { StateLevelPage } from './../state-level/state-level';
import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { StateLevelProvider } from './../../providers/state-level/state-level';
import { User } from './../../models/user';
import { StateLevel } from './../../models/state-level';
import { FirebaseListObservable } from 'angularfire2';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

/**
 * Generated class for the StateLevelEditFotoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-state-level-edit-foto',
  templateUrl: 'state-level-edit-foto.html',
})
export class StateLevelEditFotoPage {

  image: any;

  view: string = 'Atualizar Foto';
  state: FirebaseListObservable<StateLevel[]>;;

  currentUser: User;
  currentState: StateLevel;
  canEdit: boolean = true;
  uploadProgress: number;
  private filePhoto: File;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public stateLevelProvider: StateLevelProvider,
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

      this.state = this.stateLevelProvider.level;  
  }  

  //Primeiro LifeCicleEvent a ser executado, verificando a autenticidade do usuário e se ele tem permissão para estar na devida página
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  //Segundo LifeCicleEvent a ser executado
  ionViewDidLoad() {
    this.state = this.stateLevelProvider.level;  
  }

  //Executa quando a página está prestes a ser destruída e ter seus elementos removidos.
  ionViewWillUnload(){
    this.navCtrl.setRoot( StateLevelPage );
  }

  //|Método responsável por atualizar nossos dados do formulário
  onSubmit(event: Event): void {
    event.preventDefault();    
    //Se existir alguma imagem/foto será executado esse método
    if (this.filePhoto) {
      let uploadTask = this.stateLevelProvider.uploadPhoto(this.filePhoto, this.currentState.name);
      uploadTask.on('state_changed', (snapshot) => {
      this.uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      }, (error: Error) => {
        // catch error
      }, () => {
        //Atualiza a imagem 
        this.editStateLevelComFoto(uploadTask.snapshot.downloadURL);
        //Mensagem de upload com sucesso
        this.stateLevelUpdateToastSuccess();        
        //Direciona o usuário para página de lista
        this.navCtrl.setRoot( StateLevelPage );
      });
    //Se não existir nenhuma imagem/foto será executado esse método
  } else {    
      //Mensagem de por favor selecione uma imagem
      this.galleryNoImage();
      //Direciona o usuário para página de lista
      this.navCtrl.setRoot( StateLevelPage );
    }
  }

  //Método verifica se foi passado algum arquivo alvo como para ser atribuído a variável "filephoto"
  onPhoto(event): void {  
    this.filePhoto = event.target.files[0];
    this.readPhoto( this.filePhoto );
  }

  //Método responsável por atualizar nossos dados
  private editStateLevelComFoto(photoUrl?: string): void {
    this.stateLevelProvider
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
  stateLevelUpdateToastSuccess(){
      this.toastCtrl.create({
        message: 'State level successfully updated!',
        duration: 3000
      }).present();   
  }

  //Mensagem de não foi possível cadastrar
  stateLevelUpdateToastErr(){
      this.toastCtrl.create({
        message: 'Unable to update to state level!',
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
