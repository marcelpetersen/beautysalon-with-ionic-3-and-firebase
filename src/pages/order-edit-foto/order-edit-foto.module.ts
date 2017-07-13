import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderEditFotoPage } from './order-edit-foto';

@NgModule({
  declarations: [
    OrderEditFotoPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderEditFotoPage),
  ],
  exports: [
    OrderEditFotoPage
  ]
})
export class OrderEditFotoPageModule {}
