import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InitialPage } from './initial';

@NgModule({
  declarations: [
    InitialPage,
  ],
  imports: [
    IonicPageModule.forChild(InitialPage),
  ],
  exports: [
    InitialPage
  ]
})
export class InitialPageModule {}
