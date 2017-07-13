import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StateOrderDetailsPage } from './state-order-details';

@NgModule({
  declarations: [
    StateOrderDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(StateOrderDetailsPage),
  ],
  exports: [
    StateOrderDetailsPage
  ]
})
export class StateOrderDetailsPageModule {}
