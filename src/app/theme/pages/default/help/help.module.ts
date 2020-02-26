import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpComponent } from './help.component';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from '../default.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsAndTemplatesComponent } from './forms-and-templates/forms-and-templates.component';
import { FaqComponent } from './faq/faq.component';
import { UsageGuideComponent } from './usage-guide/usage-guide.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: HelpComponent
      }
    ]
  }
];

@NgModule({
  declarations: [HelpComponent, FormsAndTemplatesComponent, FaqComponent, UsageGuideComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, FormsModule]
})
export class HelpModule {}
