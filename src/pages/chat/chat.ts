//Adicionado manualmente
import * as firebase from 'firebase';
import { MessageProvider } from './../../providers/message/message';
import { ChatProvider } from './../../providers/chat/chat';
import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { Chat } from './../../models/chat';
import { User } from './../../models/user';
import { Message } from './../../models/message';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';

/**
 * Generated class for the ChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  //Recuperar a instância dos elementos da nossa View no caso aqui pegamos a instãncia do o elemento "<ion-content padding>"
  //Para manipularmos a barra de rolagem da nossa página de chat e de conversas
  @ViewChild(Content) content: Content;

  messages: FirebaseListObservable<Message[]>;
  pageTitle: string;
  sender: User;
  recipient: User;

  //Sender Chat
  private chat1: FirebaseObjectObservable<Chat>;
  //Recipiente Chat
  private chat2: FirebaseObjectObservable<Chat>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public userProvider: UserProvider,
    public chatProvider: ChatProvider,
    public messageProvider: MessageProvider
  ) {

  }

  //O primeiro LifeCycleEvent a ser executado
  //Verificação de autenticação de qualquer usuário, caso ele já esteja autenticado ele poderá entrar na página "HOME", caso contrário "NÃO PODERÁ ENTRAR"
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  ionViewDidLoad() {
    //Capturamos o nosso usuário que está recebendo as nossas conversas chamado "recipientUser", lá da "home.ts" método chamado "onChatOpen()"
    this.recipient = this.navParams.get('recipientUser');
    //Aqui atribuímos ao título da página o nome do nosso usuário que vai receber a mensagem
    this.pageTitle = this.recipient.name;

    this.userProvider.currentUser
      .first()
      .subscribe((currentUser: User) => {
        this.sender = currentUser;

        this.chat1 = this.chatProvider.getDeepChat(this.sender.$key, this.recipient.$key);
        this.chat2 = this.chatProvider.getDeepChat(this.recipient.$key, this.sender.$key);

        //Atualiza a foto do primeiro chat "this.chat1 = this.chatService.getDeepChat(this.sender.$key, this.recipient.$key);"
        if (this.recipient.photo) {
          this.chat1
            .first()
            .subscribe((chat: Chat) => {
              this.chatProvider.updatePhoto(this.chat1, chat.photo, this.recipient.photo);
            });
        }

        let doSubscription = () => {
          this.messages
            .subscribe((messages: Message[]) => {
              this.scrollToBottom();
            });
        };

        this.messages = this.messageProvider
          .getMessages(this.sender.$key, this.recipient.$key);

        this.messages
          .first()
          .subscribe((messages: Message[]) => {

            if (messages.length === 0) {

              this.messages = this.messageProvider
                .getMessages(this.recipient.$key, this.sender.$key);

              doSubscription();

            } else {

              doSubscription();
              
            }

          });

      });

  }

  sendMessage(newMessage: string): void {

    if (newMessage) {

      // "firebase.database.ServerValue.TIMESTAMP;" Buscando data e hora do servidor do própio "Firebase"
      let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;

      this.messageProvider.create(
        new Message(
          this.sender.$key,
          newMessage,
          currentTimestamp
        ),
        this.messages
      ).then(() => {

        //Método poderia ser criado dentro do nosso "chat.service.ts"
        this.chat1
          .update({
            lastMessage: newMessage,
            timestamp: currentTimestamp
          });

        //Método poderia ser criado dentro do nosso "chat.service.ts"
        this.chat2
          .update({
            lastMessage: newMessage,
            timestamp: currentTimestamp
          });


      });

    }

  }

  private scrollToBottom( duration?: number ): void {
    setTimeout( () => {
      if( this.content ){
        this.content.scrollToBottom( duration || 300 ); 
      }
    }, 50 );
  }

  /*
  //Rola a página para exibir os últimos dados existentes no nosso banco de dados, como última mensagem recebida, enviada
  private scrollToBottom( ) {
    this.content.scrollToBottom();
  }
  */


}
