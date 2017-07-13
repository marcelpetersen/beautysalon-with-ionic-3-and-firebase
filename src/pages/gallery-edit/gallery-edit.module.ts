import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GalleryEditPage } from './gallery-edit';

@NgModule({
  declarations: [
    GalleryEditPage,
  ],
  imports: [
    IonicPageModule.forChild(GalleryEditPage),
  ],
  exports: [
    GalleryEditPage
  ]
})
export class GalleryEditPageModule {}
