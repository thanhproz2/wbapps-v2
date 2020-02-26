import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsOfServiceComponent } from './terms-of-service.component';
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
        component: TermsOfServiceComponent
      }
    ]
  }
];

@NgModule({
  declarations: [TermsOfServiceComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule]
})
export class TermsOfServiceModule {}
