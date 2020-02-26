import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyProfileComponent } from './my-profile.component';
import { InfoComponent } from './info/info.component';
import { PasswordComponent } from './password/password.component';
import { SettingsComponent } from './settings/settings.component';
import { AvatarComponent } from './avatar/avatar.component';

const routes: Routes = [
  {
    path: '',
    component: MyProfileComponent,
    children: [
      {
        path: '',
        redirectTo: 'personal-info',
        pathMatch: 'full'
      },
      {
        path: 'personal-info',
        component: InfoComponent
      },
      {
        path: 'change-avatar',
        component: AvatarComponent
      },
      {
        path: 'change-password',
        component: PasswordComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyProfileRoutingModule {}
