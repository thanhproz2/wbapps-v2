import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LegalFormsComponent } from './legal-forms.component';

const routes: Routes = [{ path: '', component: LegalFormsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegalFormsRoutingModule { }
