import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ListMediaProductsComponent } from './list-media-products/list-media-products.component';
import { EditMediaProductComponent } from './edit-media-product/edit-media-product.component';
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
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: ListMediaProductsComponent
  },
  {
    path: 'edit/:id',
    component: EditMediaProductComponent
  }
];

@NgModule({
  declarations: [ListMediaProductsComponent, EditMediaProductComponent],
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
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MediaProductsModule {}
