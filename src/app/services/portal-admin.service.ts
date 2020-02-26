import { Injectable } from '@angular/core';
import { ApiUrl } from '../utils/apiUrl';
import { ApiService } from './api.service';

declare var moment: any;
@Injectable({
  providedIn: 'root'
})
export class PortalAdminService {

  constructor(private apiUrl: ApiUrl, private apiService: ApiService) { }

  getUserId() {
    return localStorage.getItem('userid');
  }

  getMemberReporting(index: number, limit: number, keywords: string){
    var url = this.apiUrl.member_reporting.replace('{adminId}', this.getUserId());
    var params = {
      index: index,
      limit: limit,
      keywords: keywords.trim()
    }
    
    return this.apiService.httpGet(url, params);
  }

  getMemberReportingDetails(memberId: string) {
    var url = this.apiUrl.member_reporting_details.replace('{adminId}', this.getUserId())
    .replace('{memberId}', memberId);

    return this.apiService.httpGet(url);
  }

  payout(memberId: string, payoutIds: any){
    var url = this.apiUrl.payout_for_member.replace('{adminId}', this.getUserId())
    .replace('{memberId}', memberId);

    return this.apiService.httpPost(url, payoutIds);
  }

  getNextPayouts(index: number, limit: number, status: string, keywords: string, fromD: any, toD: any) {
    var url = this.apiUrl.get_next_payout.replace('{adminId}', this.getUserId());
    var fromDate = moment(fromD);
    var toDate = moment(toD);
    var myParams: any = {
      status: status,
      keywords: keywords.trim(),
      fromDate: fromDate.startOf('day').format("YYYY-MM-DD HH:mm:ss"),
      toDate: toDate.endOf('day').format("YYYY-MM-DD HH:mm:ss")
  };

  if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
  }

  return this.apiService.httpGet(url, myParams);
  }

  submitDeleteProfile(id: string){
    var url = this.apiUrl.delete_profile.replace('{memberId}', id).replace('{adminId}', this.getUserId());

    return this.apiService.httpDelete(url);
  }

  updatePayoutExclusion(infoUpdate) {
    var url = this.apiUrl.change_payout_exclusion.replace('{adminId}', this.getUserId());

    return this.apiService.httpPost(url, infoUpdate);
  }
}
