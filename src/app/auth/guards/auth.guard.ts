import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { SessionData } from 'src/app/models/session.data.model';
import { AuthenticateService } from 'src/app/services/authenticate.service';

@Injectable()
export class AuthGuard implements CanActivate {
  session: SessionData;

  constructor(
    private router: Router,
    private authenticateService: AuthenticateService
  ) {
    this.authenticateService.getSessionData().subscribe(data => {
      this.session = data;
    });
  }

  canActivate(): Observable<boolean> | boolean {
    if (this.session !== null) {
      // logged in so return true
      return true;
    }

    // error when verify so redirect to login page with the return url
    this.router.navigate(['/login']);
    return false;
  }
}
