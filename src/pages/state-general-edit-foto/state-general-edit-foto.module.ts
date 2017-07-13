import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StateGeneralEditFotoPage } from './state-general-edit-foto';

@NgModule({
  declarations: [
    StateGeneralEditFotoPage,
  ],
  imports: [
    IonicPageModule.forChild(StateGeneralEditFotoPage),
  ],
  exports: [
    StateGeneralEditFotoPage
  ]
})
export class StateGeneralEditFotoPageModule {}
