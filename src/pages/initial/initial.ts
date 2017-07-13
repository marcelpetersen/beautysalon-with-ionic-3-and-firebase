import * as firebase from 'firebase';
import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';

/**
 * Generated class for the InitialPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-initial',
  templateUrl: 'initial.html',
})
export class InitialPage {

  currentUser: any;

  view: string = 'Home';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public userProvider: UserProvider,
    ) {
      this.currentUser = firebase.auth().currentUser.uid;
      //console.log('CurrentUserUid', this.currentUser);
  }

 //O primeiro LifeCycleEvent a ser executado
  //Verificação de autenticação de qualquer usuário, caso ele já esteja autenticado ele poderá entrar na página "HOME", caso contrário "NÃO PODERÁ ENTRAR"
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;    
  }

  //O segundo LifeCycleEvent a ser executado
  ionViewDidLoad() {
    //Habilita o menu do usuário logado "user-menu", podendo ser criado múltiplos menus, para cada tipo de usuário
    this.menuCtrl.enable(true, 'user-menu');
  }  
 
}
