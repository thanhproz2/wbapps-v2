import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgreementRoutingModule } from './agreement-routing.module';
import { AgreementComponent } from './agreement.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AgreementComponent],
  imports: [CommonModule, AgreementRoutingModule, TranslateModule]
})
export class AgreementModule {}
