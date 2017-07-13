import { Chat } from './../../models/chat';
import { FirebaseListObservable } from 'angularfire2';
import { Message } from './../../models/message';
import { Component, Input } from '@angular/core';

/**
 * Generated class for the MessageBoxComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */

@Component({
  selector: 'message-box',
  templateUrl: 'message-box.html',
  host: {
    '[style.justify-content]': '((!isFromSender) ? "flex-start" : "flex-end")',
    '[style.text-align]': '((!isFromSender) ? "left" : "right")'
  }
})
export class MessageBoxComponent {

  @Input() message: Message;
  @Input() isFromSender: boolean;

  //Variável responsável por observar todos os "chats"
  chats: FirebaseListObservable<Chat[]>;

  constructor() {}

}
