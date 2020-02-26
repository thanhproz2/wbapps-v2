import { Injectable } from '@angular/core';
import { ApiUrl } from '../utils/apiUrl';
import { ApiService } from './api.service';

declare var moment: any;
@Injectable({
  providedIn: 'root'
})
export class EarningsService {

  constructor(private apiUrl: ApiUrl, private apiService: ApiService) { }

  getUserId() {
    return localStorage.getItem('userid');
  }

  getMyRevenue(index, limit, fromDate, toDate) {
    var fromDate = moment(fromDate);
    var toDate = moment(toDate);
    var req = {
      url: this.apiUrl.get_revenue.replace('{memberId}', this.getUserId()),
      params: {
        fromDate: fromDate.startOf('day').format("YYYY-MM-DD HH:mm:ss"),
        toDate: toDate.endOf('day').format("YYYY-MM-DD HH:mm:ss"),
        index: index,
        limit: limit
      }
    };

    return this.apiService.httpGet(req.url, req.params);
  }

  getEarningsReport(index, limit, fromDate, toDate) {
    var fromDate = moment(fromDate);
    var toDate = moment(toDate);
    var req = {
        url: this.apiUrl.get_earnings_report.replace('{memberId}', this.getUserId()),
        params: {
            fromDate: fromDate.startOf('day').format("YYYY-MM-DD HH:mm:ss"),
            toDate: toDate.endOf('day').format("YYYY-MM-DD HH:mm:ss"),
            index: index,
            limit: limit
        }
    };
    
    return this.apiService.httpGet(req.url, req.params);
  }

  getPaymentHistory(index, limit) {
    var url = this.apiUrl.get_payment_history.replace('{memberId}', this.getUserId());
    var params = {
      index: index,
      limit: limit
    }
    return this.apiService.httpGet(url, params);
  }

  getAnnualSummary() {
    var result = {
      Data: [],
      TaxWitheld: 0,
      Revenue: 0,
      NumberOfTransactions: 0
    };

    return result;
  }

  countEarnings(fromDate, toDate) {
    var url = this.apiUrl.count_earnings.replace('{memberId}', this.getUserId());

    fromDate = moment(fromDate);
    toDate = moment(toDate);
    
    var myParams = {
      fromDate: fromDate.startOf('day').format("YYYY-MM-DD HH:mm:ss"),
      toDate: toDate.endOf('day').format("YYYY-MM-DD HH:mm:ss"),
    }

    return this.apiService.httpGet(url, myParams);
  }

  getTotalEarnedAnnual(year) {
    var url = this.apiUrl.annual_summary.replace('{memberId}', this.getUserId());
    var myParams = {
      year: year
    }

    return this.apiService.httpGet(url, myParams);
  }
}
