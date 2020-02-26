import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyEarningsComponent } from './my-earnings.component';
import { MyRevenueComponent } from './my-revenue/my-revenue.component';
import { TotalEarningsReportComponent } from './total-earnings-report/total-earnings-report.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { AnnualSummaryComponent } from './annual-summary/annual-summary.component';

const routes: Routes = [
  {
    path: '',
    component: MyEarningsComponent,
    children: [
      {
        path: '',
        redirectTo: 'my-revenue',
        pathMatch: 'full'
      },
      {
        path: 'my-revenue',
        component: MyRevenueComponent
      },
      {
        path: 'total-earnings-report',
        component: TotalEarningsReportComponent
      },
      {
        path: 'payment-history',
        component: PaymentHistoryComponent
      },
      {
        path: 'annual-summary',
        component: AnnualSummaryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyEarningsRoutingModule {}
