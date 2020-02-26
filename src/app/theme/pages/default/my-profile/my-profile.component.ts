import { Component, OnInit } from '@angular/core';
import { AccountProfile } from 'src/app/models/account.model';
import { AccountService } from 'src/app/services/account.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { Utils } from 'src/app/utils/utils';
import * as _ from 'underscore';

declare var $: any;
declare var mApp: any;
declare var toastr: any;
@Component({
  selector: 'app-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  public user: AccountProfile = new AccountProfile();
  public profileSetting: AccountProfile = new AccountProfile();
  public accountInfo: AccountProfile = new AccountProfile();
  public objectKeys = Object.keys;
  public masterData: any;
  public socials: any;
  public addSocial: boolean = false;
  public privacy_setting: any = {
    earingMyFootage: true,
    earingSharedFootage: true,
    chatEmailNotify: true
  };
  public fullSocial: boolean = false;
  public addsocialMediaAddress: string = '';
  public addsocialMedia: string = '';
  public editSocialLink: any = {
    name: '',
    link: ''
  };
  public data: any;
  public device: string;
  public payoutNumber: string = '';
  public userAvatarUrlW: string = '';
  copyStatus: boolean = false;
  constructor(
    private _accountService: AccountService,
    private _commonService: CommonService,
    private _router: Router,
    private utils: Utils,
  ) {
    this.masterData = {
      payoutMethods: _commonService.getPayoutMethods(),
      roles: this._commonService.getMemberRoles(),
      addressTypes: _commonService.getAddressTypes(),
      countries: this._commonService.getCountries(),
      socials: this._commonService.getListSocialMedia()
    };
  }

  ngOnInit() {
    mApp.unblockPage();
    var self = this;
    self.data;
    var userId = localStorage.getItem('userid');
    if (userId == null) {
      self._router.navigate(['/login']);
    } else {
      self.device = self.utils.device();
      self.getAvartar();
      self.getProfile();
    }
  }

  getAvartar() {
    var self = this;
    self.userAvatarUrlW = self._accountService.getAvartars();
  }

  getAvartaHeader() {
    var self = this;
    // self.myBlackboxComponent.getAvartar();
  }

  getProfile(): void {
    var self = this;
    mApp.blockPage();
    self._accountService.getProfile().then(
      (res: any) => {
        if (res) {
          self.user = res;
          console.log(self.user);
          self.user.address = res.Addresses[0];
          if (self.user.Profile.payoutMethod == null) {
            self.user.Profile.payoutMethod = 'paypal';
          }
          if (self.user.Profile.payoutMethod == 'payoneer') {
            self.payoutNumber = self.user.Profile.payoutName;
            self.user.Profile.payoutName = '';
          }
          self.user.referralLink =
            location.origin + '/login?code=' + res.referralCode;
          self.user.Profile.settings = self.user.Profile.settings
            ? JSON.parse(self.user.Profile.settings)
            : {};
          if (self.user.Profile.settings.notify == undefined) {
            self.user.Profile.settings.notify = {
              earingMyFootage: true,
              earingSharedFootage: true
            };
          }
          if (self.user.Profile.settings.social == undefined) {
            self.user.Profile.settings.social = {};
          }

          if (self.user.Profile.acceptPolicyValue) {
            self.user.Profile.firstPolicy = true;
            self.user.Profile.secondPolicy = true;
            self.user.Profile.thirdPolicy = true;
            self.user.Profile.fourPolicy = true;
          }
          self.user.reUserName = self.user.username;
          var accountInfo = JSON.stringify(self.user);
          self.accountInfo = JSON.parse(accountInfo);
          var profileSetting = JSON.stringify(self.user);
          self.profileSetting = JSON.parse(profileSetting);
          var socialMediaAddress = self.user.Profile.settings.social;
          socialMediaAddress = self.objectKeys(socialMediaAddress);
          socialMediaAddress = _.map(socialMediaAddress, item => {
            var object: any = {};
            object.name = item;
            object.link = self.user.Profile.settings.social[item];
            object.class = 'fa fa-' + item;
            return object;
          });
          self.socials = socialMediaAddress;
          self.removeSocialList();
        } else {
          toastr.error('', 'Error');
        }
        mApp.unblockPage();
      },
      function(error) {
        console.log(error);
      }
    );
  }

  removeSocialList() {
    var self = this;
    var social = self.masterData.socials;
    _.map(self.socials, items => {
      social = _.reject(social, item => {
        return items.name == item.value;
      });
    });
    self.masterData.socials = social;
    if (social.length == 0) {
      self.fullSocial = true;
    } else {
      self.fullSocial = false;
    }
  }

  addSocials() {
    var self = this;
    self.addSocial = true;
  }

  cancel() {
    var self = this;
    self.addSocial = false;
  }

  saveProfileSettings() {
    var self = this;
    var socials = self.socials;
    var socialList: any = {};
    var social = {
      name: self.addsocialMedia,
      link: self.addsocialMediaAddress,
      class: 'fa fa-' + self.addsocialMedia
    };
    socials.push(social);
    self.socials = socials;
    socials.forEach(element => {
      socialList[element.name] = element.link;
    });
    self.addsocialMedia = '';
    self.addsocialMediaAddress = '';
    self.removeSocialList();

    self.addSocial = false;
    self.user.Profile.settings.social = socialList;
    self._accountService
      .updateProfileSettings(self.user.Profile.settings)
      .then((res: any) => {
        res = res.json();
        if (res.success) {
          toastr.success('Added social successfully!', 'Success');
        } else {
          self.getProfile();
        }
      });
  }

  dataModal(social: any) {
    var self = this;
    self.editSocialLink.name = social.name;
    self.editSocialLink.link = social.link;
  }

  editSocial() {
    var self = this;
    self.removeSocialLink();
    var socials = self.socials;
    var socialList: any = {};
    var social = self.editSocialLink;
    socials.push(social);
    socials.forEach(element => {
      socialList[element.name] = element.link;
    });
    self.user.Profile.settings.social = socialList;
    self._accountService
      .updateProfileSettings(self.user.Profile.settings)
      .then(
        (res: any) => {
          res = res.json();
          if (res.success == true) {
            toastr.success('Edited successfully!', 'Success');
            self.ngOnInit();
            $('#edit-social').modal('hide');
          } else {
            toastr.error('', 'Error');
          }
        },
        function(error) {
          console.log(error);
        }
      );
  }

  removeSocialLink() {
    var self = this;
    var social = self.socials;
    social = _.reject(social, item => {
      return self.editSocialLink.name == item.name;
    });
    self.socials = social;
  }

  deleteSocial() {
    var self = this;
    self.removeSocialLink();
    var socials = self.socials;
    var socialList: any = {};
    socials.forEach(element => {
      socialList[element.name] = element.link;
    });
    self.user.Profile.settings.social = socialList;
    self._accountService
      .updateProfileSettings(self.user.Profile.settings)
      .then(
        (res: any) => {
          console.log(res);
          res = res.json();
          if (res.success == true) {
            toastr.success('Deleted successfully!', 'Success');
            $('#delete-social').modal('hide');
            self.masterData.socials = self._commonService.getListSocialMedia();
            self.removeSocialList();
          } else {
            toastr.error('');
          }
        },
        function(error) {
          console.log(error);
        }
      );
  }

  copyReferral(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    toastr.success('Copied successfully!', 'Success');
  }

  acctiveInfoTab() {
    $('#profileTab a[href="#tab_1_1"]').tab('show');
  }

  acctiveChangeAvatarTab() {
    $('#profileTab a[href="#tab_1_2"]').tab('show');
  }

  openLink(link) {
    if (link && link.indexOf('http') === 0) {
      return window.open(link);
    }
    return window.open('//' + link);
  }
}
