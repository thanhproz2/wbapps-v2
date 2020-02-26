import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/utils/constants';
import { EarningsService } from 'src/app/services/earnings.service';

declare var mApp: any;

@Component({
  selector: 'app-my-earnings',
  templateUrl: './my-earnings.component.html',
  styles: []
})
export class MyEarningsComponent implements OnInit {
  href: string = '';
  activated: boolean = true;
  masterData: any;
  total: any = {
    myRevenue: 0,
    totalEarningsReport: 0,
    paymentHistory: 0
  };
  public isAnnualSummary: boolean;

  constructor(
    private router: Router,
    private constants: Constants,
    private earningService: EarningsService
  ) {
    this.isAnnualSummary = !constants.myEarningConfig.hide_annualSunmary;
  }
  ngOnInit(): void {
    mApp.unblockPage();
    var self = this;
    var toDate = new Date();
    var fromDate = new Date();

    fromDate.setMonth(
      fromDate.getMonth() - this.constants.myEarningConfig.query_months
    );

    this.countEarnings(fromDate, toDate);
  }

  countEarnings(fromDate, toDate) {
    var self = this;

    self.earningService.countEarnings(fromDate, toDate).then(result => {
      if (result) {
        this.total = result;
      }
    });
  }
}
