import { Injectable } from '@angular/core';

@Injectable()
export class Utils {
  public clone(obj): any {
    const copy = JSON.parse(JSON.stringify(obj));
    return copy;
  }
  validEmail(email): boolean {
    const reg = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}$/;
    return reg.test(email);
  }
  public buildParams(dataUrl) {
    const ret = [];
    for (const d in dataUrl) {
      if (dataUrl[d]) {
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(dataUrl[d]));
      }
    }
    return ret.join('&');
  }

  public convertTimeFormat(timeFormat): string {
    if (timeFormat === '12h') {
      return 'A';
    } else {
      return '';
    }
  }

  public device() {
    const ua = navigator.userAgent;
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
        ua
      )
    ) {
      return 'mobile';
    } else {
      return 'desktop';
    }
  }

  public validDescription(description: string) {
    const format = /[@]/i; // regex check @
    const numberFormat = /(^[0-9]{1,}[ ])|([ ][0-9]{1,}[ ])|([ ][0-9]{1,}$)/i;

    return !format.test(description) && !numberFormat.test(description);
  }

  generateUUID() {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      // tslint:disable-next-line:no-bitwise
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      // tslint:disable-next-line:no-bitwise
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  countWords(text) {
    let words = text.replace(/(^\s*)|(\s*$)/gi, ''); // exclude  start and end white-space
    words = words.replace(/[ ]{3,}/gi, ' '); // 3 or more space to 2
    words = words.replace(/\n /, '\n'); // exclude newline with a start spacing
    const count = words.split(' ').length + words.split('\n').length - 1;
    return count;
  }
}
