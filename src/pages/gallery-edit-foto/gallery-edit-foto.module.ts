import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GalleryEditFotoPage } from './gallery-edit-foto';

@NgModule({
  declarations: [
    GalleryEditFotoPage,
  ],
  imports: [
    IonicPageModule.forChild(GalleryEditFotoPage),
  ],
  exports: [
    GalleryEditFotoPage
  ]
})
export class GalleryEditFotoPageModule {}
