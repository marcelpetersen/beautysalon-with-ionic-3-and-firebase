import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriverDetailsPage } from './driver-details';

@NgModule({
  declarations: [
    DriverDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(DriverDetailsPage),
  ],
  exports: [
    DriverDetailsPage
  ]
})
export class DriverDetailsPageModule {}
