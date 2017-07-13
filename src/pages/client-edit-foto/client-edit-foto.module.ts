import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientEditFotoPage } from './client-edit-foto';

@NgModule({
  declarations: [
    ClientEditFotoPage,
  ],
  imports: [
    IonicPageModule.forChild(ClientEditFotoPage),
  ],
  exports: [
    ClientEditFotoPage
  ]
})
export class ClientEditFotoPageModule {}
