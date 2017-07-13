import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderEditPage } from './order-edit';

@NgModule({
  declarations: [
    OrderEditPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderEditPage),
  ],
  exports: [
    OrderEditPage
  ]
})
export class OrderEditPageModule {}
