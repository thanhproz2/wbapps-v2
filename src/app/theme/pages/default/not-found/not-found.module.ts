import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found.component';
import { DefaultComponent } from '../default.component';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from 'src/app/theme/layout/layout.module';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: NotFoundComponent
      }
    ]
  }
];

@NgModule({
  declarations: [NotFoundComponent],
  imports: [CommonModule, RouterModule.forChild(routes), LayoutModule]
})
export class NotFoundModule {}
