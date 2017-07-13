import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryEditFotoPage } from './category-edit-foto';

@NgModule({
  declarations: [
    CategoryEditFotoPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoryEditFotoPage),
  ],
  exports: [
    CategoryEditFotoPage
  ]
})
export class CategoryEditFotoPageModule {}
