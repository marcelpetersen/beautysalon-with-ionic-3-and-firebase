import { SigninPage } from './../pages/signin/signin';
import { AuthProvider } from './../providers/auth/auth';
import { NavController, AlertController, App, MenuController } from 'ionic-angular';
import { OnInit } from "@angular/core";

export abstract class BaseComponent implements OnInit {

    protected navCtrl: NavController;

    constructor(
        public alertCtrl: AlertController,
        public authProvider: AuthProvider,
        public app: App,
        public menuCtrl: MenuController
    ){
        //Code Constructor
    }

    ngOnInit(): void {
        this.navCtrl = this.app.getActiveNav();
    }

    onLogout(): void {
        this.alertCtrl.create({
            title: 'Sair',
            message: 'Deseja realmente sair do sistema?',
            buttons:[
                {
                    text: 'Ok',
                    handler:() => {
                        this.authProvider.logout()
                        .then( () => {
                            this.navCtrl.setRoot( SigninPage );
                            this.menuCtrl.enable(false, 'user-menu');
                        });
                    }
                },
                {
                    text: 'Cancelar'
                }
            ]
        }).present();
    }

    informationUserLogged(): void {
        this.alertCtrl.create({
            title: 'Informações',
            message: 'Ação ainda não disponível',
            buttons:[
                {
                    text: 'Ok',
                    handler:() => {
                        //Code
                    }
                },
                {
                    text: 'Cancelar'
                }
            ]
        }).present();
    }

    settingsUser(): void {
        this.alertCtrl.create({
            title: 'Configurações',
            message: 'Ação ainda não disponível',
            buttons:[
                {
                    text: 'Ok',
                    handler:() => {
                        //Code
                    }
                },
                {
                    text: 'Cancelar'
                }
            ]
        }).present();
    }

}