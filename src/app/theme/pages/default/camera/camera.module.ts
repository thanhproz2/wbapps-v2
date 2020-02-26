import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraChangeComponent } from './camera-change/camera-change.component';
import { CameraEditComponent } from './camera-edit/camera-edit.component';
import { CameraListComponent } from './camera-list/camera-list.component';
import { CameraNewComponent } from './camera-new/camera-new.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CameraChangeComponent,
    CameraEditComponent,
    CameraListComponent,
    CameraNewComponent
  ],
  imports: [CommonModule, TranslateModule, FormsModule],
  exports: [
    CameraNewComponent,
    CameraChangeComponent,
    CameraListComponent,
    CameraEditComponent
  ]
})
export class CameraModule {}
