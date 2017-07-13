import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StateGeneralEditPage } from './state-general-edit';

@NgModule({
  declarations: [
    StateGeneralEditPage,
  ],
  imports: [
    IonicPageModule.forChild(StateGeneralEditPage),
  ],
  exports: [
    StateGeneralEditPage
  ]
})
export class StateGeneralEditPageModule {}
