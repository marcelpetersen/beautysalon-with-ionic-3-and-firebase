import *as firebase from 'firebase';
import { UserProvider } from './../user/user';
import { AuthProvider } from './../auth/auth';
import { Driver } from './../../models/driver';
import { FirebaseListObservable, FirebaseApp, AngularFire, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseProvider } from "../base/base";
import { Observable } from "rxjs";

/*
  Generated class for the DriverProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DriverProvider extends BaseProvider {

  drivers: FirebaseListObservable<Driver[]>;  
  driver: FirebaseListObservable<Driver[]>;  
  
  currentUser: any;
  currentDriver: any;

  constructor(
    public http: Http,
    @Inject(FirebaseApp) public firebaseApp: any,
    public angularFire: AngularFire,
    public authProvider: AuthProvider,
    public userProvider: UserProvider,
    public angularFireDatabase: AngularFireDatabase     
    ) {
    //Obrigatório chamar o "super()" porque extendemos a classe "AuthProvider" da classe "BaseService"
    super();
    //Chama o método principal que alimenta todos os outros métodos
    this.initialize();
  }

  //Método responsável por ler os registros e exibir os mesmos
  initialize(){
    //Aqui pegamos o usuário atual que está logado no sistema
    this.currentUser = firebase.auth().currentUser.uid;
    //Lista categorias na tela "category.page.html" e "category.page.ts"
    this.drivers = this.angularFire.database.list( `/drivers/${this.currentUser}` );   
    //Lista categorias na tela "category.page.html" e "category.page.ts"
    this.driver = this.angularFire.database.list( `/drivers/${this.currentUser}` ); 
  }  

  //Método responsável por negar a criação de uma nova categoria, caso ela já exista
  driverExists( name: string ): Observable<boolean> {
    return this.angularFire.database.list( `/drivers/${this.currentUser}`, {
      query: {
        orderByChild: 'name',
        equalTo: name
      }
    }).map( (drivers: Driver[]) => {
      return drivers.length > 0;
    }).catch( this.handleObservableError );
  } 

  //Método responsável por criar, cadastrar, registrar
  create( driver ): firebase.Promise<void>{                
    //return this.angularFire.database.object( `/categories/${this.currentUser}/${category.name}` )
    return this.angularFireDatabase.object( `/drivers/${this.currentUser}/${driver.name}` )
    .set( driver )
    .catch( this.handlePromiseError );   
  }

  //Método responsável por deletar, excluir
  delete( id ): any{
    return this.angularFireDatabase.list( `/drivers/${this.currentUser}` ).remove(id);
  }

  //Método responsável por criar, cadastrar, registrar
  edit( driver: { name: string, cnh: string, state: string } ): firebase.Promise<void>{                
    //return this.angularFire.database.object( `/categories/${this.currentUser}/${category.name}` )
    return this.angularFireDatabase.object( `/drivers/${this.currentUser}/${driver.name}` )
    .update( driver )
    .catch( this.handlePromiseError );   
  }

  //Método responsável por pegar o o nome da categoria logado nos sistema
  get(name: string): FirebaseObjectObservable<Driver> {
    return <FirebaseObjectObservable<Driver>>this.angularFire.database.object(`/drivers/${this.currentUser}/${name}`)
      .catch(this.handleObservableError);
  }
  
  //Método responsável por enviar a foto para o "Firebase Storage"
  uploadPhoto(file: File, name: string): firebase.storage.UploadTask {
    return this.firebaseApp
      .storage()
      .ref()
      .child(`/drivers/${this.currentUser}/${name}`)
      .put(file);
  }   

  //Método responsável por atualizar a categoria com a imagem
  editComFoto(driver: { name: string, photo: string }): firebase.Promise<void> {    
    this.currentDriver = this.angularFireDatabase.object( `/drivers/${this.currentUser}/${driver.name}` );
    return this.currentDriver
      .update( driver )
      .catch(this.handlePromiseError);
  }  


}
