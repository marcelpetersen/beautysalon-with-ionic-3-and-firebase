import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StateLevelDetailsPage } from './state-level-details';

@NgModule({
  declarations: [
    StateLevelDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(StateLevelDetailsPage),
  ],
  exports: [
    StateLevelDetailsPage
  ]
})
export class StateLevelDetailsPageModule {}
