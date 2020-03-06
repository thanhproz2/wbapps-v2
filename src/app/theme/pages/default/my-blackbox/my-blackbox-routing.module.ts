import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyBlackboxComponent } from './my-blackbox.component';

const routes: Routes = [
  {
    path: '',
    component: MyBlackboxComponent,
    children: [
      {
        path: 'workspace',
        loadChildren: () => import('./workspace/workspace.module').then(m => m.WorkspaceModule)
      },
      {
        path: 'curation',
        loadChildren: () => import('./curation/curation.module').then(m => m.CurationModule)

      },
      { path: 'media-products',
        loadChildren: () => import('./media-products/media-products.module').then(m => m.MediaProductsModule)
      },
      {
        path: 'submitted-content',
        loadChildren: () =>
          import('./submitted-content/submitted-content.module').then(
            m => m.SubmittedContentModule
          )
      },
      {
        path: 'my-collaboration',
        loadChildren: () =>
          import('./my-collaboration/my-collaboration.module').then(
            m => m.MyCollaborationModule
          )
      },
      {
        path: 'marketplace',
        loadChildren: () =>
          import('./marketplace/marketplace.module').then(
            m => m.MarketplaceModule
          )
      },
      { path: '', redirectTo: 'workspace', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyBlackboxRoutingModule {}
