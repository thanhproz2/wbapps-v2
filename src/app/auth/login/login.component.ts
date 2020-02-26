import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { AccountService } from 'src/app/services/account.service';
import { Constants } from 'src/app/utils/constants';
import { Router, ActivatedRoute } from '@angular/router';
import { ScriptLoaderService } from 'src/app/services/script-loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/utils/must-match.validator';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Bio } from 'src/app/models/bio.model';
import { CommonService } from 'src/app/services/common.service';
import { ApiUrl } from 'src/app/utils/apiUrl';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/utils/utils';
import * as _ from 'underscore';

declare var $: any;
declare var mApp: any;
declare var mApp: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  public enableReCaptcha: boolean;
  bioData: Bio[];
  unRegisterForm: FormGroup;
  registerForm: FormGroup;
  submitted: boolean = false;
  submittedRegister: boolean = false;
  model = {
    username: '',
    password: '',
    grecaptchaResponse: ''
  };
  public models = {
    username: '',
    email: ''
  };

  private grecaptcha: string;
  private defaultUrl: string;
  public masterData: any;
  public disabledCode: boolean;
  public activatedRoute: any;
  public checkSocial: boolean = false;
  public listReferrers: any = [];
  canReminder: boolean = false;
  isLoading: boolean = false;
  isLogin: boolean = false;
  isUnregister: boolean = false;
  isRegister: boolean = false;
  private valid: boolean = false;
  changePassword: any = {
    newPassword: '',
    ReNewPassword: ''
  };
  loading: boolean = false;
  isChange: boolean = false;
  hideLogin: boolean = false;
  token: string = '';
  required: any = {
    portfolio: true,
    bio: true,
    governmentId: true
  };
  enableReferral = false;

  constructor(
    private _accountService: AccountService,
    private _authenticateService: AuthenticateService,
    private constants: Constants,
    private router: Router,
    private _commonService: CommonService,
    private apiUrl: ApiUrl,
    private activatedRoutes: ActivatedRoute,
    private toastr: ToastrService,
    private utils: Utils,
    private formBuilder: FormBuilder
  ) {
    this.grecaptcha = constants.grecaptcha.sitekey;
    this.masterData = {
      countries: this._commonService.getCountries(),
      roles: this._commonService.getMemberRoles(),
      professionalTypes: this._commonService.getListprofessionalTypes(),
      socials: this._commonService.getListSocialMedia(),
      referralSources: this._commonService.getReferralSources()
    };
    this.bioData = this._commonService.getBioData();
    this.activatedRoute = this.activatedRoutes;
  }

  txtFailedLogin: string = '';
  forgetPassword: boolean = true;
  txtForget: string = '';
  successfulForget: boolean;
  checkEmail: boolean = true;
  captcha: boolean = false;
  register_data: any;
  placeholderModalAnswer: string = '';
  txtFailedRegister: string = '';
  checkCaptcha: boolean = false;
  public patternTelephone: string = '^\\+?(?:[\\d]*$)';
  public patternEmail: string = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$';
  public patternUrl: string =
    "^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$";
  @ViewChild('alertModal') alertModal: ModalDirective;
  get u() {
    return this.unRegisterForm.controls;
  }
  get r() {
    return this.registerForm.controls;
  }
  ngOnInit() {
    mApp.unblockPage();
    this.defaultUrl = '/';
    this.hideLogin = false;
    this.enableReCaptcha = environment.enableReCaptcha;
    if (this.enableReCaptcha == false) {
      this.captcha = true;
    }
    if (localStorage.getItem('userid') != null) {
      var sessionData = this._authenticateService.getSessionData();
      if (this.checkReview(sessionData.value)) {
        return this.router.navigate(['footage_review']);
      }
      this.router.navigate([this.defaultUrl]);
    } else {
      var href = this.router.url;
      if (href == '/register') {
        this.openUnRegister();
      }
      this.newRegister();
      this.government();
      this.referralCode();
      this.codeLogin();
      this.getToken();
    }
  }
  newRegister() {
    var self = this;
    self.unRegisterForm = self.formBuilder.group(
      {
        userType: ['personal'],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        companyName: [''],
        representativeFirstName: [''],
        representativeLastName: [''],
        telephone: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(self.patternTelephone)
          ])
        ],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(self.patternEmail)
          ])
        ],
        confirmEmail: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(self.patternEmail)
          ])
        ],
        city: ['', Validators.required],
        country: ['', Validators.required],
        isValidAge: [false, Validators.requiredTrue]
      },
      {
        validator: MustMatch('email', 'confirmEmail')
      }
    );

    self.registerForm = self.formBuilder.group({
      referrer: [''],
      expertisePrimary: ['', Validators.required],
      expertiseSecondary: [''],
      expertiseTierary: [''],
      professionalType: ['professional media creator'],
      // professionalType: ['professional media creator'],
      sharingWith: [''],
      professionalTypeDescription: ['', Validators.maxLength(512)],
      portfolioLink: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(self.patternUrl)
        ])
      ],
      // preferenceInterests: ['',  Validators.compose([Validators.required, Validators.minLength(20), Validators.maxLength(500)])],
      bioAnswer_1: ['', Validators.compose([Validators.required])],
      bioAnswer_2: ['', Validators.compose([Validators.required])],
      bioAnswer_3: ['', Validators.compose([Validators.required])],
      bioAnswer_4: ['', Validators.compose([Validators.required])],
      bioAnswer_5: ['', Validators.compose([Validators.required])],
      // referralSourceId: ['', Validators.required],
      // referralDescription: ['', Validators.maxLength(512)],
      firstSocial: ['youtube'],
      secondSocial: ['instagram'],
      firstSocialAddress: ['', Validators.pattern(self.patternUrl)],
      secondSocialAddress: ['', Validators.pattern(self.patternUrl)],
      registerValue: self.formBuilder.group({
        disabledCode: [false]
      }),
      HSTRegistrationNumber: [
        '',
        Validators.compose([Validators.pattern(self.patternTelephone)])
      ],
      governmentPath: [''],
      governmentFileName: ['']
    });
  }

  changeUnRegister() {
    var self = this;
    if (self.unRegisterForm.value.userType == 'company') {
      self.unRegisterForm.controls['companyName'].setValidators([
        Validators.required
      ]);
      self.unRegisterForm.controls['representativeFirstName'].setValidators([
        Validators.required
      ]);
      self.unRegisterForm.controls['representativeLastName'].setValidators([
        Validators.required
      ]);
      self.unRegisterForm.controls['firstName'].clearValidators();
      self.unRegisterForm.controls['lastName'].clearValidators();
    }
    if (self.unRegisterForm.value.userType == 'personal') {
      self.unRegisterForm.controls['firstName'].setValidators([
        Validators.required
      ]);
      self.unRegisterForm.controls['lastName'].setValidators([
        Validators.required
      ]);
      self.unRegisterForm.controls['companyName'].clearValidators();
      self.unRegisterForm.controls['representativeFirstName'].clearValidators();
      self.unRegisterForm.controls['representativeLastName'].clearValidators();
    }
    self.unRegisterForm.controls['companyName'].updateValueAndValidity();
    self.unRegisterForm.controls[
      'representativeFirstName'
    ].updateValueAndValidity();
    self.unRegisterForm.controls[
      'representativeLastName'
    ].updateValueAndValidity();
    self.unRegisterForm.controls['firstName'].updateValueAndValidity();
    self.unRegisterForm.controls['lastName'].updateValueAndValidity();
  }

  changeRegister(type: string) {
    var self = this;
    if (type == 'professionalType') {
      self.registerForm.controls['portfolioLink'].clearValidators();
      self.registerForm.controls['sharingWith'].clearValidators();
      self.registerForm.controls['bioAnswer_1'].clearValidators();
      self.registerForm.controls['bioAnswer_2'].clearValidators();
      self.registerForm.controls['bioAnswer_3'].clearValidators();
      self.registerForm.controls['bioAnswer_4'].clearValidators();
      self.registerForm.controls['bioAnswer_5'].clearValidators();

      switch (self.registerForm.value.professionalType) {
        case 'professional media creator': {
          this.required = {
            portfolio: true,
            bio: true,
            governmentId: true
          };
          self.registerForm.controls['portfolioLink'].setValidators(
            Validators.compose([
              Validators.required,
              Validators.pattern(self.patternUrl)
            ])
          );
          self.registerForm.controls['bioAnswer_1'].setValidators([
            Validators.required
          ]);
          self.registerForm.controls['bioAnswer_2'].setValidators([
            Validators.required
          ]);
          self.registerForm.controls['bioAnswer_3'].setValidators([
            Validators.required
          ]);
          self.registerForm.controls['bioAnswer_4'].setValidators([
            Validators.required
          ]);
          self.registerForm.controls['bioAnswer_5'].setValidators([
            Validators.required
          ]);
          break;
        }

        case 'media amateur': {
          this.required = {
            portfolio: true,
            bio: true,
            governmentId: true
          };
          self.registerForm.controls['portfolioLink'].setValidators(
            Validators.compose([
              Validators.required,
              Validators.pattern(self.patternUrl)
            ])
          );
          self.registerForm.controls['bioAnswer_1'].setValidators([
            Validators.required
          ]);
          self.registerForm.controls['bioAnswer_2'].setValidators([
            Validators.required
          ]);
          self.registerForm.controls['bioAnswer_3'].setValidators([
            Validators.required
          ]);
          self.registerForm.controls['bioAnswer_4'].setValidators([
            Validators.required
          ]);
          self.registerForm.controls['bioAnswer_5'].setValidators([
            Validators.required
          ]);
          break;
        }

        case 'model/actor/actress': {
          this.required = {
            portfolio: false,
            bio: false,
            governmentId: false
          };
          self.registerForm.controls['portfolioLink'].setValidators([
            Validators.pattern(self.patternUrl)
          ]);
          break;
        }

        case 'sharer/collaborator': {
          this.required = {
            portfolio: false,
            bio: false,
            governmentId: false
          };
          self.registerForm.controls['portfolioLink'].setValidators([
            Validators.pattern(self.patternUrl)
          ]);
          self.registerForm.controls['sharingWith'].setValidators([
            Validators.required
          ]);
          break;
        }

        default: {
          break;
        }
      }

      self.registerForm.controls['portfolioLink'].updateValueAndValidity();
      self.registerForm.controls['sharingWith'].updateValueAndValidity();
      self.registerForm.controls['bioAnswer_1'].updateValueAndValidity();
      self.registerForm.controls['bioAnswer_2'].updateValueAndValidity();
      self.registerForm.controls['bioAnswer_3'].updateValueAndValidity();
      self.registerForm.controls['bioAnswer_4'].updateValueAndValidity();
      self.registerForm.controls['bioAnswer_5'].updateValueAndValidity();
    }

    if (type == 'referralSourceId') {
      if (
        self.registerForm.value.referralSourceId == 'blackbox' ||
        self.registerForm.value.referralSourceId == 'other'
      ) {
        self.registerForm.controls['referralDescription'].setValidators(
          Validators.compose([Validators.maxLength(512), Validators.required])
        );
      } else {
        self.registerForm.controls['referralDescription'].clearValidators();
        self.registerForm.controls['referralDescription'].setValidators([
          Validators.maxLength(512)
        ]);
      }
      self.registerForm.controls[
        'referralDescription'
      ].updateValueAndValidity();
    }
  }

  ngAfterViewInit() {
    // this._script.loadScripts('app-login',
    //     ['assets/js/fileinput.js']);
    // Helpers.bodyClass('m--skin- m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default');
  }

  codeLogin() {
    var activatedRoute = this.activatedRoute;
    var matcher = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    activatedRoute.queryParams.subscribe(params => {
      var code = params['info'];
      function isUrl(string) {
        return matcher.test(string);
      }

      if (isUrl(code)) {
        var url = new URL(code);
        code = url.searchParams.get('info');
      }

      if (code) {
        var info = JSON.parse(atob(code));
        if (info) {
          this.model.username = info.username;
          this.model.password = info.password;
          this.loginSubmit();
        }
      }
    });
  }

  referralCode() {
    var self = this;
    var referral_code = localStorage.getItem('referral_code');
    var activatedRoute = this.activatedRoute;
    var matcher = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    activatedRoute.queryParams.subscribe(params => {
      var code = params['code'];
      function isUrl(string) {
        return matcher.test(string);
      }

      if (isUrl(code)) {
        var url = new URL(code);
        code = url.searchParams.get('code');
      }

      if (code) {
        this.openUnRegister();
      }

      if (referral_code || code) {
        code = referral_code ? referral_code : code;

        // var expireDate = new Date();
        // expireDate.setDate(expireDate.getDate() + 30);
        localStorage.setItem('referral_code', code);
      }

      if (code) {
        self.registerForm.patchValue({
          registerValue: {
            disabledCode: true
          },
          referrer: code,
          referralSourceId: 'blackbox',
          referralDescription: code
        });
      }
    });
  }

  government() {
    var self = this;
    var register = this.registerForm;
    var url = self.apiUrl.upload_government;
    var fGovernment = $('#fGovernment');
    fGovernment.fileinput(
      $.extend(self.constants.defaultFileInputSettings, {
        uploadAsync: false,
        uploadUrl: url,
        showPreview: false,
        allowedFileExtensions: [
          'tiff',
          'doc',
          'pdf',
          'gif',
          'jpeg',
          'jpg',
          'png'
        ],
        ajaxSettings: {
          headers: {
            Token: self._authenticateService.getSessionData()
          }
        }
      })
    );
    var toastr = self.toastr;
    $('#fGovernment')
      .off('filebatchuploadsuccess')
      .on('filebatchuploadsuccess', function(event, data) {
        $('#fGovernment')
          .fileinput('destroy')
          .fileinput({ showPreview: false });
        $('#fGovernment').fileinput('refresh');
        if (data.response) {
          self.canReminder = false;
          toastr.success(
            'Your government ID was uploaded successfully.',
            'Success'
          );
          register.patchValue({
            governmentPath: data.response.governmentPath,
            governmentFileName: data.response.governmentFileName
          });
          console.log(register);
        }
      });

    $('#fGovernment').on('fileclear', function(event) {
      self.canReminder = false;
    });
    $('#fGovernment').change(function() {
      self.canReminder = true;
      if (self.registerForm.value.governmentFileName != '') {
        self.canReminder = false;
      }
    });
  }
  resolved(captchaResponse: string) {
    if (captchaResponse) {
      this.model.grecaptchaResponse = captchaResponse;
      this.captcha = true;
    }
  }

  loginSubmit() {
    var self = this;
    $('.alert-danger', $('.m-login__signin')).hide();
    if (self.model.username == '' || self.model.password == '') {
      self.txtFailedLogin = 'Enter any username and password.';
      $('.alert-danger', $('.m-login__signin')).show();
      return;
    }
    if (this.captcha == false) {
      this.checkCaptcha = true;
    } else {
      self.isLoading = true;
      self.isLogin = true;
      self._accountService
        .login(self.model)
        .then((response: any) => {
          response = response.json();
          if (response.success) {
            var sessionData = self._authenticateService.buildSessionData(
              response
            );
            self._authenticateService.setSessionData(sessionData);
            if (this.checkReview(sessionData)) {
              self.router.parseUrl('/footage_review');
            }
            if (this._accountService.isAdmin()) {
              return self.router.navigate(['/admin/members']);
            }

            if (sessionData && sessionData.isMediaReviewer) {
              return self.router.navigate(['/pages/media']);
            }

            self.router.navigate([self.defaultUrl]);
          } else {
            self.txtFailedLogin = response.message;
            $('.alert-danger', $('.m-login__signin')).show();
          }
          self.isLoading = false;
          self.isLogin = false;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  getPasswordSubmit() {
    var self = this;
    if (this.models.username == '') {
      this.checkEmail = false;
      this.forgetPassword = false;
      this.txtForget = 'This field is required';
    } else {
      if (self.checkEmail == false) {
        self.forgetPassword = false;
        console.log('a');
        self.txtForget = 'Wrong mail format';
      } else {
        self._accountService
          .getPassword(self.models)
          .then((response: any) => {
            response = response.json();
            if (response.success) {
              self.forgetPassword = false;
              self.successfulForget = true;
              self.txtForget = response.message;
            } else {
              self.forgetPassword = false;
              self.successfulForget = false;
              self.txtForget = response.message;
            }
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }

  checkEmails(emaill: string) {
    var self = this;
    var checkEmail = self.utils.validEmail(emaill);
    if (!checkEmail) {
      self.checkEmail = false;
      self.forgetPassword = false;
      self.txtForget = 'Wrong mail format';
    } else {
      self.forgetPassword = true;
      self.checkEmail = true;
    }
  }

  unRegister() {
    var self = this;
    console.log(self.unRegisterForm);
    if (self.unRegisterForm.invalid) {
      self.submitted = true;
      return;
    }

    if (self.unRegisterForm.value.userType == 'company') {
      self.unRegisterForm.value.firstName = '';
      self.unRegisterForm.value.lastName = '';
    } else {
      self.unRegisterForm.value.companyName = '';
      self.unRegisterForm.value.representativeFirstName = '';
      self.unRegisterForm.value.representativeLastName = '';
    }
    self.register_data = {
      firstName: self.unRegisterForm.value.firstName,
      lastName: self.unRegisterForm.value.lastName,
      telephone: self.unRegisterForm.value.telephone,
      companyName: self.unRegisterForm.value.companyName,
      userType: self.unRegisterForm.value.userType,
      city: self.unRegisterForm.value.city,
      country: self.unRegisterForm.value.country,
      username: self.unRegisterForm.value.email,
      email: self.unRegisterForm.value.email,
      representativeFirstName:
        self.unRegisterForm.value.representativeFirstName,
      representativeLastName: self.unRegisterForm.value.representativeLastName
    };
    console.log(self.register_data);
    self.isLoading = true;
    self.isUnregister = true;
    self._accountService
      .unRegister(self.register_data)
      .then((response: any) => {
        response = response.json();
        if (response.success) {
          $('.m-login__signup').hide();
          $('.m-login__signup2').show();
          $('.alert-danger', $('.m-login__signup')).hide();
        } else {
          self.txtFailedRegister = response.message;
          $('.alert-danger', $('.m-login__signup')).show();
        }
        console.log(response);
        self.isLoading = false;
        self.isUnregister = false;
      });
  }

  referralSourceChange() {
    var self = this;
    if (self.registerForm.value.referralSourceId == 'blackbox') {
      self.listReferrers = self.constants.listReferrers;
      self.placeholderModalAnswer =
        'Please provide the referral code or username of your "referrer" here';
    }
    if (self.registerForm.value.referralSourceId == 'other') {
      self.listReferrers = [];
      self.placeholderModalAnswer = 'Please be specific';
    }
  }

  registerSubmit() {
    var self = this;
    if (self.canReminder) {
      return self.toastr.warning(
        'Please click upload button to upload your government ID.',
        'Warning'
      );
    }
    var register = self.registerForm.value;
    var unRegisterForm = self.unRegisterForm.value;
    self.checkSocial = false;
    if (self.registerForm.invalid) {
      if (self.registerForm.invalid) {
        self.submittedRegister = true;
      }
      return;
    }

    if (self.registerForm.invalid) {
      self.submittedRegister = true;
      return;
    }

    switch (register.professionalType) {
      case 'model/actor/actress': {
        let roles = ['model', 'actor'];

        if (!roles.includes(register.expertisePrimary)) {
          return self.toastr.error(
            `The primary expertise does not match with your specified profession as Model or Actor/Actress.`,
            'Error'
          );
        }

        if (!roles.includes('actor')) {
          return self.toastr.error(
            `The primary expertise does not match with your specified profession as Model or Actor/Actress.`,
            'Error'
          );
        }

        break;
      }

      case 'sharer/collaborator': {
        let roles = ['sharer/collaborator'];

        if (!roles.includes(register.expertisePrimary)) {
          return self.toastr.error(
            `The primary expertise does not match with your specified profession as Sharer or Collaborator.`,
            'Error'
          );
        }
        break;
      }

      default:
        break;
    }

    if (this.required.governmentId) {
      if (!register.governmentPath) {
        return self.toastr.error(
          `Please upload a valid government ID before submitting this registration.`,
          'Error'
        );
      }
    }

    register.representativeFirstName = unRegisterForm.representativeFirstName;
    register.representativeLastName = unRegisterForm.representativeLastName;
    register.userType = unRegisterForm.userType;
    register.firstName = unRegisterForm.firstName;
    register.lastName = unRegisterForm.lastName;
    register.companyName = unRegisterForm.companyName;
    register.telephone = unRegisterForm.telephone;
    register.email = unRegisterForm.email;
    register.city = unRegisterForm.city;
    register.country = unRegisterForm.country;
    register.HSTRegistrationNumber =
      unRegisterForm.country === 'Canada'
        ? register.HSTRegistrationNumber
        : null;
    register.sharingWith =
      register.professionalType === 'sharer/collaborator'
        ? register.sharingWith
        : null;
    register.settings = {
      social: {}
    };
    register.username = register.email;
    if (register.userType == 'company') {
      register.firstName = register.companyName;
      register.lastName = '';
    } else if (register.userType == 'personal') {
      register.companyName = '';
      register.representativeFirstName = '';
      register.representativeLastName = '';
    }
    if (register.referralSourceId == 'blackbox') {
      var referralDescription = register.referralDescription.replace(
        /(^\s*)|(\s*$)/gi,
        ''
      );
      referralDescription = referralDescription.replace(/[ ]{2,}/gi, ' ');
      referralDescription = referralDescription.toLowerCase();
      var referrer = _.find(self.constants.listReferrers, item => {
        return item.value == referralDescription;
      });
      if (referrer) {
        register.referrer = referrer.email;
      } else {
        register.referrer = register.referralDescription;
      }
    }
    if (
      register.referralSourceId == 'chris hau' ||
      register.referralSourceId == 'jeven dovey'
    ) {
      var referrer = _.find(self.constants.listReferrers, item => {
        return item.value == register.referralSourceId;
      });
      register.referrer = referrer.email;
    }
    if (register.firstSocial && register.firstSocialAddress) {
      register.settings.social[register.firstSocial] =
        register.firstSocialAddress;
    }

    if (register.secondSocial && register.secondSocialAddress) {
      register.settings.social[register.secondSocial] =
        register.secondSocialAddress;
    }
    if (register.settings.social == undefined) {
      register.settings = '';
    } else {
      register.settings = register.settings;
    }
    this.bioData[0].answerContent = register.bioAnswer_1;
    this.bioData[1].answerContent = register.bioAnswer_2;
    this.bioData[2].answerContent = register.bioAnswer_3;
    this.bioData[3].answerContent = register.bioAnswer_4;
    this.bioData[4].answerContent = register.bioAnswer_5;
    register.bioData = this.bioData;
    self.isLoading = true;
    self.isRegister = true;
    self._accountService.register(register).then((result: any) => {
      result = result.json();
      if (result.success) {
        console.log(result);
        localStorage.removeItem('referral_code');
        self.alertModal.show();
      } else {
        self.toastr.error(result.message, 'Error');
      }
      self.isLoading = false;
      self.isRegister = false;
    });
  }

  nextPage() {
    var self = this;
    self.alertModal.hide();
    window.location.href = self.constants.wpSite;
  }

  openUnRegister(reset?: boolean) {
    if (reset) {
      this.router.navigate(['login']);
      this.hideLogin = false;
    }
    $('.m-login__signin').hide();
    $('.m-login__forget-password').hide();
    $('.m-login__signup').show();
  }

  backLogin(reset?: boolean) {
    if (reset) {
      this.router.navigate(['login']);
      this.hideLogin = false;
    }
    this.submitted = false;
    $('.m-login__forget-password').hide();
    $('.m-login__signup').hide();
    $('.m-login__signup2').hide();
    $('.m-login__signin').show();
  }

  backUnRegister() {
    $('.m-login__signup2').hide();
    $('.m-login__signup').show();
  }

  openForgotPassword() {
    $('.m-login__signin').hide();
    $('.m-login__forget-password').show();
  }

  backForgotPassword() {
    $('.m-login__forget-password').hide();
    $('.m-login__signin').show();
  }

  checkReview(session: any) {
    if (session.roles.indexOf('footage reviewer') == -1) {
      return false;
    }
    return true;
  }

  getToken() {
    var activatedRoute = this.activatedRoute;
    var matcher = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    activatedRoute.queryParams.subscribe(params => {
      var code = params['reset_password'];
      function isUrl(string) {
        return matcher.test(string);
      }

      if (isUrl(code)) {
        var url = new URL(code);
        code = url.searchParams.get('reset_password');
      }

      if (code) {
        console.log(code);
        this.token = code;
        this.hideLogin = true;
      }
    });
  }

  validatePassword() {
    var pass = this.changePassword.newPassword;
    this.valid = false;
    if (pass === '') {
    } else {
      var regex = new Array();
      regex.push('[A-Z]'); //Uppercase Alphabet.
      regex.push('[a-z]'); //Lowercase Alphabet.
      regex.push('[0-9]'); //Digit.

      var passed = 0;

      //Validate for each Regular Expression.
      for (var i = 0; i < regex.length; i++) {
        if (new RegExp(regex[i]).test(pass)) {
          passed++;
        }
      }
      if (passed > 2 && pass.length >= 8) {
        this.valid = true;
      }
    }
    return this.valid ? this.changePassword.newPassword : undefined;
  }

  submitResetPassword() {
    if (this.validateConfirmPassword()) {
      this.loading = true;
      this._accountService
        .resetPassword(this.token, this.changePassword.newPassword)
        .then((result: any) => {
          console.log(result);
          this.loading = false;
          result = result.json();
          if (!result) {
            return this.toastr.error(
              'System error. Please try again later.',
              'Error'
            );
          }
          if (result.success) {
            this.toastr.success('Reset password successfully', 'success');
            this.hideLogin = false;
            this.router.navigate(['login']);
          } else {
            this.toastr.error(result.message, 'Error');
          }
        });
    }
  }

  showDetailInfo() {
    $('#detailDemoReelLink').modal('show');
  }

  validateConfirmPassword(): boolean {
    if (this.changePassword.newPassword != this.changePassword.ReNewPassword) {
      return false;
    }
    return true;
  }
}
