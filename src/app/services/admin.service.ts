import { Injectable } from '@angular/core';
import { ApiUrl } from '../utils/apiUrl';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private apiUrl: ApiUrl, private apiService: ApiService) { }

  getUserId() {
    return localStorage.getItem('userid');
  }

  getNotifications(index, limit) {
    var myUrl = this.apiUrl.admin_get_notifications.replace('{adminId}', this.getUserId());
    var myParams: any = {};

    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }

    return this.apiService.httpGet(myUrl, myParams);
  }

  createNotification(notification) {
    var myUrl = this.apiUrl.admin_create_notification.replace('{adminId}', this.getUserId());

    return this.apiService.httpPost(myUrl, notification);
  }

  updateNotification(notification) {
    var myUrl = this.apiUrl.admin_update_notification.replace('{adminId}', this.getUserId()).replace('{notificationId}', notification.notificationId);

    return this.apiService.httpPut(myUrl, notification);
  }

  deleteNotification(notification) {
    var myUrl = this.apiUrl.admin_update_notification.replace('{adminId}', this.getUserId()).replace('{notificationId}', notification.notificationId);

    return this.apiService.httpDelete(myUrl);
  }

  // Manage members
  getAccountList(index, limit, tags, status, statusApproved, memberAttribute?: string) {
    var myUrl = this.apiUrl.get_member_list_by_admin.replace("{adminId}", this.getUserId());;
    var myParams: any = {
      index: index,
      limit: limit,
      tags: tags.trim(),
      status: status,
      statusApproved: statusApproved,
      memberAttribute: memberAttribute ? memberAttribute : ""
    };
    return this.apiService.httpGet(myUrl, myParams);
  }

  getSummaryInfo(search: string) {
    var req = {
      url: this.apiUrl.admin_summary_info.replace("{adminId}", this.getUserId()),
      params: search
    };

    return this.apiService.httpGet(req.url, req.params);
  }

  getMemberListByStatus(status) {
  var url = this.apiUrl.get_members_by_status.replace('{admin}', this.getUserId()).replace('{status}', status);

  return this.apiService.httpGet(url);
  }

  getMemberNotMadeSales(){
    var url = this.apiUrl.get_members_not_made_sales.replace('{admin}', this.getUserId());

    return this.apiService.httpGet(url);
  }

  sendMail(emails, content) {
    var myUrl = this.apiUrl.send_mail.replace('{adminId}', this.getUserId());
    var model = {
      emails: emails,
      content: content
    }
    return this.apiService.httpPost(myUrl, model);
  }

  getSocialMediaInfo(emails) {
    var myUrl = this.apiUrl.export_social_media_info.replace('{adminId}', this.getUserId());
    var data = {
      emails: emails
    };

    return this.apiService.httpPost(myUrl, data);
  }

  changeReferralPercentage(memberIds, referralPercentage) {
    var myUrl = this.apiUrl.change_referral_percentage.replace('{adminId}', this.getUserId());
    var data = {
      ids: memberIds,
      referralPercentage: referralPercentage
    };

    return this.apiService.httpPost(myUrl, data);
  }

  getMemberProfile(memberId) {
    var myUrl = this.apiUrl.get_member_profile_by_admin.replace('{memberId}', memberId).replace('{adminId}', this.getUserId());

    return this.apiService.httpGet(myUrl);
  }

  viewGovernmentID(memberId) {
    var myUrl = this.apiUrl.governmentID.replace('{memberId}', memberId).replace('{adminId}', this.getUserId());

    return this.apiService.httpGet(myUrl);
  }

  approveGovt(memberId) {
    var myUrl = this.apiUrl.admin_approve_govt_ID.replace('{memberId}', memberId).replace('{adminId}', this.getUserId());
    var data = {
      govtIDStatus: "approved"
    };

    return this.apiService.httpPut(myUrl, data);
  }

  declineGovt(memberId) {
    var myUrl = this.apiUrl.admin_decline_govt_ID.replace('{memberId}', memberId).replace('{adminId}', this.getUserId());
    var data = {
      govtIDStatus: "declined"
    };

    return this.apiService.httpPut(myUrl, data);
  }

  updateMemberInfo(user: any){
    var myData = this.removeNullElement(user);
    var myUrl = this.apiUrl.update_member_profile_by_admin.replace('{memberId}', user.id)
    .replace('{adminId}', this.getUserId());

    return this.apiService.httpPut(myUrl, myData);
  }

  removeNullElement(object) {
    if (typeof object === 'object' && object !== null) {
      for (var i in object) {
        if (typeof object[i] === 'object' && object[i] !== null) {
          object[i] = this.removeNullElement(object[i]);
        } else {
          if (object[i] === null) {
            delete object[i];
          }
        }
      }
    }

    return object;
  }

  submitApproveProfile(id: string, comments?) {
    const url = this.apiUrl.approve_profile.replace('{memberId}', id).replace('{adminId}', this.getUserId());
    const body: any = {};
    if (comments) {
      body.comments = comments;
    }

    return this.apiService.httpPost(url, body);
  }

  submitDeclineProfile(id, rejectionReason) {
    var url = this.apiUrl.decline_profile.replace('{memberId}', id).replace('{adminId}', this.getUserId());
    var data = {
      rejectionReason: rejectionReason
    }

    return this.apiService.httpPost(url, data);
  }

  getMembers(index: number, limit: number, memberId: string, filter?: string){
    var myUrl = this.apiUrl.get_members_by_role.replace('{role}', 'all')
    .replace("{userId}", this.getUserId());
    var myParams = {
      index: index,
      limit: limit,
      filter: filter ? filter.trim() : '',
      notMemberId: memberId
    }

    return this.apiService.httpGet(myUrl, myParams);
  }

  updateReferral(memberId, referralBy, referralPercentage?) {
    const myUrl = this.apiUrl.update_referral.replace('{adminId}', this.getUserId());
    const myParams = {
      memberId: memberId,
      referralBy: referralBy,
      referralPercentage: referralPercentage
    };

    return this.apiService.httpPost(myUrl, myParams);
  }

  removeReferral(memberId) {
    const myUrl = this.apiUrl.remove_referral.replace('{adminId}', this.getUserId()).replace('{memberId}', memberId);

    return this.apiService.httpDelete(myUrl);
  }

  loginByAdmin(username: string){
    var myUrl = this.apiUrl.loginByAdmin.replace('{memberId}', this.getUserId());
    var myParams = {
      username: username
    }
    return this.apiService.httpPost(myUrl, myParams);
  }

  resetAccount(id: any){
    var myUrl = this.apiUrl.reset_account.replace('{memberId}', id).replace('{adminId}', this.getUserId());

    return this.apiService.httpPost(myUrl, {});
  }

  lockMember(id: any){
    var myUrl = this.apiUrl.lock_member.replace('{memberId}', id).replace('{adminId}', this.getUserId());

    return this.apiService.httpPost(myUrl, {});
  }

  unlockMember(id: any) {
    var myUrl = this.apiUrl.unlock_member.replace('{memberId}', id).replace('{adminId}', this.getUserId());

    return this.apiService.httpPost(myUrl, {});
  }
  statisticalFootageStatus(site: any, type: any, fromDate: any, toDate: any) {
    var myUrl = this.apiUrl.statistical_footage_status.replace('{adminId}', this.getUserId())
    .replace('{site}', site).replace('{type}', type)
    .replace('{fromDate}', fromDate).replace('{toDate}', toDate);

    return this.apiService.httpGet(myUrl, {});
  }

  getChangeSharingRequests() {
    var myUrl = this.apiUrl.change_sharing_requests.replace('{adminId}', this.getUserId());

    return this.apiService.httpGet(myUrl);
  }

  approveChangeSharingRequest(projectInfo) {
    var myUrl = this.apiUrl.approve_request.replace('{adminId}', this.getUserId());
    var body = {
      projectInfo: projectInfo
    }
    return this.apiService.httpPost(myUrl, body);
  }
}
