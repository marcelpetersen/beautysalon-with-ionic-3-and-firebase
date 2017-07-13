import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { UserProvider } from './../user/user';
import { AuthProvider } from './../auth/auth';
import { StateLevel } from './../../models/state-level';
import { FirebaseListObservable, FirebaseApp, AngularFire, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseProvider } from "../base/base";

/*
  Generated class for the StateLevelProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class StateLevelProvider extends BaseProvider {

  stateslevel: FirebaseListObservable<StateLevel[]>;  
  level: FirebaseListObservable<StateLevel[]>;  

  currentUser: any;
  currentLevel: any;

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
    this.stateslevel = this.angularFire.database.list( `/stateslevel/${this.currentUser}` );   
    //Lista categorias na tela "category.page.html" e "category.page.ts"
    this.level = this.angularFire.database.list( `/stateslevel/${this.currentUser}` );  
  }

  //Método responsável por negar a criação de uma nova categoria, caso ela já exista
  stateLevelExists( name: string ): Observable<boolean> {
    return this.angularFire.database.list( `/stateslevel/${this.currentUser}`, {
      query: {
        orderByChild: 'name',
        equalTo: name
      }
    }).map( (stateslevel: StateLevel[]) => {
      return stateslevel.length > 0;
    }).catch( this.handleObservableError );
  } 

  //Método responsável por criar, cadastrar, registrar
  create( state ): firebase.Promise<void>{                
    //return this.angularFire.database.object( `/categories/${this.currentUser}/${category.name}` )
    return this.angularFireDatabase.object( `/stateslevel/${this.currentUser}/${state.name}` )
    .set( state )
    .catch( this.handlePromiseError );   
  }

  //Método responsável por deletar, excluir
  delete( id ): any{
    return this.angularFireDatabase.list( `/stateslevel/${this.currentUser}` ).remove(id);
  }

  //Método responsável por criar, cadastrar, registrar
  edit( state: { name: string, description: string, state: string } ): firebase.Promise<void>{                
    return this.angularFireDatabase.object( `/stateslevel/${this.currentUser}/${state.name}` )
    .update( state )
    .catch( this.handlePromiseError );   
  }

  //Método responsável por pegar o o nome da categoria logado nos sistema
  get(name: string): FirebaseObjectObservable<StateLevel> {
    return <FirebaseObjectObservable<StateLevel>>this.angularFire.database.object(`/stateslevel/${this.currentUser}/${name}`)
      .catch(this.handleObservableError);
  }
  
  //Método responsável por enviar a foto para o "Firebase Storage"
  uploadPhoto(file: File, name: string): firebase.storage.UploadTask {
    return this.firebaseApp
      .storage()
      .ref()
      .child(`/stateslevel/${this.currentUser}/${name}`)
      .put(file);
  }   

  //Método responsável por atualizar a categoria com a imagem
  editComFoto( state: { name: string, photo: string }): firebase.Promise<void> {    
    this.currentLevel = this.angularFireDatabase.object( `/stateslevel/${this.currentUser}/${state.name}` );
    return this.currentLevel
      .update( state )
      .catch(this.handlePromiseError);
  }  


}
