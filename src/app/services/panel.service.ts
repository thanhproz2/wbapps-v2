import { Injectable } from '@angular/core';
import { ApiUrl } from '../utils/apiUrl';
import { ApiService } from './api.service';
import { Constants } from '../utils/constants';


declare var moment: any;
@Injectable({
  providedIn: 'root'
})
export class PanelService {

  constructor(private apiUrl: ApiUrl, private _apiService: ApiService, private _constants: Constants) { }

  getUserId() {
    var memberId = localStorage.getItem('userid');
    return memberId;
  }

  getSummaryInfo() {
    var self = this;
    var url = self.apiUrl.get_summary_info.replace("{memberId}", self.getUserId());
    return self._apiService.httpGet(url);
  }

  getReferralList(){
    var self = this;
    var url = self.apiUrl.get_referral_members.replace("{memberId}", self.getUserId());
    return self._apiService.httpGet(url);
  }

  getRating(){
    return 0;
  }

  getTrendingData(){
    var self = this;
    var url = self.apiUrl.get_popular_footages;
    return self._apiService.httpGet(url);
  }

  getEarningsChartData(fromD, toD) {
    var self = this;
    var fromDate = moment(fromD);
    var toDate = moment(toD);
    var months = toDate.diff(fromDate, 'months') + 1;

    var req = {
      url: self.apiUrl.get_earning_summary.replace("{memberId}", self.getUserId()),
      params: {
        fromDate: fromDate.startOf('day').format("YYYY-MM-DD HH:mm:ss"),
        toDate: toDate.endOf('day').format("YYYY-MM-DD HH:mm:ss")
      }
    };
    
    return self._apiService.httpGet(req.url, req.params);
  }

  searchAdminFootage(index: number, limit: number, keywords: string) {
    var self = this;
    var url = self.apiUrl.search_admin_footage.replace('{memberId}', self.getUserId());
    var myParams: any = {};
    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }
    if (keywords) {
      myParams.keywords = keywords.trim();
    }
    return self._apiService.httpGet(url, myParams);
  }

  searchAdminProject(index: number, limit: number, keywords: string) {
    var self = this;
    var url = self.apiUrl.search_admin_project.replace('{memberId}', self.getUserId());
    var myParams: any = {};
    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }
    if (keywords) {
      myParams.keywords = keywords.trim(); 
    }
    return self._apiService.httpGet(url, myParams);
  }

  searchFootage(index: number, limit: number, keywords: string) {
    var self = this;
    var url = self.apiUrl.search_footage.replace('{memberId}', self.getUserId());
    var myParams: any = {};
    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }
    if (keywords) {
      myParams.keywords = keywords.trim();
    }
    return self._apiService.httpGet(url, myParams);
  }

  searchProject(index: number, limit: number, keywords: string) {
    var self = this;
    var url = self.apiUrl.search_project.replace('{memberId}', self.getUserId());
    var myParams: any = {};
    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }
    if (keywords) {
      myParams.keywords = keywords.trim();
    }
    return self._apiService.httpGet(url, myParams);
  }

  getRecentlyOnlineFootages() {
    var self = this;
    var url = self.apiUrl.get_recently_online_fooatges.replace('{memberId}', self.getUserId());

    return self._apiService.httpGet(url);
  }

  getNotifications() {
    var self = this;
    var url = self.apiUrl.get_notifications.replace('{memberId}', self.getUserId());

    return self._apiService.httpGet(url);
  }

  updateNotification(notification) {
    var self = this;
    var url = self.apiUrl.read_notification.replace('{memberId}', self.getUserId()).replace('{notificationId}', notification.notificationId);

    return self._apiService.httpPut(url, notification);
  }
  
}
