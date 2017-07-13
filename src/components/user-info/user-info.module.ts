import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { UserInfoComponent } from './user-info';

@NgModule({
  declarations: [
    UserInfoComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    UserInfoComponent
  ]
})
export class UserInfoComponentModule {}
