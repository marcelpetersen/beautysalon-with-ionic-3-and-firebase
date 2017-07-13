import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, AlertController } from 'ionic-angular';
import firebase from 'firebase';

/**
 * Generated class for the SobrePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sobre',
  templateUrl: 'sobre.html',
})
export class SobrePage {

  currentUser: any;

  view: string = 'Sobre';

  constructor(
    public navCtrl: NavController, 
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public userProvider: UserProvider
    ) {
      this.currentUser = firebase.auth().currentUser.uid;
      //console.log('CurrentUserUid', this.currentUser);
  }

 //O primeiro LifeCycleEvent a ser executado
  //Verificação de autenticação de qualquer usuário, caso ele já esteja autenticado ele poderá entrar na página "HOME", caso contrário "NÃO PODERÁ ENTRAR"
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;    
  }

}
