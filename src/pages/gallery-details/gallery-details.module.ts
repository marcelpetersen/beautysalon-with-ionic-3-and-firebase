import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GalleryDetailsPage } from './gallery-details';

@NgModule({
  declarations: [
    GalleryDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(GalleryDetailsPage),
  ],
  exports: [
    GalleryDetailsPage
  ]
})
export class GalleryDetailsPageModule {}
