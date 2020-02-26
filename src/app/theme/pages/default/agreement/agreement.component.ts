import { Component, OnInit } from '@angular/core';
import { SessionData } from 'src/app/models/session.data.model';
import { AccountService } from 'src/app/services/account.service';
import { Router } from '@angular/router';
import { AuthenticateService } from 'src/app/services/authenticate.service';

declare var mApp: any;
declare var toastr: any;

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styles: []
})
export class AgreementComponent implements OnInit {
  defaultUrl: string;
  acceptAgreement: boolean = false;
  sessionData: SessionData;
  isLoading: boolean = false;
  constructor(
    private accountService: AccountService,
    private router: Router,
    private authenticateService: AuthenticateService
  ) {}

  ngOnInit() {
    mApp.unblockPage();
    this.defaultUrl = '/';
    var self = this;
    var acceptAgreement = localStorage.getItem('acceptAgreement');
    if (acceptAgreement == null) {
      self.router.navigate(['/login']);
    } else {
      if (acceptAgreement === 'true') {
        this.acceptAgreement = true;
      }
    }
  }

  acceptMemberAgreement() {
    var self = this;
    self.isLoading = true;
    self.accountService.acceptMemberAgreement().then(
      (result: any) => {
        console.log(result);
        self.isLoading = false;
        if (!result) {
          toastr.error('System error. Please try again later.', 'Error');
          return;
        }
        if (result.success) {
          self.authenticateService.getSessionData().subscribe(o => {
            self.sessionData = o;
          });
          self.sessionData.acceptAgreement = true;
          self.authenticateService.setSessionData(self.sessionData);
          self.router.navigate([self.defaultUrl]);
          toastr.success(
            'Accept the membership agreement successful.',
            'Success'
          );
        }
      },
      error => {
        self.isLoading = false;
        toastr.error(error, 'Error');
      }
    );
  }

  declineMemberAgreement() {
    toastr.error(
      'You can not continue until you agree with the membership agreement',
      'Error'
    );
  }
}
