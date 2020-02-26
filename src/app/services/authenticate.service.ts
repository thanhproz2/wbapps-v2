import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionData } from '../models/session.data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  private _sessionObject = new BehaviorSubject<SessionData>(null);
  constructor() {
    var token = localStorage.getItem('token');
    if (token != null) {
      var userid = localStorage.getItem('userid'); //put + to convert string to number
      var acceptAgreement = this.convertStringToBoolean(localStorage.getItem('acceptAgreement'));
      var fullname = localStorage.getItem('fullname');
      var username = localStorage.getItem('username');
      var firstName = localStorage.getItem('firstName');
      var isAdmin = this.convertStringToBoolean(localStorage.getItem('isAdmin'));
      var isBroker = this.convertStringToBoolean(localStorage.getItem('isBroker'));
      var isCurator = this.convertStringToBoolean(localStorage.getItem('isCurator'));
      var isFootageReviewer = this.convertStringToBoolean(localStorage.getItem('isisFootageReviewerBroker'));
      var isMediaReviewer = this.convertStringToBoolean(localStorage.getItem('isMediaReviewer'));
      var isMarketingManagement = this.convertStringToBoolean(localStorage.getItem('isMarketingManagement'));
      var isSaleManagement = this.convertStringToBoolean(localStorage.getItem('isSaleManagement'));
      var lastLoginTime = new Date(localStorage.getItem('lastLoginTime'));
      var location = localStorage.getItem('location');
      var message = localStorage.getItem('message');
      var profileComplete = this.convertStringToBoolean(localStorage.getItem('profileComplete'));
      var roles = localStorage.getItem('roles');
      var success = this.convertStringToBoolean(localStorage.getItem('success'));
      var availableCuration = this.convertStringToBoolean(localStorage.getItem('availableCuration'));
      var canActive = this.convertStringToBoolean(localStorage.getItem('canActive'));
      var chatEmailNotify = this.convertStringToBoolean(localStorage.getItem('chatEmailNotify'));
      var rating = localStorage.getItem('rating');

      var sessionData = new SessionData(token, userid, acceptAgreement, fullname, username, isAdmin, isBroker, isCurator, isFootageReviewer, isMediaReviewer, isMarketingManagement, isSaleManagement, lastLoginTime, location, message, profileComplete, roles, success, firstName, availableCuration, canActive, chatEmailNotify, rating);
      this.setSessionData(sessionData);
    }
  }

  setSessionData(val: SessionData): void {
    localStorage.setItem('token', val.token);
    localStorage.setItem('fullname', val.fullname);
    localStorage.setItem('firstName', val.firstName);
    localStorage.setItem('acceptAgreement', val.acceptAgreement.toString());
    localStorage.setItem('isAdmin', val.isAdmin.toString());
    localStorage.setItem('isBroker', val.isBroker.toString());
    localStorage.setItem('isCurator', val.isCurator.toString());
    localStorage.setItem('isFootageReviewer', val.isFootageReviewer.toString());
    localStorage.setItem('isMediaReviewer', val.isMediaReviewer.toString());
    localStorage.setItem('isMarketingManagement', val.isMarketingManagement.toString());
    localStorage.setItem('isSaleManagement', val.isSaleManagement.toString());
    localStorage.setItem('profileComplete', val.profileComplete.toString());
    localStorage.setItem('success', val.success.toString());
    localStorage.setItem('lastLoginTime', val.lastLoginTime.toString());
    localStorage.setItem('username', val.username);
    localStorage.setItem('location', val.location);
    localStorage.setItem('message', val.message);
    localStorage.setItem('roles', val.roles.toString());
    localStorage.setItem('userid', val.userid);
    localStorage.setItem('availableCuration', val.availableCuration.toString());
    localStorage.setItem('canActive', val.canActive.toString());
    localStorage.setItem('chatEmailNotify', val.chatEmailNotify.toString());
    localStorage.setItem('rating', val.rating.toString());
    this._sessionObject.next(val);
  }
  clearSessionData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('fullname');
    localStorage.removeItem('firstName');
    localStorage.removeItem('acceptAgreement');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isBroker');
    localStorage.removeItem('isCurator');
    localStorage.removeItem('isFootageReviewer');
    localStorage.removeItem('isMediaReviewer');
    localStorage.removeItem('isMarketingManagement');
    localStorage.removeItem('isSaleManagement');
    localStorage.removeItem('profileComplete');
    localStorage.removeItem('success');
    localStorage.removeItem('lastLoginTime');
    localStorage.removeItem('username');
    localStorage.removeItem('location');
    localStorage.removeItem('message');
    localStorage.removeItem('roles');
    localStorage.removeItem('userid');
    localStorage.removeItem('chatEmailNotify');
    localStorage.removeItem('rating');
    this._sessionObject.next(null);
  }

  buildSessionData(response: any): SessionData {
    var user = response;
    var sessionData = new SessionData(user.token, user.userid, user.acceptAgreement, user.fullname, user.username, user.isAdmin, user.isBroker, user.isCurator, user.isFootageReviewer, user.isMediaReviewer, user.isMarketingManagement, user.isSaleManagement, user.lastLoginTime, user.location, user.message, user.profileComplete, user.roles, user.success, user.firstName, user.availableCuration, user.canActive, user.chatEmailNotify, user.rating);
    return sessionData;
  }

  getSessionData() {
    return this._sessionObject;
  }
  convertStringToBoolean(val: string): boolean {
    if (val == "true" || val == "yes" || val == "1")
      return true;
    else
      return false;
  }

  saveByUser(info){
    var userId = localStorage.getItem('userid');
    localStorage.setItem(userId, info);
  }

  checkPortalAdminAccess(password: string) {
    return (password == 'blackbox');
  }

  saveInfoAdmin(info){
    localStorage.setItem('infoAdmin', info);
  }

  removeInfoAdmin(){
    localStorage.removeItem('infoAdmin');
  }
}
