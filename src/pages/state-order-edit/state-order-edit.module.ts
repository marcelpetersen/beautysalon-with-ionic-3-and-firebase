import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StateOrderEditPage } from './state-order-edit';

@NgModule({
  declarations: [
    StateOrderEditPage,
  ],
  imports: [
    IonicPageModule.forChild(StateOrderEditPage),
  ],
  exports: [
    StateOrderEditPage
  ]
})
export class StateOrderEditPageModule {}
