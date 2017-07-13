import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StateLevelEditPage } from './state-level-edit';

@NgModule({
  declarations: [
    StateLevelEditPage,
  ],
  imports: [
    IonicPageModule.forChild(StateLevelEditPage),
  ],
  exports: [
    StateLevelEditPage
  ]
})
export class StateLevelEditPageModule {}
