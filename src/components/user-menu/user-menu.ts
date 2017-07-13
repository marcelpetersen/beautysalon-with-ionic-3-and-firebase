import { GalleryPage } from './../../pages/gallery/gallery';
import { InitialPage } from './../../pages/initial/initial';
import { StateLevelPage } from './../../pages/state-level/state-level';
import { StateOrderPage } from './../../pages/state-order/state-order';
import { StateGeneralPage } from './../../pages/state-general/state-general';
import { OrderPage } from './../../pages/order/order';
import { DriverPage } from './../../pages/driver/driver';
import { ClientPage } from './../../pages/client/client';
import { CategoryPage } from './../../pages/category/category';
import { UserPage } from './../../pages/user/user';
import { SigninPage } from './../../pages/signin/signin';
import { HomePage } from './../../pages/home/home';
import { SobrePage } from './../../pages/sobre/sobre';
import { UserProfilePage } from './../../pages/user-profile/user-profile';

import { AuthProvider } from './../../providers/auth/auth';

import { User } from './../../models/user';

import { AlertController, App, MenuController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { BaseComponent } from "../base.component";

/**
 * Generated class for the UserMenuComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */

@Component({
  selector: 'user-menu',
  templateUrl: 'user-menu.html'
})
export class UserMenuComponent extends BaseComponent {

  @Input('user') currentUser: User;

  constructor(
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public app: App,
    public menuCtrl: MenuController
  ) {
    super(alertCtrl, authProvider, app, menuCtrl);
  }

  //Página Inicial Chat
  onOpenInitialPage(): void {
    this.navCtrl.setRoot( InitialPage );
  }

  //Página Inicial Chat
  onOpenHomePage(): void {
    this.navCtrl.setRoot( HomePage );
  }

  //Página Categoria
  onOpenCategoryPage(): void {
    this.navCtrl.setRoot( CategoryPage );
  }

  //Página Cliente
  onOpenClientPage(): void {
    this.navCtrl.setRoot( ClientPage );
  }

  //Página Motorista
  onOpenDriverPage(): void {
    this.navCtrl.setRoot( DriverPage );
  }

  //Página Pedido
  onOpenOrderPage(): void {
    this.navCtrl.setRoot( OrderPage );
  }

  //Página Galeria
  onOpenGalleryPage(): void {
    this.navCtrl.setRoot( GalleryPage );
  }

  //Página usuário
  onOpenUserPage(): void {
    this.navCtrl.setRoot( UserPage );
  }

  //Página Status Geral
  onOpenStateGeneralPage(): void {
    this.navCtrl.setRoot( StateGeneralPage );
  }

  //Página Status Pedido
  onOpenStateOrderPage(): void {
    this.navCtrl.setRoot( StateOrderPage );
  }

  //Página Status Nível
  onOpenStateLevelPage(): void {
    this.navCtrl.setRoot( StateLevelPage );
  }

  //Página Perfil
  onOpenUserProfilePage(): void {
    this.navCtrl.setRoot( UserProfilePage );
  }

  //Página Sobre
  onSobre(): void {
    this.navCtrl.setRoot( SobrePage );
  }

  //Página Sair
  onLogout(): void {
      this.alertCtrl.create({
          message: 'Deseja realmente sair do sistema?',
          buttons:[
              {
                  text: 'Yes',
                  handler:() => {
                      this.authProvider.logout()
                      .then( () => {
                          this.navCtrl.setRoot( SigninPage );
                      });
                  }
              },
              {
                  text: 'Cancel'
              }
          ]
      }).present();
  }

}

