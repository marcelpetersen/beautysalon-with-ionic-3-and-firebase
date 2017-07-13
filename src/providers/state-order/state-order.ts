import * as firebase from 'firebase';
import { UserProvider } from './../user/user';
import { AuthProvider } from './../auth/auth';
import { StateOrder } from './../../models/state-order';
import { FirebaseListObservable, FirebaseApp, AngularFire, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseProvider } from "../base/base";
import { Observable } from "rxjs";

/*
  Generated class for the StateOrderProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class StateOrderProvider extends BaseProvider {

  statesorder: FirebaseListObservable<StateOrder[]>;  
  state: FirebaseListObservable<StateOrder[]>;  
  
  currentUser: any;
  currentState: any;

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
    this.statesorder = this.angularFire.database.list( `/statesorder/${this.currentUser}` );   
    //Lista categorias na tela "category.page.html" e "category.page.ts"
    this.state = this.angularFire.database.list( `/statesorder/${this.currentUser}` );  
  }


  //Método responsável por negar a criação de uma nova categoria, caso ela já exista
  stateOrderExists( name: string ): Observable<boolean> {
    return this.angularFire.database.list( `/statesorder/${this.currentUser}`, {
      query: {
        orderByChild: 'name',
        equalTo: name
      }
    }).map( (statesorder: StateOrder[]) => {
      return statesorder.length > 0;
    }).catch( this.handleObservableError );
  } 

  //Método responsável por criar, cadastrar, registrar
  create( state ): firebase.Promise<void>{                
    //return this.angularFire.database.object( `/categories/${this.currentUser}/${category.name}` )
    return this.angularFireDatabase.object( `/statesorder/${this.currentUser}/${state.name}` )
    .set( state )
    .catch( this.handlePromiseError );   
  }

  //Método responsável por deletar, excluir
  delete( id ): any{
    return this.angularFireDatabase.list( `/statesorder/${this.currentUser}` ).remove(id);
  }

  //Método responsável por criar, cadastrar, registrar
  edit( state: { name: string, description: string, state: string } ): firebase.Promise<void>{                
    //return this.angularFire.database.object( `/categories/${this.currentUser}/${category.name}` )
    return this.angularFireDatabase.object( `/statesorder/${this.currentUser}/${state.name}` )
    .update( state )
    .catch( this.handlePromiseError );   
  }

  //Método responsável por pegar o o nome da categoria logado nos sistema
  get(name: string): FirebaseObjectObservable<StateOrder> {
    return <FirebaseObjectObservable<StateOrder>>this.angularFire.database.object(`/statesorder/${this.currentUser}/${name}`)
      .catch(this.handleObservableError);
  }
  
  //Método responsável por enviar a foto para o "Firebase Storage"
  uploadPhoto(file: File, name: string): firebase.storage.UploadTask {
    return this.firebaseApp
      .storage()
      .ref()
      .child(`/statesorder/${this.currentUser}/${name}`)
      .put(file);
  }   

  //Método responsável por atualizar a categoria com a imagem
  editComFoto( state: { name: string, photo: string }): firebase.Promise<void> {    
    this.currentState = this.angularFireDatabase.object( `/statesorder/${this.currentUser}/${state.name}` );
    return this.currentState
      .update( state )
      .catch(this.handlePromiseError);
  }  


}
