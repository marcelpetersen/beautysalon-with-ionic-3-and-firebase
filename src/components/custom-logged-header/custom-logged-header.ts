import { AuthProvider } from './../../providers/auth/auth';
import { AlertController, App, MenuController } from 'ionic-angular';
import { User } from './../../models/user';
import { Component, Input } from '@angular/core';
import { BaseComponent } from "../base.component";

/**
 * Generated class for the CustomLoggedHeaderComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */

@Component({
  selector: 'custom-logged-header',
  templateUrl: 'custom-logged-header.html'
})
export class CustomLoggedHeaderComponent extends BaseComponent {

  //Título da página, essa variável vai pegar o nome do usuário, apartir do segmento "chats"
  @Input() title: string;
  //Imagem do usuário, essa variável vai pegar a imagem do usuário, apartir da nossa classe "user"
  @Input() user: User;

  constructor(
        public alertCtrl: AlertController,
        public authProvider: AuthProvider,
        public app: App,
        public menuCtrl: MenuController    
  ) {
    super( alertCtrl, authProvider, app, menuCtrl );    
  }

}