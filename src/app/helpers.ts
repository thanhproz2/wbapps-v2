import * as $ from 'jquery';

export class Helpers {
  static setLoading(enable) {
    const body = $('body');
    if (enable) {
      $(body).addClass('m-page--loading-non-block');
    } else {
      $(body).removeClass('m-page--loading-non-block');
    }
  }

  static bodyClass(strClass) {
    $('body').attr('class', strClass);
}
}
