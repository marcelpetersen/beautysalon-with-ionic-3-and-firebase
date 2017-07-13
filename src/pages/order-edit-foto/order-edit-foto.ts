import { OrderPage } from './../order/order';
import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { OrderProvider } from './../../providers/order/order';
import { User } from './../../models/user';
import { Order } from './../../models/order';
import { FirebaseListObservable } from 'angularfire2';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

/**
 * Generated class for the OrderEditFotoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-edit-foto',
  templateUrl: 'order-edit-foto.html',
})
export class OrderEditFotoPage {

  image: any;

  view: string = 'Atualizar Foto';
  order: FirebaseListObservable<Order[]>;

  currentUser: User;
  currentOrder: Order;
  canEdit: boolean = true;
  uploadProgress: number;
  private filePhoto: File;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public orderProvider: OrderProvider,
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
      this.currentOrder = this.navParams.get('order');  
      //console.log('Log', this.currentOrder.client );  
  }

  //Primeiro LifeCicleEvent a ser executado, verificando a autenticidade do usuário e se ele tem permissão para estar na devida página
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  //Segundo LifeCicleEvent a ser executado
  ionViewDidLoad() {
    this.order = this.orderProvider.order;  
  }

  //Executa quando a página está prestes a ser destruída e ter seus elementos removidos.
  ionViewWillUnload(){
    this.navCtrl.setRoot( OrderPage );
  }

  //|Método responsável por atualizar nossos dados do formulário
  onSubmit(event: Event): void {
    event.preventDefault();    
    //Se existir alguma imagem/foto será executado esse método
    if (this.filePhoto) {
      let uploadTask = this.orderProvider.uploadPhoto(this.filePhoto, this.currentOrder.client);
      uploadTask.on('state_changed', (snapshot) => {
      this.uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      }, (error: Error) => {
        // catch error
      }, () => {
        //Atualiza a imagem 
        this.editOrderComFoto(uploadTask.snapshot.downloadURL);
        //Mensagem de upload com sucesso
        this.orderUpdateToastSuccess();        
        //Direciona o usuário para página de lista
        this.navCtrl.setRoot( OrderPage );
      });
    //Se não existir nenhuma imagem/foto será executado esse método
  } else {    
      //Mensagem de por favor selecione uma imagem
      this.galleryNoImage();
      //Direciona o usuário para página de lista
      this.navCtrl.setRoot( OrderPage );
    }
  }

  //Método verifica se foi passado algum arquivo alvo como para ser atribuído a variável "filephoto"
  onPhoto(event): void {  
    this.filePhoto = event.target.files[0];
    this.readPhoto( this.filePhoto );
  }

  //Método responsável por atualizar nossos dados
  private editOrderComFoto(photoUrl?: string): void {
    this.orderProvider
      .editComFoto({
        client: this.currentOrder.client,
        photo: photoUrl || this.currentOrder.photo || ''
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

  //Alerta de mensagem para o usuário, a imagem é obrigatória
  galleryNoImage(){
      this.toastCtrl.create({
        message: 'Please select an image next time!',
        duration: 3000
      }).present();
  }

}
