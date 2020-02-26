import { Pipe, PipeTransform } from '@angular/core';
declare var moment: any;

@Pipe({ name: 'datetime' })
export class DateTimePipe implements PipeTransform {
  transform(value: string, type: string, time_format: string): any {
    if (
      time_format == undefined ||
      time_format == null ||
      time_format == 'undefined' ||
      time_format == '12h'
    ) {
      time_format = 'A';
    }
    if (!value) return value;
    if (time_format == 'A') {
      if (type == 'date') {
        return moment(value).format('dddd, MMM DD, YYYY');
      }
      if (type == 'time') {
        return moment(value).format('hh:mm ' + time_format);
      }
      if (type == 'shortdate') {
        return moment(value).format('MMM DD, YYYY');
      }
      if (type == 'shortweekdate') {
        return moment(value).format('ddd, MMM DD, YYYY hh:mm ' + time_format);
      }
      return moment(value).format('dddd, MMM DD, YYYY hh:mm ' + time_format);
    } else {
      if (type == 'date') {
        return moment(value).format('dddd, MMM DD, YYYY');
      }
      if (type == 'time') {
        return moment(value).format('HH:mm');
      }
      if (type == 'shortdate') {
        return moment(value).format('MMM DD, YYYY');
      }
      if (type == 'shortweekdate') {
        return moment(value).format('ddd, MMM DD, YYYY HH:mm');
      }
      return moment(value).format('dddd, MMM DD, YYYY HH:mm');
    }
  }
}
