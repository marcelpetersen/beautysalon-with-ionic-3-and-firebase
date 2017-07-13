import { LocalNotifications } from '@ionic-native/local-notifications';
import { Push } from '@ionic-native/push';
import { GalleryEditFotoPage } from './../pages/gallery-edit-foto/gallery-edit-foto';
import { GalleryEditPage } from './../pages/gallery-edit/gallery-edit';
import { GalleryDetailsPage } from './../pages/gallery-details/gallery-details';
import { GalleryPage } from './../pages/gallery/gallery';
import { InitialPage } from './../pages/initial/initial';
import { UserEditPage } from './../pages/user-edit/user-edit';
import { UserDetailsPage } from './../pages/user-details/user-details';
import { StateOrderEditFotoPage } from './../pages/state-order-edit-foto/state-order-edit-foto';
import { StateOrderEditPage } from './../pages/state-order-edit/state-order-edit';
import { StateOrderDetailsPage } from './../pages/state-order-details/state-order-details';
import { StateOrderPage } from './../pages/state-order/state-order';
import { StateLevelEditFotoPage } from './../pages/state-level-edit-foto/state-level-edit-foto';
import { StateLevelEditPage } from './../pages/state-level-edit/state-level-edit';
import { StateLevelDetailsPage } from './../pages/state-level-details/state-level-details';
import { StateLevelPage } from './../pages/state-level/state-level';
import { StateGeneralEditFotoPage } from './../pages/state-general-edit-foto/state-general-edit-foto';
import { StateGeneralEditPage } from './../pages/state-general-edit/state-general-edit';
import { StateGeneralDetailsPage } from './../pages/state-general-details/state-general-details';
import { StateGeneralPage } from './../pages/state-general/state-general';
import { OrderEditFotoPage } from './../pages/order-edit-foto/order-edit-foto';
import { OrderEditPage } from './../pages/order-edit/order-edit';
import { OrderDetailsPage } from './../pages/order-details/order-details';
import { OrderPage } from './../pages/order/order';
import { DriverEditFotoPage } from './../pages/driver-edit-foto/driver-edit-foto';
import { DriverEditPage } from './../pages/driver-edit/driver-edit';
import { DriverDetailsPage } from './../pages/driver-details/driver-details';
import { DriverPage } from './../pages/driver/driver';
import { ClientEditFotoPage } from './../pages/client-edit-foto/client-edit-foto';
import { ClientEditPage } from './../pages/client-edit/client-edit';
import { ClientDetailsPage } from './../pages/client-details/client-details';
import { ClientPage } from './../pages/client/client';
import { CategoryEditFotoPage } from './../pages/category-edit-foto/category-edit-foto';
import { CategoryEditPage } from './../pages/category-edit/category-edit';
import { CategoryDetailsPage } from './../pages/category-details/category-details';
import { CategoryPage } from './../pages/category/category';
import { SobrePage } from './../pages/sobre/sobre';
import { UserProfilePage } from './../pages/user-profile/user-profile';
import { UserPage } from './../pages/user/user';
import { SignupPage } from './../pages/signup/signup';
import { SigninPage } from './../pages/signin/signin';
import { ChatPage } from './../pages/chat/chat';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AuthProvider } from '../providers/auth/auth';
import { ChatProvider } from '../providers/chat/chat';
import { MessageProvider } from '../providers/message/message';
import { UserProvider } from '../providers/user/user';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { HttpModule } from "@angular/http";
import { CustomLoggedHeaderComponent } from '../components/custom-logged-header/custom-logged-header';
import { MessageBoxComponent } from '../components/message-box/message-box';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { UserInfoComponent } from '../components/user-info/user-info';
import { UserMenuComponent } from '../components/user-menu/user-menu';
import { UserMenuAdministratorComponent } from '../components/user-menu-administrator/user-menu-administrator';
import { UserMenuOperatorComponent } from '../components/user-menu-operator/user-menu-operator';
import { UserMenuVisitorComponent } from '../components/user-menu-visitor/user-menu-visitor';
import { CapitalizePipe } from '../pipes/capitalize/capitalize';
import { CategoryProvider } from '../providers/category/category';
import { ClientProvider } from '../providers/client/client';
import { DriverProvider } from '../providers/driver/driver';
import { OrderProvider } from '../providers/order/order';
import { StateGeneralProvider } from '../providers/state-general/state-general';
import { StateLevelProvider } from '../providers/state-level/state-level';
import { StateOrderProvider } from '../providers/state-order/state-order';
import { GalleryProvider } from '../providers/gallery/gallery';

