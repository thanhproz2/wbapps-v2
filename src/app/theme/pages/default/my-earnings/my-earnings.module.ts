import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyEarningsRoutingModule } from './my-earnings-routing.module';
import { MyEarningsComponent } from './my-earnings.component';
import { TranslateModule } from '@ngx-translate/core';
import { MyRevenueComponent } from './my-revenue/my-revenue.component';
import { TotalEarningsReportComponent } from './total-earnings-report/total-earnings-report.component';
import { AnnualSummaryComponent } from './annual-summary/annual-summary.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';


@NgModule({
  declarations: [MyEarningsComponent, MyRevenueComponent, TotalEarningsReportComponent, AnnualSummaryComponent, PaymentHistoryComponent],
  imports: [
    CommonModule,
    MyEarningsRoutingModule,
    TranslateModule
  ]
})
export class MyEarningsModule { }
