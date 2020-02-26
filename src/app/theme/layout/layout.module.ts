import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
import { DefaultComponent } from '../pages/default/default.component';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AvatarComponent } from './header/avatar/avatar.component';



@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    DefaultComponent,
    ScrollTopComponent,
    ChangePasswordComponent,
    AvatarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule
  ],
  exports: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    ScrollTopComponent,
    DefaultComponent
  ]
})
export class LayoutModule { }
