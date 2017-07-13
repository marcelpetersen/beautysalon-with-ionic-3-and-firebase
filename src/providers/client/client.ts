import * as firebase from 'firebase';
import { UserProvider } from './../user/user';
import { AuthProvider } from './../auth/auth';
import { Client } from './../../models/client';
import { FirebaseListObservable, FirebaseApp, AngularFire, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseProvider } from "../base/base";
import { Observable } from "rxjs";

/*
  Generated class for the ClientProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class ClientProvider extends BaseProvider {

  customers: FirebaseListObservable<Client[]>;  
  client: FirebaseListObservable<Client[]>;  
  
  currentUser: any;
  currentClient: any;

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
    this.customers = this.angularFire.database.list( `/customers/${this.currentUser}` );   
    //Lista categorias na tela "category.page.html" e "category.page.ts"
    this.client = this.angularFire.database.list( `/customers/${this.currentUser}` );  
  }  

  //Método responsável por negar a criação de uma nova categoria, caso ela já exista
  clientExists( name: string ): Observable<boolean> {
    return this.angularFire.database.list( `/customers/${this.currentUser}`, {
      query: {
        orderByChild: 'name',
        equalTo: name
      }
    }).map( (customers: Client[]) => {
      return customers.length > 0;
    }).catch( this.handleObservableError );
  } 

  //Método responsável por criar, cadastrar, registrar
  create( client ): firebase.Promise<void>{                
    //return this.angularFire.database.object( `/customers/${this.currentUser}/${client.name}` )
    return this.angularFireDatabase.object( `/customers/${this.currentUser}/${client.name}` )
    .set( client )
    .catch( this.handlePromiseError );   
  }

  //Método responsável por deletar, excluir
  delete( id ): any{
    return this.angularFireDatabase.list( `/customers/${this.currentUser}` ).remove(id);
  }

  //Método responsável por criar, cadastrar, registrar
  edit( client: { name: string, rg: string, state: string } ): firebase.Promise<void>{                
    //return this.angularFire.database.object( `/categories/${this.currentUser}/${category.name}` )
    return this.angularFireDatabase.object( `/customers/${this.currentUser}/${client.name}` )
    .update( client )
    .catch( this.handlePromiseError );   
  }

  //Método responsável por pegar o o nome da categoria logado nos sistema
  get(name: string): FirebaseObjectObservable<Client> {
    return <FirebaseObjectObservable<Client>>this.angularFire.database.object(`/customers/${this.currentUser}/${name}`)
      .catch(this.handleObservableError);
  }
  
  //Método responsável por enviar a foto para o "Firebase Storage"
  uploadPhoto(file: File, name: string): firebase.storage.UploadTask {
    return this.firebaseApp
      .storage()
      .ref()
      .child(`/customers/${this.currentUser}/${name}`)
      .put(file);
  }   

  //Método responsável por atualizar a categoria com a imagem
  editComFoto(client: { name: string, photo: string }): firebase.Promise<void> {    
    this.currentClient = this.angularFireDatabase.object( `/customers/${this.currentUser}/${client.name}` );
    return this.currentClient
      .update( client )
      .catch(this.handlePromiseError);
  }  


}
