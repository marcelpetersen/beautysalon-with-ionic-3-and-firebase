import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StateGeneralPage } from './state-general';

@NgModule({
  declarations: [
    StateGeneralPage,
  ],
  imports: [
    IonicPageModule.forChild(StateGeneralPage),
  ],
  exports: [
    StateGeneralPage
  ]
})
export class StateGeneralPageModule {}
