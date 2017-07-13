import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StateLevelEditFotoPage } from './state-level-edit-foto';

@NgModule({
  declarations: [
    StateLevelEditFotoPage,
  ],
  imports: [
    IonicPageModule.forChild(StateLevelEditFotoPage),
  ],
  exports: [
    StateLevelEditFotoPage
  ]
})
export class StateLevelEditFotoPageModule {}
