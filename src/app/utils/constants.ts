import { Injectable } from '@angular/core';

@Injectable()
export class Constants {
  wpSite = 'http://www.blackbox.global/';
  ftpServer = 'portal.blackbox.global';
  authKey = 'BB_AUTH_ID';
  pageSharerSize: any = [100, 500];
  maxContentSize: any = 524288; // 512MB
  grecaptcha = {
    sitekey: '6LcLbAgUAAAAAAfqY9LU_qzjVsIFhXE6QCM4Rizu'
  };
  pageSize = 10;
  pageSizeList: any = [
    {
      name: '10 per page',
      value: 10
    },
    {
      name: '50 per page',
      value: 50
    },
    {
      name: '100 per page',
      value: 100
    },
    {
      name: '200 per page',
      value: 200
    }
  ];
  videoControlsOptions: any = {
    controls: ['play', 'progress', 'current-time', 'fullscreen']
  };
  videoControlsOptionsPanel: any = {
    controls: ['play', 'progress'],
    iconUrl: 'assets/css/plyr-controls.svg'
  };
  defaultFileInputSettings: any = {
    minFileCount: 1,
    maxFileSize: 524288, // 512MB
    maxFilePreviewSize: 524288,
    uploadAsync: true,
    maxFileCount: 5,
    overwriteInitial: false,
    uploadExtraData: {
      uploadToken: localStorage.getItem('token') // for access control / security
    }
    // browseClass: 'btn btn-dark mr-2',
    // removeClass: 'btn btn-dark mr-2',
    // uploadClass: 'btn btn-dark mr-2',
    // cancelClass: 'btn btn-dark mr-2'
  };
  delayOptions: any = [5, 10, 30, 60, 90, 120];

  listReferrers: any = [
    {
      name: 'Chris Hau',
      value: 'chris hau',
      email: 'chrishau@mailinator.com'
    },
    {
      name: 'Jeven Dovey',
      value: 'jeven dovey',
      email: 'jevendovey@mailinator.com'
    }
  ];
  myEarningConfig: any = {
    query_months: 2,
    hide_annualSunmary: false
  };
  maxIndicateNumber = 50;
  defaultIndicateNumber = 1;
  batch = 50;
  enableDownloadScale = true;
  maxKeyword = 100;
  ignoreDescriptionWords = [
    'to',
    'of',
    'with',
    'a',
    'an',
    'the',
    'at',
    'in',
    'on',
    'this',
    'that',
    'those'
  ];
  maxRepeatTimes = 4; // A word can repeat with the config number
  maxBecomeCurators = 20;
}
