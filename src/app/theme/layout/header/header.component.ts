import {
  Component,
  OnInit,
  AfterViewInit,
  DoCheck,
  ViewChild
} from '@angular/core';
import { SessionData } from 'src/app/models/session.data.model';
import { AccountService } from 'src/app/services/account.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared-service';
import { ChangePasswordComponent } from '../change-password/change-password.component';

declare let mLayout: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit, AfterViewInit, DoCheck {
  sessionData: SessionData;
  activated = true;
  href = '';

  @ViewChild(ChangePasswordComponent)
  private changePasswordModal: ChangePasswordComponent;
  public set ChangePasswordComponent(value: ChangePasswordComponent) {
    this.changePasswordModal = value;
  }

  constructor(
    private accountService: AccountService,
    private authenticateService: AuthenticateService,
    private router: Router,
    // private frontpageComponent: FrontpageComponent,
    private sharedService: SharedService
  ) {
    this.authenticateService.getSessionData().subscribe(o => {
      this.sessionData = o;
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    mLayout.initHeader();
  }

  ngDoCheck() {
    this.href = this.router.url;
    if (this.href === '/dashboard') {
      this.activated = true;
    } else {
      this.activated = false;
    }
  }

  activatedRouter() {
    this.activated = true;
  }

  notActivatedRouter() {
    this.activated = false;
  }

  logout() {
    this.accountService.logOut().then(() => {});
    const infoAdmin = localStorage.getItem('infoAdmin');
    // this.frontpageComponent.disconnect();
    this.authenticateService.clearSessionData();
    this.sharedService.removeEmitAll();
    if (infoAdmin != null) {
      const sessionData = this.authenticateService.buildSessionData(
        JSON.parse(infoAdmin)
      );
      this.authenticateService.setSessionData(sessionData);
      this.authenticateService.removeInfoAdmin();
      setTimeout(() => {
        // this.frontpageComponent.getAvartar();
      });
      // this.frontpageComponent.initChat();
      return this.router.navigate(['/admin/members']);
    }
    this.router.navigate(['login']);
  }

  showChangePassword() {
    this.changePasswordModal.show();
  }

  showAdmin() {
    return this.accountService.showAdmin();
  }

  isAdmin() {
    return this.accountService.isAdmin();
  }
}
