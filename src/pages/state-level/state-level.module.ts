import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StateLevelPage } from './state-level';

@NgModule({
  declarations: [
    StateLevelPage,
  ],
  imports: [
    IonicPageModule.forChild(StateLevelPage),
  ],
  exports: [
    StateLevelPage
  ]
})
export class StateLevelPageModule {}
