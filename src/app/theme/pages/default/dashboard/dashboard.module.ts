import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from '../default.component';
import { LayoutModule } from 'src/app/theme/layout/layout.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import {
  PaginationModule,
  PopoverModule,
  TooltipModule,
  ModalModule
} from 'ngx-bootstrap';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { PartialsModule } from 'src/app/theme/partials/partials.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      }
    ]
  }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    LayoutModule,
    TranslateModule,
    PaginationModule,
    BsDatepickerModule,
    PopoverModule,
    TooltipModule,
    ModalModule,
    Ng2GoogleChartsModule,
    PipesModule,
    PartialsModule
  ],
  exports: [RouterModule]
})
export class DashboardModule {}
