import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientEditPage } from './client-edit';

@NgModule({
  declarations: [
    ClientEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ClientEditPage),
  ],
  exports: [
    ClientEditPage
  ]
})
export class ClientEditPageModule {}
