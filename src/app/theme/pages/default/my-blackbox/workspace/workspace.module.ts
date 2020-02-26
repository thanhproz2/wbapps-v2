import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ListFootageComponent } from './list-footage/list-footage.component';
import { EditFootageComponent } from './edit-footage/edit-footage.component';
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
import { CameraModule } from '../../camera/camera.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: ListFootageComponent
  },
  {
    path: 'edit',
    component: EditFootageComponent
  }
];

@NgModule({
  declarations: [ListFootageComponent, EditFootageComponent],
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
    PartialsModule,
    CameraModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class WorkspaceModule {}
