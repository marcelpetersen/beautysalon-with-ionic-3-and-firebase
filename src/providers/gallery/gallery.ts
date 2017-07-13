import * as firebase from 'firebase';
import { UserProvider } from './../user/user';
import { AuthProvider } from './../auth/auth';
import { Gallery } from './../../models/gallery';
import { FirebaseListObservable, FirebaseApp, AngularFire, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseProvider } from "../base/base";
import { Observable } from "rxjs";

/*
  Generated class for the GalleryProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class GalleryProvider extends BaseProvider {

  galleries: FirebaseListObservable<Gallery[]>;  
  gallery: FirebaseListObservable<Gallery[]>;  
  
  currentUser: any;
  currentGallery: any;
  
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
    this.galleries = this.angularFire.database.list( `/galleries/${this.currentUser}` );   
    //Lista categorias na tela "category.page.html" e "category.page.ts"
    this.gallery = this.angularFire.database.list( `/galleries/${this.currentUser}` );  
  }

  //Método responsável por negar a criação de uma nova categoria, caso ela já exista
  galleryExists( name: string ): Observable<boolean> {
    return this.angularFire.database.list( `/galleries/${this.currentUser}`, {
      query: {
        orderByChild: 'name',
        equalTo: name
      }
    }).map( (galleries: Gallery[]) => {
      return galleries.length > 0;
    }).catch( this.handleObservableError );
  } 

  //Método responsável por criar, cadastrar, registrar
  create( gallery ): firebase.Promise<void>{                
    //return this.angularFire.database.object( `/galleries/${this.currentUser}/${gallery.name}` )
    return this.angularFireDatabase.object( `/galleries/${this.currentUser}/${gallery.name}` )
    .set( gallery )
    .catch( this.handlePromiseError );   
  }

  //Método responsável por deletar, excluir
  delete( id ): any{
    return this.angularFireDatabase.list( `/galleries/${this.currentUser}` ).remove(id);
  }

  //Método responsável por criar, cadastrar, registrar
  edit( gallery: { category: string, name: string, description: string } ): firebase.Promise<void>{                
    //return this.angularFire.database.object( `/galleries/${this.currentUser}/${gallery.name}` )
    return this.angularFireDatabase.object( `/galleries/${this.currentUser}/${gallery.name}` )
    .update( gallery )
    .catch( this.handlePromiseError );   
  }

  //Método responsável por pegar o o nome da categoria logado nos sistema
  get(name: string): FirebaseObjectObservable<Gallery> {
    return <FirebaseObjectObservable<Gallery>>this.angularFire.database.object(`/galleries/${this.currentUser}/${name}`)
      .catch(this.handleObservableError);
  }
  
  //Método responsável por enviar a foto para o "Firebase Storage"
  uploadPhoto(file: File, name: string): firebase.storage.UploadTask {
    return this.firebaseApp
      .storage()
      .ref()
      .child(`/galleries/${this.currentUser}/${name}`)
      .put(file);
  }   

  //Método responsável por atualizar a categoria com a imagem
  editComFoto(gallery: { name: string, photo: string }): firebase.Promise<void> {    
    this.currentGallery = this.angularFireDatabase.object( `/galleries/${this.currentUser}/${gallery.name}` );
    return this.currentGallery
      .update( gallery )
      .catch(this.handlePromiseError);
  }  


}
