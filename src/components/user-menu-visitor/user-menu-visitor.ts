import { UserPage } from './../../pages/user/user';
import { UserProfilePage } from './../../pages/user-profile/user-profile';
import { AuthProvider } from './../../providers/auth/auth';
import { User } from './../../models/user';
import { Component, Input } from '@angular/core';
import { BaseComponent } from "../base.component";
import { AlertController, App, MenuController } from "ionic-angular";

/**
 * Generated class for the UserMenuVisitorComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */

@Component({
  selector: 'user-menu-visitor',
  templateUrl: 'user-menu-visitor.html'
})
export class UserMenuVisitorComponent extends BaseComponent {

  @Input('user') currentUser: User;

  constructor(
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public app: App,
    public menuCtrl: MenuController
  ) {
    super(alertCtrl, authProvider, app, menuCtrl);
  }

  onProfile(): void {
    this.navCtrl.push( UserProfilePage );
  }

  onAddUser(): void {
    this.navCtrl.push( UserPage );
  }
}
