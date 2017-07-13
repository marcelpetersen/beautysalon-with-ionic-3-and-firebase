import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StateOrderPage } from './state-order';

@NgModule({
  declarations: [
    StateOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(StateOrderPage),
  ],
  exports: [
    StateOrderPage
  ]
})
export class StateOrderPageModule {}
