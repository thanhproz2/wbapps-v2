import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MyCollaborationComponent } from './my-collaboration.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { TooltipModule, PaginationModule, PopoverModule, ModalModule, CollapseModule, BsDatepickerModule } from 'ngx-bootstrap';
import { PartialsModule } from 'src/app/theme/partials/partials.module';

const routes: Routes = [{
  path: '',
  component: MyCollaborationComponent
}]

@NgModule({
  declarations: [MyCollaborationComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    TooltipModule,
    PaginationModule,
    PopoverModule,
    ModalModule,
    CollapseModule,
    BsDatepickerModule,
    RouterModule.forChild(routes),
    PartialsModule
  ],
  exports: [RouterModule]
})
export class MyCollaborationModule { }
