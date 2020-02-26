import { Injectable } from '@angular/core';
import { ApiUrl } from '../utils/apiUrl';
import { ApiService } from './api.service';
import { Constants } from '../utils/constants';
import { AuthenticateService } from './authenticate.service';
import { Subject } from 'rxjs';

declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  avatarSubject = new Subject<string>();

  constructor(
    private apiUrl: ApiUrl,
    private apiService: ApiService,
    private authenticateService: AuthenticateService,
    private constants: Constants
  ) {}

  setAvatarUrl(url) {
    this.avatarSubject.next(url);
  }

  isAdmin() {
    if (localStorage.getItem('isAdmin') === 'true') {
      return true;
    }
    return false;
  }

  showAdmin() {
    if (
      localStorage.getItem('isMarketingManagement') === 'true' ||
      localStorage.getItem('isSaleManagement') === 'true'
    ) {
      return true;
    }
    return false;
  }

  hasRole(role) {
    const identity: any = localStorage.getItem('roles');
    if (identity) {
      return true;
    }
    return false;
  }

  login(loginData) {
    console.log(this.apiUrl.login);
    return this.apiService.httpPost(this.apiUrl.login, loginData);
  }

  getPassword(email) {
    return this.apiService.httpPost(this.apiUrl.forgot_password, email);
  }

  logOut() {
    const self = this;
    const url = self.apiUrl.logout.replace('{memberId}', self.getUserId());
    return self.apiService.httpGet(url);
  }

  unRegister(registerData) {
    return this.apiService.httpPost(this.apiUrl.unRegister, registerData);
  }

  register(registerData) {
    return this.apiService.httpPost(this.apiUrl.register, registerData);
  }

  getProfile(id?) {
    let memberId = localStorage.getItem('userid');
    if (id) {
      memberId = id;
    }
    return this.apiService.httpGet(
      this.apiUrl.member_info.replace('{memberId}', memberId)
    );
  }

  updateInfo(user) {
    const memberId = localStorage.getItem('userid');
    let myData = user;
    myData = this.removeNullElement(myData);
    return this.apiService.httpPut(
      this.apiUrl.member_info.replace('{memberId}', memberId),
      myData
    );
  }

  removeNullElement(object) {
    if (typeof object === 'object' && object !== null) {
      for (const i in object) {
        if (typeof object[i] === 'object' && object[i] !== null) {
          object[i] = this.removeNullElement(object[i]);
        } else {
          if (
            object[i] === null ||
            i === 'updatedAt' ||
            i === 'createdAt' ||
            i === 'deletedAt'
          ) {
            delete object[i];
          }
        }
      }
    }

    return object;
  }

  getSocialSettings() {
    const memberId = localStorage.getItem('userid');
    return this.apiService.httpGet(
      this.apiUrl.profile_settings.replace('{memberId}', memberId)
    );
  }

  getUserId() {
    return localStorage.getItem('userid');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  updatePwd(password: any) {
    const memberId = localStorage.getItem('userid');
    return this.apiService.httpPost(
      this.apiUrl.update_password.replace('{memberId}', memberId),
      password
    );
  }

  acceptMemberAgreement() {
    const memberId = localStorage.getItem('userid');
    return this.apiService.httpPost(
      this.apiUrl.accept_agreement.replace('{memberId}', memberId),
      {}
    );
  }

  updateProfileSettings(info) {
    const memberId = localStorage.getItem('userid');
    return this.apiService.httpPut(
      this.apiUrl.profile_settings.replace('{memberId}', memberId),
      info
    );
  }

  getAvartars() {
    const self = this;
    const memberId = self.getUserId();
    const userAvatarUrlW =
      self.apiUrl.get_avatar
        .replace('{memberId}', memberId)
        .replace('{defaultType}', 'W') +
      '?' +
      new Date().getTime();
    return userAvatarUrlW;
  }

  changeCuration(info) {
    const memberId = localStorage.getItem('userid');
    return this.apiService.httpPut(
      this.apiUrl.changeCuration.replace('{memberId}', memberId),
      info
    );
  }

  isStuckedFootageReviewer() {
    const roles = localStorage.getItem('roles');
    if (roles) {
      return roles.indexOf('stucked footage reviewer') > -1;
    }
    return false;
  }

  isAdminReviewer() {
    const roles: any = localStorage.getItem('roles');
    console.log('roles: ', roles);
    return roles.indexOf('deferred footage reviewer') > -1;
  }

  resetPassword(token, password) {
    const myUrl = this.apiUrl.reset_password;
    const myData = {
      token,
      password
    };

    return this.apiService.httpPost(myUrl, myData);
  }
}
