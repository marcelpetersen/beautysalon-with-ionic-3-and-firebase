import { InitialPage } from './../initial/initial';
//import { HomePage } from './../home/home';
import { User } from './../../models/user';
import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

/**
 * Generated class for the UserProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  image: any;

  currentUser: User;
  canEdit: boolean = false;
  uploadProgress: number;

  view: string = 'Atualizar Foto';

  private filePhoto: File;

  constructor(
    public authProvider: AuthProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userProvider: UserProvider,
    public ngZone: NgZone,
    public toastCtrl: ToastController
  ) {
    //Code
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  ionViewDidLoad() {
    this.userProvider.currentUser
      .subscribe((user: User) => {
        this.currentUser = user;
      });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    
    if (this.filePhoto) {

      let uploadTask = this.userProvider.uploadPhoto(this.filePhoto, this.currentUser.$key);

      uploadTask.on('state_changed', (snapshot) => {

        this.uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

      }, (error: Error) => {
        // catch error
      }, () => {
        this.editUser(uploadTask.snapshot.downloadURL);
      });

    } else {
      this.editUser();
    }

    this.navCtrl.setRoot( InitialPage );

  }

  onPhoto(event): void {  
    this.filePhoto = event.target.files[0];
    this.readPhoto( this.filePhoto );
  }

  //Removido "level: this.currentUser.level, state: this.currentUser.state,"
  private editUser(photoUrl?: string): void {
    this.userProvider
      .edit({ 
        name: this.currentUser.name, username: this.currentUser.username, photo: photoUrl || this.currentUser.photo || '' 
      })
      .then(() => {
        this.toastUpdateSuccess();
        this.canEdit = false; this.filePhoto = undefined; this.uploadProgress = 0;
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

  toastUpdateSuccess(){
    let toast = this.toastCtrl.create({
      message: 'Perfil atualizado com sucesso!',
      duration: 3000
    });
    toast.present();
  }
  
}
