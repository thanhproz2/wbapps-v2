import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyProfileRoutingModule } from './my-profile-routing.module';
import { MyProfileComponent } from './my-profile.component';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { AvatarComponent } from './avatar/avatar.component';
import { InfoComponent } from './info/info.component';
import { PasswordComponent } from './password/password.component';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  declarations: [MyProfileComponent, AvatarComponent, InfoComponent, PasswordComponent, SettingsComponent],
  imports: [
    CommonModule,
    MyProfileRoutingModule,
    TranslateModule,
    TooltipModule,
    FormsModule
  ]
})
export class MyProfileModule { }
