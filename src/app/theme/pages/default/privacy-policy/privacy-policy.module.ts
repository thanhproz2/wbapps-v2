import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from '../default.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: PrivacyPolicyComponent
      }
    ]
  }
];

@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule]
})
export class PrivacyPolicyModule {}
