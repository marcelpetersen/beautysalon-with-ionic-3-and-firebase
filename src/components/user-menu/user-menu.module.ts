import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { UserMenuComponent } from './user-menu';

@NgModule({
  declarations: [
    UserMenuComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    UserMenuComponent
  ]
})
export class UserMenuComponentModule {}
