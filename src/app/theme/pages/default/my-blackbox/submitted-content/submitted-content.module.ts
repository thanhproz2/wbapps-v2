import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  TooltipModule,
  PaginationModule,
  PopoverModule,
  BsDatepickerModule,
  ModalModule
} from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { PartialsModule } from 'src/app/theme/partials/partials.module';
import { TagInputModule } from 'ngx-chips';
import { ImageViewerModule } from 'ngx-image-viewer';
import { ListFootageContentComponent } from './list-footage-content/list-footage-content.component';
import { EditFootageContentComponent } from './edit-footage-content/edit-footage-content.component';
import { Routes, RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: ListFootageContentComponent
  },
  {
    path: 'edit',
    component: EditFootageContentComponent
  }
];

@NgModule({
  declarations: [
    ListFootageContentComponent,
    EditFootageContentComponent
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
export class SubmittedContentModule {}
