import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Helpers } from './helpers';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  globalBodyClass =
    'm-page--loading-non-block m-page--fluid m--skin- m-content--skin-light';

  constructor(
    private router: Router,
    private translateService: TranslateService
  ) {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }

  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    const routerSubscription = this.router.events.subscribe(route => {
      if (route instanceof NavigationStart) {
        Helpers.setLoading(true);
        // Helpers.bodyClass(this.globalBodyClass);
        // scroll to top on every route change
				window.scrollTo(0, 0);
      }

      if (route instanceof NavigationEnd) {
        Helpers.setLoading(false);
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  }
}
