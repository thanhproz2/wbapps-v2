import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyStudioRoutingModule } from './my-studio-routing.module';
import { MyStudioComponent } from './my-studio.component';
import { FormsModule } from '@angular/forms';
import { ChatStudioComponent } from './chat-studio/chat-studio.component';
import { ChatThreadsComponent } from './chat-threads/chat-threads.component';
import { ContentReviewComponent } from './content-review/content-review.component';
import { ContentUploadComponent } from './content-upload/content-upload.component';
import { StudioHelpComponent } from './studio-help/studio-help.component';
import { TasksComponent } from './tasks/tasks.component';
import { TeamComponent } from './team/team.component';


@NgModule({
  declarations: [MyStudioComponent, ChatStudioComponent, ChatThreadsComponent, ContentReviewComponent, ContentUploadComponent, StudioHelpComponent, TasksComponent, TeamComponent],
  imports: [
    CommonModule,
    FormsModule,
    MyStudioRoutingModule
  ]
})
export class MyStudioModule { }
