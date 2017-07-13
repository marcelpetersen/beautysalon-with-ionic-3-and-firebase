//Adicionado manualmente
import * as firebase from 'firebase';
import { BaseProvider } from './../base/base';
import { Chat } from './../../models/chat';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FirebaseListObservable, AngularFire, FirebaseAuthState, FirebaseObjectObservable } from "angularfire2";

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class ChatProvider extends BaseProvider {

  //Lista de chats "conversas"
  chats: FirebaseListObservable<Chat[]>;
  
  constructor(
    public http: Http,
    public angularFire: AngularFire,
    ) {

      //Obrigatório chamar o "super()" porque extendemos a classe "AuthService" da classe "BaseService"
      super();
      //console.log('Hello ChatProvider Provider');

      this.setChats();

  }
  
  //Método responsável por atualizar a nossa classe de modelo chamada "Chat"
  private setChats(): void {
    this.angularFire.auth
      //Ouvir alterações no "authState"
      .subscribe((authState: FirebaseAuthState) => {
        if (authState) {
          //Lista com parâmetro para ordenar por última mensagem recebida
          this.chats = <FirebaseListObservable<Chat[]>>this.angularFire.database.list(`/chats/${authState.auth.uid}`, {
            query: {
              orderByChild: 'timestamp'
            }
          }).map((chats: Chat[]) => {
            return chats.reverse();
          }).catch(this.handleObservableError);

        }
      });
  }

  //Método responsável por criar as "janelas de bate papo", chamadas de "create" quando um "novo" usuário é selecionado, cria-se um "novo chat" automaticamente
  create(chat: Chat, userId1: string, userId2: string): firebase.Promise<void> {
    return this.angularFire.database.object(`/chats/${userId1}/${userId2}`)
      .set(chat)
      .catch(this.handlePromiseError);
  }

  //Método responsável por criar as "janelas de bate papo específica", chamadas de "getDeepChat" quando um "usuário específico" é selecionado
  getDeepChat(userId1: string, userId2: string): FirebaseObjectObservable<Chat> {
    //Tratamento de erro "<FirebaseObjectObservable<Chat>>"
    return <FirebaseObjectObservable<Chat>>this.angularFire.database.object(`/chats/${userId1}/${userId2}`)
      .catch(this.handleObservableError);
  }

  //Método responsável por realizar atualizações na imagem de perfil do usuário no nosso "Firebase Storage" e "Firebase Database"
  //Esse método vai fazere uma verificação se existe alguma imagem lá da nossa lista de usuários "users", caso exista ele atualiza ns nossa lista de conversas "chats"
  updatePhoto(chat: FirebaseObjectObservable<Chat>, chatPhoto: string, recipientUserPhoto: string): firebase.Promise<boolean> {
    if (chatPhoto != recipientUserPhoto) {
      return chat.update({
        photo: recipientUserPhoto
      }).then(() => {
        return true;
      }).catch(this.handlePromiseError);
    }
    return Promise.resolve(false);
  }

}
