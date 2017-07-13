//Adicionado manualmente
import * as firebase from 'firebase';
import { BaseProvider } from './../base/base';
import { User } from './../../models/user';
import { FirebaseListObservable, FirebaseObjectObservable, FirebaseApp, AngularFire, FirebaseAuthState } from 'angularfire2';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs";

//Linha abaixo não consta no projeto inicial "Chat with firebase"
import 'rxjs/add/operator/map';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class UserProvider extends BaseProvider {

  users: FirebaseListObservable<User[]>;
  currentUser: FirebaseObjectObservable<User>;

  constructor(
    public angularFire: AngularFire,
    @Inject(FirebaseApp) public firebaseApp: any,
    public http: Http
    ) {
    
    //Obrigatório chamar o "super()" porque extendemos a classe "AuthProvider" da classe "BaseService"
    super();
    
    //console.log('Hello User Provider');

    //Linha abaixo foi removida por que antes ela retornava para nós todos os usuários existentes, mais agora precisamos retornar todos os usuário "EXCETO USUÁRIO LOGADO"
    //this.users = this.af.database.list( `/users` );
    this.listenAuthState();

  }

  //Aqui vamos tratar de esconder, ocultar, remover o "USUÁRIO LOGADO" da nossa lista de usuários
  private setUsers(uidToExclude: string): void {
    this.users = <FirebaseListObservable<User[]>>this.angularFire.database.list(`/users`, {      
      query: {        
        orderByChild: 'name' //Realtime Database/Regras "users": { ".read": true, ".write": true, ".indexOn": ["username", "name"] }
      }
    }).map((users: User[]) => {
      //Aqui será encontrado todos os usuário existentes, logo em seguida usamos o parâmetro "uidToExclude" para excluírmos da nossa lista o usuário logado atualmente
      return users.filter((user: User) => user.$key !== uidToExclude);
    });
  }

  //Método responsável por escutar alterações, assim que uma instância desse serviço for criado iremos se inscrever para ouvir e ler alterações que serão feitas para esse cara
  private listenAuthState(): void {
    this.angularFire.auth
      .subscribe((authState: FirebaseAuthState) => {
        //Se houver um usuário logado, vamos buscar esse mesmo usuário lá no nosso "Realtime Database"
        if (authState) {
          //console.log('Auth state alterado!');          
          //Aqui é recuperado o usuário que está logado no sistema
          this.currentUser = this.angularFire.database.object(`/users/${authState.auth.uid}`);
          //Aqui é chamado o Método "setUsers" toda vez que o usuário for logar no sistema
          this.setUsers(authState.auth.uid);
        }
      });
  }

  create( user : User, uuid: string): firebase.Promise<void>{
    //Aqui estamos trabalhando com um único registro, diferente do "FirebaseListObservable" que trabalha com uma lista inteira de dados
    return this.angularFire.database.object(`/users/${uuid}`)    
    .set( user )
    .catch( this.handlePromiseError );
  }

  //Método responsável por atualizar o usuário
  edit( user: {name: string, username: string, photo: string}): firebase.Promise<void> { //Removido "level: string, state: string,"
      //return this.angularFire.database.object(`/users/${this.currentUser}`)    
      return this.currentUser
      .update(user)
      .catch(this.handlePromiseError);
  }

  //Método responsável por deletar, excluir
  delete( user ): any{
    return this.angularFire.database.list( `/users/${this.currentUser}` ).remove(user);
  }

  //Método responsável Verifica se o usuário já existe
  userExists( username: string ): Observable<boolean> {
    return this.angularFire.database.list(`/users`, {
      query: {
        orderByChild: 'username',
        equalTo: username
      }
    }).map( (users: User[]) => {
      return users.length > 0;
    }).catch( this.handleObservableError );
  }

  //Método responsável por pegar o usuário logado nos sistema
  get(userId: string): FirebaseObjectObservable<User> {
    return <FirebaseObjectObservable<User>>this.angularFire.database.object(`/users/${userId}`)
      .catch(this.handleObservableError);
  }

  //Método responsável por enviar a foto para o "Firebase Storage"
  uploadPhoto(file: File, userId: string): firebase.storage.UploadTask {
    return this.firebaseApp.storage().ref().child(`/users/${userId}`).put(file);
  }   

}
