import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThemeRoutingModule } from './theme/theme-routing.module';
import { ThemeComponent } from './theme/theme.component';
import { LayoutModule } from './theme/layout/layout.module';
import { AuthModule } from './auth/auth.module';
import { Constants } from './utils/constants';
import { ApiUrl } from './utils/apiUrl';
import { Utils } from './utils/utils';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { TooltipModule, PaginationModule, PopoverModule } from 'ngx-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    ThemeComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({ preventDuplicates: true }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    Ng2GoogleChartsModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    BsDatepickerModule.forRoot(),
    LayoutModule,
    AppRoutingModule,
    ThemeRoutingModule,
    AuthModule
  ],
  providers: [
    Constants,
    Utils,
    ApiUrl
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
