import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player/player.component';
import { RatingComponent } from './rating/rating.component';
import { TranslateModule } from '@ngx-translate/core';
import { VideoModalComponent } from './video-modal/video-modal.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [PlayerComponent, RatingComponent, VideoModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  exports: [PlayerComponent, RatingComponent, VideoModalComponent]
})
export class PartialsModule { }
