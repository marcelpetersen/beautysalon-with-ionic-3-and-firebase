//Adicionado manualmente
import * as firebase from 'firebase';
import { SignupPage } from './../signup/signup';
import { SigninPage } from './../signin/signin';
import { ChatPage } from './../chat/chat';
import { UserProvider } from './../../providers/user/user';
import { ChatProvider } from './../../providers/chat/chat';
import { AuthProvider } from './../../providers/auth/auth';
import { User } from './../../models/user';
import { Chat } from './../../models/chat';
import { FirebaseListObservable } from 'angularfire2';
import { Component } from '@angular/core';
import { NavController, AlertController, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //Variável responsável por observar todos os "chats"
  chats: FirebaseListObservable<Chat[]>;
  //Variável responsável por observar todos os "users"
  users: FirebaseListObservable<User[]>;
  //Variável para atribuir ao título da view como "chats"
  view: string = 'chats';

  //Constructor da classe, objeto "HomePage"
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public authProvider: AuthProvider,
    public chatProvider: ChatProvider,
    public userProvider: UserProvider
    ) {     

  }

  //O primeiro LifeCycleEvent a ser executado
  //Verificação de autenticação de qualquer usuário, caso ele já esteja autenticado ele poderá entrar na página "HOME", caso contrário "NÃO PODERÁ ENTRAR"
  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;        
  }

  //O segundo LifeCycleEvent a ser executado
  ionViewDidLoad() {
    //Lista de chats
    this.chats = this.chatProvider.chats;
    //Lista de users
    this.users = this.userProvider.users;
    //Habilita o menu do usuário logado "user-menu", podendo ser criado múltiplos menus, para cada tipo de usuário
    this.menuCtrl.enable(true, 'user-menu');

  }

  //Método responsável por realizar um filtro, quando estivermos na "ABA Chats" ele filtra a janela de conversa que estamos procurando e na "ABA users" ele filtra o usuário que estamos procurando
  filterItems(event: any): void {
    //Variável "searchTerm" do tipo "string" usada para guardar o valor da nossa busca 
    let searchTerm: string = event.target.value;
    //Lista de chats
    this.chats = this.chatProvider.chats;
    //Lista de users
    this.users = this.userProvider.users;
    //Caso submetemos a uma busca por dados no "searchTerm"
    if (searchTerm) {
      //Um "switch case" para a troca de "Views [chats e users]"
      switch(this.view) {
        //Caso "view-chats" seja escolhida e haja alguma busca no "searchTerm"
        //Primeiro modelo de search com 04 linhas de código
        case 'chats':
          this.chats = <FirebaseListObservable<Chat[]>>this.chats
            .map((chats: Chat[]) => chats.filter((chat: Chat) => (chat.title.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
          break;
          
        //Caso "view-users" seja escolhida e haja alguma busca no "searchTerm"
        //Segundo modelo de search com 08 linhas de código
        case 'users':
          this.users = <FirebaseListObservable<User[]>>this.users
          .map((users: User[]) => {
            return users.filter((user: User) => {
              return (user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 );
            });
          });
          break;

      }
    }    
  }

  //Método responsável por "criar" uma "janela de conversa" com qualquer um dos usuário selecionados
  onChatCreate(recipientUser: User): void {

    //Aqui é recuperado o usuário que está logado atualmente no sistema
    this.userProvider.currentUser
      //Aqui é chamado o operador "first()" que retorna apenas o primeiro valor observado, ou seja, o que interessa é apenas um valor mesmo, e não uma lista inteira
      .first()
      //Aqui podemos sobrescrever o nosso objeto, classe "User"
      .subscribe((currentUser: User) => {

        this.chatProvider.getDeepChat(currentUser.$key, recipientUser.$key)
          //Aqui é chamado o operador "first()" que retorna apenas o primeiro valor observado, ou seja, o que interessa é apenas um valor mesmo, e não uma lista inteira
          .first()
          //Aqui podemos sobrescrever o nosso objeto, classe "Chat"
          .subscribe((chat: Chat) => {

            //Aqui é verificado se existe lá no nosso "Realtime Database" o valor "chats" como se fose uma "SELECT * FROM chats...", caso "chats" não exista ele cria
            if (chat.hasOwnProperty('$value')) {

              //Aqui é recuparado a data e hora diretamente do servidor do "Firebase", para não provocar erros de redundância, caso o usuário esteja com o horário errado no dispositivo
              let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;

              //Aqui é criado o do remetente = currentUser
              let chat1 = new Chat('', timestamp, recipientUser.name, (recipientUser.photo || ''));
              this.chatProvider.create(chat1, currentUser.$key, recipientUser.$key);

              //Aqui é criado o do destinatário = recipientUser
              let chat2 = new Chat('', timestamp, currentUser.name, (currentUser.photo || ''));
              this.chatProvider.create(chat2, recipientUser.$key, currentUser.$key);

            }

          });

      });

    //Aqui o usuário é direcionado para a página de "Chat" com o parâmetro "recipientUser" que é na verdade o usuário que ele selecionou
    this.navCtrl.push( ChatPage, {
      recipientUser: recipientUser
    });
  }

  //Método responsável por deslogar o usuário
  onLogout(): void {
      this.alertCtrl.create({
          message: 'Do you want to quit?',
          buttons: [
              {
                  text: 'Yes',
                  handler: () => {
                      //Aqui o usuário é deslogado
                      this.authProvider.logout();
                      //Aqui o usuário é direcionado para a página de login
                      this.navCtrl.setRoot( SigninPage );
                  }
              },
              {
                  text: 'No'
                  //Aqui e cancelado a ação
              }
          ]
      }).present();
  }

  //Método responsável por abrir ou iniciar a conversa com qualquer um dos usuário selecionados
  onChatOpen(chat: Chat): void {
    //Aqui é iniciado a janela de conversa mesmo que não seja enviado nenhuma mensagem, pelo simples fato de selecionar um usuário já é criado a janela de chat para futuras conversas
    let recipientUserId: string = chat.$key;
    //Aqui é recuperado o "recipientUserId" ouo seja o usuário que selecionamos
    this.userProvider.get(recipientUserId)
      //Aqui é obeservado apenas um único valor o primeiro valor encontrado pelo "userService.get"
      .first()
      //Aqui vamos sobreescrever a o objeto, classe "User"
      .subscribe((user: User) => {
        //Aqui o usuário é direcionado para a página de "Chat" com o parâmetro "recipientUser" que é na verdade o usuário que ele selecionou
        this.navCtrl.push( ChatPage, {
          recipientUser: user
        });

      });

  }

  //Método responsável por direcionar o usuário para a  página de "Signup"  de registro, para ele se cadastrar no sistema
  onSignup(): void {
    this.navCtrl.push( SignupPage );
  }  

}
