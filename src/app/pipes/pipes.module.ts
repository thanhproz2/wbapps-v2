import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountPipe } from './count.pipe';
import { FilterPipe } from './filter.pipe';
import { DateTimePipe } from './datetime.pipe';

@NgModule({
  declarations: [CountPipe, FilterPipe, DateTimePipe],
  imports: [CommonModule],
  exports: [CountPipe, FilterPipe, DateTimePipe]
})
export class PipesModule {}
