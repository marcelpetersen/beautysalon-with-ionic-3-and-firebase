//Adicionado manualmente
import * as firebase from 'firebase';
import { Message } from './../../models/message';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { BaseProvider } from './../base/base';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the MessageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class MessageProvider extends BaseProvider {

  constructor(
    public http: Http,
    public angularFire: AngularFire
    ) {

    super();
    console.log('Hello MessageProvider Provider');

  }

  //Método responsável por criar a mensagem propriamente dito
  create(message: Message, listMessages: FirebaseListObservable<Message[]>): firebase.Promise<void> {
    return listMessages.push(message)
      .catch(this.handlePromiseError);
  }

  //Método responsável por pegar as últimas mensagens, no total serão pegas as últimas "30 mensagens"
  getMessages(userId1: string, userId2: string): FirebaseListObservable<Message[]> {
    return <FirebaseListObservable<Message[]>>this.angularFire.database.list(`/messages/${userId1}-${userId2}`, {
      query: {
        orderByChild: 'timestamp',
        limitToLast: 30
      }
    }).catch(this.handleObservableError);
  }


}

