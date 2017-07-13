import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StateGeneralDetailsPage } from './state-general-details';

@NgModule({
  declarations: [
    StateGeneralDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(StateGeneralDetailsPage),
  ],
  exports: [
    StateGeneralDetailsPage
  ]
})
export class StateGeneralDetailsPageModule {}
