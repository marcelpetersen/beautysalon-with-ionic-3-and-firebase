import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MessageBoxComponent } from './message-box';

@NgModule({
  declarations: [
    MessageBoxComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    MessageBoxComponent
  ]
})
export class MessageBoxComponentModule {}
