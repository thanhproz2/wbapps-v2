import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyBlackboxRoutingModule } from './my-blackbox-routing.module';
import { MyBlackboxComponent } from './my-blackbox.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MyBlackboxComponent],
  imports: [CommonModule, MyBlackboxRoutingModule, TranslateModule]
})
export class MyBlackboxModule {}
