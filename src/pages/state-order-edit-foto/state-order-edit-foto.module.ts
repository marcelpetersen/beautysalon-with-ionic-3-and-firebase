import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StateOrderEditFotoPage } from './state-order-edit-foto';

@NgModule({
  declarations: [
    StateOrderEditFotoPage,
  ],
  imports: [
    IonicPageModule.forChild(StateOrderEditFotoPage),
  ],
  exports: [
    StateOrderEditFotoPage
  ]
})
export class StateOrderEditFotoPageModule {}
