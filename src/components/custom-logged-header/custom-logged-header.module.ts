import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CustomLoggedHeaderComponent } from './custom-logged-header';

@NgModule({
  declarations: [
    CustomLoggedHeaderComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    CustomLoggedHeaderComponent
  ]
})
export class CustomLoggedHeaderComponentModule {}
