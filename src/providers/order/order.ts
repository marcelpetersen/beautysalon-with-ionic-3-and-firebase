import * as firebase from 'firebase';
import { UserProvider } from './../user/user';
import { AuthProvider } from './../auth/auth';
import { FirebaseListObservable, FirebaseApp, AngularFire, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2';
import { Order } from './../../models/order';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseProvider } from "../base/base";
import { Observable } from "rxjs";

/*
  Generated class for the OrderProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class OrderProvider extends BaseProvider {

  orders: FirebaseListObservable<Order[]>;   
  order: FirebaseListObservable<Order[]>;  
  
  currentUser: any;
  currentOrder: any;  
  
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
    this.orders = this.angularFire.database.list( `/orders/${this.currentUser}` );   
    //Lista categorias na tela "category.page.html" e "category.page.ts"
    this.order = this.angularFire.database.list( `/orders/${this.currentUser}` ); 
      
  } 

  //Método responsável por checar se já existe uma ordem de serviço solicitada em andamento para o cliente em questão
  orderCreateExists( client: string, state: string ): Observable<boolean> {
    return this.angularFire.database.list( `/orders/${this.currentUser}`, {
      query: {
        orderByChild: 'client, state',
        equalTo: client, state
      }
    }).map( (orders: Order[]) => {
      return orders.length > 0;
    }).catch( this.handleObservableError );
  } 

  //Método responsável por criar, cadastrar, registrar
  //Até aqui OK
  create( order ): firebase.Promise<void>{                
    //return this.angularFire.database.object( `/categories/${this.currentUser}/${category.name}` )
    //return this.angularFireDatabase.object( `/orders/${this.currentUser}/${order.client}` )
    return this.angularFireDatabase.list( `/orders/${this.currentUser}` )
    .push( order )
    .catch( this.handlePromiseError );   
  }

  //Método responsável por deletar, excluir
  //Até aqui OK
  delete( id ): any{
    return this.angularFireDatabase.list( `/orders/${this.currentUser}` )
    .remove(id);
  }

  //Método responsável por criar, cadastrar, registrar
  //Até aqui OK
  edit( order: { $key: string, client: string, category: string, description: string, state: string } ): firebase.Promise<void>{ //driver: string,
    //return this.angularFire.database.object( `/categories/${this.currentUser}/${category.name}` )
    return this.angularFireDatabase.object( `/orders/${this.currentUser}/${order.$key}` )
    .update( order )
    .catch( this.handlePromiseError );   
  }

  //Método responsável por pegar o o nome da categoria logado nos sistema
  get( client: string ): FirebaseObjectObservable<Order> {
    return <FirebaseObjectObservable<Order>>this.angularFire.database.object(`/orders/${this.currentUser}/${client}`)
      .catch(this.handleObservableError);
  }
  
  //Método responsável por enviar a foto para o "Firebase Storage"
  uploadPhoto( file: File, client: string ): firebase.storage.UploadTask {
    return this.firebaseApp
      .storage()
      .ref()
      .child(`/orders/${this.currentUser}/${client}`)
      .put(file);
  }   

  //Método responsável por atualizar a categoria com a imagem
  editComFoto( order: { client: string, photo: string } ): firebase.Promise<void> {      
    this.currentOrder = this.angularFireDatabase.object( `/orders/${this.currentUser}` );
    return this.currentOrder
      .update( order )
      .catch(this.handlePromiseError);
  }


}
