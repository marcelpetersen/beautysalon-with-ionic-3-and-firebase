import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriverEditPage } from './driver-edit';

@NgModule({
  declarations: [
    DriverEditPage,
  ],
  imports: [
    IonicPageModule.forChild(DriverEditPage),
  ],
  exports: [
    DriverEditPage
  ]
})
export class DriverEditPageModule {}
