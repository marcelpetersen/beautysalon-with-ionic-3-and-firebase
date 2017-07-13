import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriverEditFotoPage } from './driver-edit-foto';

@NgModule({
  declarations: [
    DriverEditFotoPage,
  ],
  imports: [
    IonicPageModule.forChild(DriverEditFotoPage),
  ],
  exports: [
    DriverEditFotoPage
  ]
})
export class DriverEditFotoPageModule {}
