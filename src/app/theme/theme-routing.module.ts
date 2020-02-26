import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThemeComponent } from './theme.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { MyBlackboxComponent } from './pages/default/my-blackbox/my-blackbox.component';

const routes: Routes = [
  {
    path: '',
    component: ThemeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/default/dashboard/dashboard.module').then(
            m => m.DashboardModule
          )
      },
      {
        path: 'help',
        loadChildren: () =>
          import('./pages/default/help/help.module').then(m => m.HelpModule)
      },
      {
        path: 'terms-of-service',
        loadChildren: () =>
          import(
            './pages/default/terms-of-service/terms-of-service.module'
          ).then(m => m.TermsOfServiceModule)
      },
      {
        path: 'privacy-policy',
        loadChildren: () =>
          import('./pages/default/privacy-policy/privacy-policy.module').then(
            m => m.PrivacyPolicyModule
          )
      },
      {
        path: 'my-blackbox',
        loadChildren: () =>
          import('./pages/default/my-blackbox/my-blackbox.module').then(
            m => m.MyBlackboxModule
          )
      },
      {
        path: 'my-studio',
        loadChildren: () =>
          import('./pages/default/my-studio/my-studio.module').then(
            m => m.MyStudioModule
          )
      },
      {
        path: 'my-earnings',
        loadChildren: () =>
          import('./pages/default/my-earnings/my-earnings.module').then(
            m => m.MyEarningsModule
          )
      },
      {
        path: 'legal-forms',
        loadChildren: () =>
          import('./pages/default/legal-forms/legal-forms.module').then(
            m => m.LegalFormsModule
          )
      },
      {
        path: 'agreement',
        loadChildren: () =>
          import('./pages/default/agreement/agreement.module').then(
            m => m.AgreementModule
          )
      },
      {
        path: 'my-profile',
        loadChildren: () =>
          import('./pages/default/my-profile/my-profile.module').then(
            m => m.MyProfileModule
          )
      },
      {
        path: '404',
        loadChildren: () =>
          import('./pages/default/not-found/not-found.module').then(
            m => m.NotFoundModule
          )
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeRoutingModule {}
