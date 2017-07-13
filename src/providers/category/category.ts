import * as firebase from 'firebase';
import { UserProvider } from './../user/user';
import { AuthProvider } from './../auth/auth';
import { Category } from './../../models/category';
import { FirebaseListObservable, FirebaseApp, AngularFire, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseProvider } from "../base/base";
import { Observable } from "rxjs";

/*
  Generated class for the CategoryProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class CategoryProvider extends BaseProvider {

  categories: FirebaseListObservable<Category[]>;  
  category: FirebaseListObservable<Category[]>;  
  
  currentUser: any;
  currentCategory: any;

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
    this.categories = this.angularFire.database.list( `/categories/${this.currentUser}` );   
    //Lista categorias na tela "category.page.html" e "category.page.ts"
    this.category = this.angularFire.database.list( `/categories/${this.currentUser}` );  

  }

  //Método responsável por negar a criação de uma nova categoria, caso ela já exista
  categoryExists( name: string ): Observable<boolean> {
    return this.angularFire.database.list( `/categories/${this.currentUser}`, {
      query: {
        orderByChild: 'name',
        equalTo: name
      }
    }).map( (categories: Category[]) => {
      return categories.length > 0;
    }).catch( this.handleObservableError );
  } 

  //Método responsável por criar, cadastrar, registrar
  create( category ): firebase.Promise<void>{                
    //return this.angularFire.database.object( `/categories/${this.currentUser}/${category.name}` )
    return this.angularFireDatabase.object( `/categories/${this.currentUser}/${category.name}` )
    .set( category )
    .catch( this.handlePromiseError );   
  }

  //Método responsável por deletar, excluir
  delete( id ): any{
    return this.angularFireDatabase.list( `/categories/${this.currentUser}` ).remove(id);
  }

  //Método responsável por criar, cadastrar, registrar
  edit( category: { name: string, description: string, price: string, observation: string, state: string } ): firebase.Promise<void>{                
    //return this.angularFire.database.object( `/categories/${this.currentUser}/${category.name}` )
    return this.angularFireDatabase.object( `/categories/${this.currentUser}/${category.name}` )
    .update( category )
    .catch( this.handlePromiseError );   
  }

  //Método responsável por pegar o o nome da categoria logado nos sistema
  get(name: string): FirebaseObjectObservable<Category> {
    return <FirebaseObjectObservable<Category>>this.angularFire.database.object(`/categories/${this.currentUser}/${name}`)
      .catch(this.handleObservableError);
  }
  
  //Método responsável por enviar a foto para o "Firebase Storage"
  uploadPhoto(file: File, name: string): firebase.storage.UploadTask {
    return this.firebaseApp
      .storage()
      .ref()
      .child(`/categories/${this.currentUser}/${name}`)
      .put(file);
  }   

  //Método responsável por atualizar a categoria com a imagem
  editComFoto(category: { name: string, photo: string }): firebase.Promise<void> {    
    this.currentCategory = this.angularFireDatabase.object( `/categories/${this.currentUser}/${category.name}` );
    return this.currentCategory
      .update(category)
      .catch(this.handlePromiseError);
  }  


}
