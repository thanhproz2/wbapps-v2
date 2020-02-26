import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticateService } from './authenticate.service';
import { SessionData } from "../models/session.data.model";

@Injectable()
export class AdminRole implements CanActivate {
    private _session: SessionData;

    constructor(private _authenticateService: AuthenticateService, private _router: Router) {
        this._authenticateService.getSessionData().subscribe(o => {
            this._session = o;
        });
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._session != null && this._session.isAdmin) {
            return true;
        }

        if (this._session != null && checkReview(this._session)) {
            this._router.navigate(['footage_review']);
            return false;
        }

        this._router.navigate(['/login']);
        return false;
    }
}
@Injectable()
export class UserRole implements CanActivate {
    private _session: SessionData;

    constructor(private _authenticateService: AuthenticateService, private _router: Router) {
        this._authenticateService.getSessionData().subscribe(o => {
            this._session = o;
        });
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._session) {
            if (this._session.profileComplete == false) {
                this._router.navigate(['/fProfile']);
                return false;
            }
            if (this._session.acceptAgreement == false) {
                this._router.navigate(['/fAgreement']);
                return false;
            }
            if (this._session != null && checkReview(this._session)) {
                this._router.navigate(['footage_review']);
                return false;
            }

            if (this._session && this._session.isMediaReviewer) {
                this._router.navigate(['pages/media']);
                return false;
            }
            return true;
        }
        this._router.navigate(['/login']);
        return false;
    }
}
@Injectable()
export class AllRole implements CanActivate {
    private _session: SessionData;

    constructor(private _authenticateService: AuthenticateService, private _router: Router) {
        this._authenticateService.getSessionData().subscribe(o => {
            this._session = o;
        });
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._session != null && checkReview(this._session)) {
            this._router.navigate(['footage_review']);
            return false;
        }
        if (this._session != null && (this._session.isCurator)) {
            return true;
        }
        this._router.navigate(['/login']);
        return false;
    }
}

@Injectable()
export class CuratorRole implements CanActivate {
    private _session: SessionData;

    constructor(private _authenticateService: AuthenticateService, private _router: Router) {
        this._authenticateService.getSessionData().subscribe(o => {
            this._session = o;
        });
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._session != null && checkReview(this._session)) {
            this._router.navigate(['footage_review']);
            return false;
        }
        if (this._session != null && (this._session.isCurator)) {
            return true;
        }
        this._router.navigate(['/login']);
        return false;
    }
}
@Injectable()
export class SaleAndMarketingRole implements CanActivate {
    private _session: SessionData;

    constructor(private _authenticateService: AuthenticateService, private _router: Router) {
        this._authenticateService.getSessionData().subscribe(o => {
            this._session = o;
        });
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._session != null && (this._session.isAdmin  || this._session.isMarketingManagement || this._session.isSaleManagement)) {
            return true;
        }
        this._router.navigate(['/login']);
        return false;
    }
}

@Injectable()
export class ReviewRole implements CanActivate {
    private _session: SessionData;

    constructor(private _authenticateService: AuthenticateService, private _router: Router) {
        this._authenticateService.getSessionData().subscribe(o => {
            this._session = o;
        });
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._session != null && checkReview(this._session)) {
            return true;
        }
        this._router.navigate(['/login']);
        return false;
    }
}

function checkReview(session: any) {
    if (session.roles.indexOf("footage reviewer") == -1) {
        return false;
    }
    return true;
}