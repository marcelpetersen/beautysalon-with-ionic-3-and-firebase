import { LocalNotifications } from '@ionic-native/local-notifications';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FirebaseAuthState } from 'angularfire2';

import { SigninPage } from './../pages/signin/signin';

import { User } from './../models/user';

import { UserProvider } from './../providers/user/user';
import { AuthProvider } from './../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = SigninPage;
  currentUser: User;
  level: any;  

  constructor(
    public platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    authProvider: AuthProvider,
    userProvider: UserProvider,
    public push: Push,
    public alertCtrl: AlertController,
    private localNotifications: LocalNotifications    
    ) {

    //AuthService
    authProvider
      .auth
      .subscribe((authState: FirebaseAuthState) => {
        
        if (authState) {

            userProvider.currentUser
              .subscribe((user: User) => {
                this.currentUser = user;
                this.level = this.currentUser.level
              });
                            
        }

      });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      //Push Notification Firebase
      this.pushsetup();
    });

    //Verificação de recebimento da notificação
    this.platform.ready().then((res) => {
      this.localNotifications.on( 'click', ( notification, state ) => {
        //let json = JSON.parse( notification.data );
        let alert = this.alertCtrl.create({
          title: 'LocalNotification',
          message: 'Lembrete de notificação entregue com sucesso!'
        });
        alert.present();
      });
    });

  }


  pushsetup(){
    // to check if we have permission
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          //alert('Permissão concedida para enviar notificação usando o [Notification Push]');
        } else {
          //alert('Você não tem permissão para enviar notificação usando o [Notification Push]');
        }

    });  

    // to initialize push notifications
    const options: PushOptions = {
      android: {
          senderID: '313293940127',        
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification')
    .subscribe((notification: any) => {
      if( notification.additionalData.foreground ){
        let alert = this.alertCtrl.create({
          title: 'Notification sended by Firebase',
          message: notification.message
        });
        alert.present();
      }
    });

    pushObject.on('registration')
    .subscribe((registration: any) => {
      //alert('Device registered ' +  registration) 
    });

    pushObject.on('error')
    .subscribe(error => {
      //alert('Error with Push plugin ' +  error) 
    });    
  }

  scheduleNotification(){
    this.localNotifications.schedule({
      id: 1,
      title: 'Remember Notification',
      text: 'Notification sended by Firebase',
      at: new Date( new Date().getTime() + 5 * 1000 ),  
      data: { secret: 'LocalNotification' }
    });
    
  }  

}