//Removido "projectId: "sgs-firebase","
export const firebaseAppConfig = {
    apiKey: "AIzaSyDRP73ym2c6uc80z9C07MUT6WMi8qOE3As",
    authDomain: "beautysalon-c3ec6.firebaseapp.com",
    databaseURL: "https://beautysalon-c3ec6.firebaseio.com",
    projectId: "beautysalon-c3ec6",
    storageBucket: "beautysalon-c3ec6.appspot.com",
    messagingSenderId: "313293940127"  
}

//Configuração do método de autenticação
export const firebaseAuthConfig = {
  provider: AuthProviders.Custom,
  method: AuthMethods.Password
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ChatPage,
    SigninPage,
    SignupPage,
    SobrePage,
    InitialPage,

    CategoryPage,
    CategoryDetailsPage,
    CategoryEditPage, 
    CategoryEditFotoPage,
    
    ClientPage,
    ClientDetailsPage,
    ClientEditPage,
    ClientEditFotoPage,

    DriverPage,
    DriverDetailsPage,
    DriverEditPage, 
    DriverEditFotoPage,

    GalleryPage,
    GalleryDetailsPage,
    GalleryEditPage, 
    GalleryEditFotoPage,
    
    OrderPage,
    OrderDetailsPage,
    OrderEditPage,
    OrderEditFotoPage,

    StateGeneralPage,
    StateGeneralDetailsPage,
    StateGeneralEditPage,
    StateGeneralEditFotoPage,

    StateLevelPage,
    StateLevelDetailsPage,
    StateLevelEditPage,
    StateLevelEditFotoPage,

    StateOrderPage,
    StateOrderDetailsPage,
    StateOrderEditPage,
    StateOrderEditFotoPage,    

    UserPage,
    UserDetailsPage,
    UserEditPage,
    UserProfilePage,

    MessageBoxComponent,
    ProgressBarComponent,
    UserInfoComponent,
    UserMenuComponent,
    CustomLoggedHeaderComponent,
    UserMenuAdministratorComponent,
    UserMenuOperatorComponent,
    UserMenuVisitorComponent,

    CapitalizePipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp( firebaseAppConfig, firebaseAuthConfig )
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ChatPage,
    SigninPage,
    SignupPage,
    SobrePage,
    InitialPage,

    CategoryPage,
    CategoryDetailsPage,
    CategoryEditPage, 
    CategoryEditFotoPage,
    
    ClientPage,
    ClientDetailsPage,
    ClientEditPage,
    ClientEditFotoPage,

    DriverPage,
    DriverDetailsPage,
    DriverEditPage, 
    DriverEditFotoPage,

    GalleryPage,
    GalleryDetailsPage,
    GalleryEditPage, 
    GalleryEditFotoPage,

    OrderPage,
    OrderDetailsPage,
    OrderEditPage,
    OrderEditFotoPage,

    StateGeneralPage,
    StateGeneralDetailsPage,
    StateGeneralEditPage,
    StateGeneralEditFotoPage,

    StateLevelPage,
    StateLevelDetailsPage,
    StateLevelEditPage,
    StateLevelEditFotoPage,

    StateOrderPage,
    StateOrderDetailsPage,
    StateOrderEditPage,
    StateOrderEditFotoPage,    

    UserPage,
    UserDetailsPage,
    UserEditPage,
    UserProfilePage,
  ],
  providers: [
    AuthProvider,
    CategoryProvider,
    ChatProvider,
    ClientProvider,
    DriverProvider,
    GalleryProvider,
    MessageProvider,
    OrderProvider,
    StateGeneralProvider,
    StateLevelProvider,
    StateOrderProvider,
    UserProvider,
    StatusBar,
    SplashScreen,
    Push,
    LocalNotifications,    
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
