import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFootageCurationComponent } from './list-footage-curation/list-footage-curation.component';
import { EditFootageCurationComponent } from './edit-footage-curation/edit-footage-curation.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  TooltipModule,
  PaginationModule,
  PopoverModule,
  BsDatepickerModule,
  ModalModule
} from 'ngx-bootstrap';
import { PartialsModule } from 'src/app/theme/partials/partials.module';
import { TagInputModule } from 'ngx-chips';
import { ImageViewerModule } from 'ngx-image-viewer';
import { RouterModule, Routes } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: ListFootageCurationComponent
  },
  {
    path: 'edit',
    component: EditFootageCurationComponent
  }
];

@NgModule({
  declarations: [
    ListFootageCurationComponent,
    EditFootageCurationComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    FormsModule,
    TranslateModule,
    TooltipModule,
    PaginationModule,
    PopoverModule,
    PartialsModule,
    BsDatepickerModule,
    TagInputModule,
    ModalModule,
    ImageViewerModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CurationModule {}
