import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyStudioComponent } from './my-studio.component';
import { ContentReviewComponent } from './content-review/content-review.component';
import { ChatStudioComponent } from './chat-studio/chat-studio.component';
import { TasksComponent } from './tasks/tasks.component';
import { ContentUploadComponent } from './content-upload/content-upload.component';
import { TeamComponent } from './team/team.component';
import { StudioHelpComponent } from './studio-help/studio-help.component';

const routes: Routes = [
  {
    path: '',
    component: MyStudioComponent,
    children: [
      {
        path: '',
        redirectTo: 'content-review',
        pathMatch: 'full'
      },
      {
        path: 'content-review',
        component: ContentReviewComponent
      },
      {
        path: 'chat',
        component: ChatStudioComponent
      },
      {
        path: 'tasks',
        component: TasksComponent
      },
      {
        path: 'content-upload',
        component: ContentUploadComponent
      },
      {
        path: 'team',
        component: TeamComponent
      },
      {
        path: 'help',
        component: StudioHelpComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyStudioRoutingModule {}
