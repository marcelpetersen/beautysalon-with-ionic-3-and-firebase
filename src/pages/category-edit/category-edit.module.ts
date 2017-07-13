import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryEditPage } from './category-edit';

@NgModule({
  declarations: [
    CategoryEditPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoryEditPage),
  ],
  exports: [
    CategoryEditPage
  ]
})
export class CategoryEditPageModule {}
