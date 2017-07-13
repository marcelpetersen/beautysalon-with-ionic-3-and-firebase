//Adicionado manualmente
import * as firebase from 'firebase';
import { BaseProvider } from './../base/base';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first'; //Adicionado manualmente

import { AngularFireAuth, FirebaseAuthState } from "angularfire2";

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class AuthProvider extends BaseProvider {

  //Construtor da classe "AuthService" 
  constructor(
    public http: Http,
    public auth: AngularFireAuth        
    ) {
      //Obrigatório chamar o "super()" porque extendemos a classe "AuthService" da classe "BaseService"
      super();
      //console.log('Hello AuthProvider Provider');

  }

  //Método responsável por criar o usuário
  createAuthUser( user: { email: string, password: string } ): firebase.Promise<FirebaseAuthState>{
    return this.auth.createUser( user )
    .catch( this.handlePromiseError );
  }

  //Método responsável por logar o usuário
  signinWithEmail( user: { email: string, password: string } ): firebase.Promise<boolean>{
    return this.auth.login(user)
    .then((authState: FirebaseAuthState) => {
      return authState != null;
    }).catch(this.handlePromiseError);
  }

  //Método responsável por deslogar o susuário
  logout(): Promise<void> {
    return this.auth.logout();
  }

  //Montando uma "variável" com a palavra reservada "get" como se fosse um método podemos executar uma lógica para nosso objetivo aqui no caso...
  get authenticated(): Promise<boolean>{
    return new Promise( (resolve, reject)  => {      
      this.auth
      .first()
      .subscribe( (authState: FirebaseAuthState) => {
        //Mesmo exemplo de resolve e reject em 4 linhas de código, coloquei tudo numa linha só para economizar espaço aqui, só isso!
        /*
        if( authState ){
          resolve( true ); 
        }else{
          reject( false ); 
        } 
        */
        //Exemplo de resolve e reject em 1 linha de código
        ( authState ) ? resolve( true ) : reject ( false );                
      });
    })    
  }
  

}

