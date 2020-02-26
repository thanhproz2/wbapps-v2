import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LegalFormsRoutingModule } from './legal-forms-routing.module';
import { LegalFormsComponent } from './legal-forms.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [LegalFormsComponent],
  imports: [
    CommonModule,
    LegalFormsRoutingModule,
    TranslateModule
  ]
})
export class LegalFormsModule { }
