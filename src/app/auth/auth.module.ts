import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './guards/auth.guard';
import { AccountService } from '../services/account.service';
import { ApiService } from '../services/api.service';


@NgModule({
  declarations: [AuthComponent, LoginComponent],
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AuthRoutingModule,
  ],
  providers: [
    AuthGuard,
    AccountService,
    ApiService
  ]
})
export class AuthModule { }
