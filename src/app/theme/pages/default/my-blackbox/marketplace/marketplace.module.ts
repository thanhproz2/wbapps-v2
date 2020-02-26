import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketplaceComponent } from './marketplace.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { TooltipModule, PaginationModule, PopoverModule, ModalModule, CollapseModule } from 'ngx-bootstrap';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '',
  component: MarketplaceComponent
}]

@NgModule({
  declarations: [MarketplaceComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    TooltipModule,
    PaginationModule,
    PopoverModule,
    ModalModule,
    CollapseModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MarketplaceModule { }
