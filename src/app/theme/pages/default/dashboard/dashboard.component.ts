import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener
} from '@angular/core';
import { SessionData } from 'src/app/models/session.data.model';
import { Router } from '@angular/router';
import { ApiUrl } from 'src/app/utils/apiUrl';
import { Constants } from 'src/app/utils/constants';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { PanelService } from 'src/app/services/panel.service';
import { AccountService } from 'src/app/services/account.service';
import { CommonService } from 'src/app/services/common.service';
import { _ } from 'underscore';
import { PlayerComponent } from 'src/app/theme/partials/player/player.component';

declare var moment: any;
declare var mApp: any;
declare var toastr: any;
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public sessionData: SessionData;
  bsConfig: Partial<BsDatepickerConfig> = {
    rangeInputFormat: 'MM/DD/YYYY',
    containerClass: 'theme-blue'
  };
  paging = {
    currentPage: 1,
    pageSize: this.constants.pageSize,
    total: 0,
    firstEntry: 0,
    lastEntry: 0,
    count: 0
  };
  pagingProject = {
    currentPage: 1,
    pageSize: this.constants.pageSize,
    total: 0,
    firstEntry: 0,
    lastEntry: 0,
    count: 0
  };
  footageResult: any = [];
  projectResult: any = [];
  allowShow = false;
  avatarUrlB: string = this.apiUrl.get_avatar.replace('{defaultType}', 'B');
  summaryInfo: any = {};
  members: any = {};
  keywordSearch = '';
  searchKeyWords = '';
  trendingData = {
    Keywords: [],
    Results: []
  };
  dates: any = {
    maxDate: new Date(),
    fromDate: new Date(),
    toDate: new Date(),
    maxFromDate: new Date()
  };
  playVideoUrl = this.apiUrl.get_footage_video.replace(
    '{memberId}',
    localStorage.getItem('userid')
  );
  public thumbnailUrl = this.apiUrl.thumbnail.replace(
    '{memberId}',
    localStorage.getItem('userid')
  );
  public barChart: GoogleChartInterface;
  public totalEarnings = 0;
  public availableCuration = true;
  public periods: any = [];
  public periodValue = 90;
  public recentlyOnlineFootages: any;
  notifications: any = [];
  isNew: boolean;
  placementNotification = 'left';
  enable = false;
  @ViewChild(PlayerComponent) videoModal: PlayerComponent;
  set PlayerComponent(value: PlayerComponent) {
    this.videoModal = value;
  }
  @ViewChild('searchFootageOrProject') searchFootageOrProject: ElementRef;
  @ViewChild('searchReferralMembers') searchReferralMembers: ElementRef;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    const width = window.innerWidth;
    if (width < 768) {
      this.placementNotification = 'top';
    } else {
      this.placementNotification = 'left';
    }
  }
  constructor(
    private authenticateService: AuthenticateService,
    private panelService: PanelService,
    private router: Router,
    private apiUrl: ApiUrl,
    private constants: Constants,
    private accountService: AccountService,
    private commonService: CommonService
  ) {
    this.periods = this.commonService.getPeriods();
    this.dates.fromDate.setDate(this.dates.toDate.getDate() - this.periodValue);
    this.dates.maxFromDate.setDate(this.dates.toDate.getDate() - 1);
    this.authenticateService.getSessionData().subscribe(o => {
      this.sessionData = o;
    });
    this.barChart = {
      chartType: 'ColumnChart',
      dataTable: [
        ['Year', 'USD', { role: 'annotation' }],
        ['N/A', 0, '0']
      ],
      options: {
        title: '',
        animation: {
          duration: 500,
          easing: 'ease-in-out',
          startup: true
        },
        legend: 'none',
        vAxis: {
          minValue: 0,
          maxValue: 50,
          format: '$#'
        },
        colors: ['#c5c5c5'],
        height: this.sessionData.isCurator ? 255 : 194,
        width: '100%',
        chartArea: {
          left: 50,
          right: 20,
          top: 25,
          bottom: 30
        }
      }
    };
    this.isNew = false;
  }

  ngOnInit() {
    mApp.unblockPage();
    const self = this;
    self.initialize();
    const availableCuration = JSON.parse(
      localStorage.getItem('availableCuration')
    );

    if (availableCuration != null) {
      self.availableCuration = availableCuration;
    }
    setTimeout(() => {
      this.enable = true;
    }, 100);
  }

  initialize() {
    const self = this;

    self.getRecentlyOnlineFootages();
    self.filterByPeriod();
    self.getSummaryInfo();
    self.getNotifications();
  }

  getEarningsChartData(fromDate: Date, toDate: Date) {
    fromDate = new Date(fromDate);
    toDate = new Date(toDate);
    const self = this;
    // self.totalEarnings = 0;
    let totalEarnings = 0;
    self.panelService
      .getEarningsChartData(fromDate, toDate)
      .then((response: any) => {
        if (response) {
          self.barChart.dataTable = [['Year', 'USD', { role: 'annotation' }]];
          response.items.forEach(item => {
            totalEarnings += item.earned;
            self.barChart.dataTable.push([
              item.period,
              item.earned,
              '' + item.earned + ''
            ]);
          });
          self.totalEarnings = totalEarnings;
          setTimeout(() => {
            self.barChart.component.draw();
          }, 2000);
        }
      });
  }

  getSummaryInfo() {
    const self = this;
    self.panelService.getSummaryInfo().then(
      (response: any) => {
        if (response) {
          self.summaryInfo = response;
        }
      },
      err => {
        self.summaryInfo = {
          RevenueToDate: '0.00',
          RevenueThisMonth: '0.00',
          MemberStatus: 'Regular',
          MembershipDue: 'N/A',
          OutstandingCollaborativeInvitations: 0,
          AvailableOpportunities: 0
        };
      }
    );
  }

  gotoFootageProjectCollaborate(numProject) {
    const self = this;
    if (numProject > 0) {
      self.router.navigate(['my-blackbox/marketplace']);
    }
  }

  showReferralList(numReferral) {
    const self = this;
    if (numReferral > 0) {
      self.panelService.getReferralList().then((result: any) => {
        if (result) {
          self.members = result;
          console.log(self.members);
          $('#referralMemberModal').modal('show');
        }
      });
    }
  }

  search() {
    const self = this;
    self.allowShow = true;
    mApp.blockPage();
    if (self.sessionData.isAdmin) {
      self.panelService
        .searchAdminFootage(
          (self.paging.currentPage - 1) * self.paging.pageSize + 1,
          self.paging.pageSize,
          self.searchKeyWords
        )
        .then((result: any) => {
          if (result) {
            mApp.unblockPage();
            self.footageResult = result.list;
            self.paging.total = result.pageInfo.totalRecords;
            self.paging.count = result.pageInfo.totalDisplayRecords;
          }
        });
      self.panelService
        .searchAdminProject(
          (self.pagingProject.currentPage - 1) * self.pagingProject.pageSize +
            1,
          self.pagingProject.pageSize,
          self.searchKeyWords
        )
        .then((result: any) => {
          if (result) {
            self.projectResult = result.list;
            self.pagingProject.total = result.pageInfo.totalRecords;
            self.pagingProject.count = result.pageInfo.totalDisplayRecords;
          }
        });
    } else {
      self.panelService
        .searchFootage(
          (self.paging.currentPage - 1) * self.paging.pageSize + 1,
          self.paging.pageSize,
          self.searchKeyWords
        )
        .then((result: any) => {
          mApp.unblockPage();
          if (result.success) {
            self.footageResult = result.data.list;
            self.paging.total = result.data.pageInfo.totalRecords;
            self.paging.count = result.data.pageInfo.totalDisplayRecords;
          }
        });
      self.panelService
        .searchProject(
          (self.pagingProject.currentPage - 1) * self.pagingProject.pageSize +
            1,
          self.pagingProject.pageSize,
          self.searchKeyWords
        )
        .then((result: any) => {
          if (result.success) {
            self.projectResult = result.data.list;
            self.pagingProject.total = result.data.pageInfo.totalRecords;
            self.pagingProject.count = result.data.pageInfo.totalDisplayRecords;
          }
        });
    }
  }

  previewFootage(footage: any) {
    const self = this;
    self.videoModal.play(footage);
  }

  pageFootageResult(currentPage: any) {
    console.log(currentPage);
    const self = this;
    self.paging.currentPage = currentPage.page;
    self.search();
  }

  pageProjectResult(currentPage: any) {
    console.log(currentPage);
    const self = this;
    self.pagingProject.currentPage = currentPage.page;
    self.search();
  }

  filterByPeriod() {
    const self = this;
    console.log('filterByPeriod', self.periodValue);
    self.periodValue = Number(self.periodValue);
    if (self.periodValue !== 0) {
      self.dates.fromDate = new Date();
      self.dates.toDate = new Date();
      if (self.periodValue === 2017 || self.periodValue === 2018) {
        self.dates.fromDate = new Date(self.periodValue, 0, 1);
        self.dates.toDate = new Date(self.periodValue, 11, 1);
        const toDate = moment(self.dates.toDate).endOf('month');
        self.dates.toDate = new Date(toDate);
      } else {
        self.dates.fromDate.setDate(
          self.dates.fromDate.getDate() - self.periodValue
        );
      }

      self.getEarningsChartData(self.dates.fromDate, self.dates.toDate);
    } else {
      return;
    }
  }

  onChangeFromDate(value) {
    const self = this;

    if (value && value !== 'Invalid Date') {
      self.dates.fromDate = value;
      self.getEarningsChartData(self.dates.fromDate, self.dates.toDate);
    }
  }

  onChangeToDate(value) {
    const self = this;
    if (value && value !== 'Invalid Date') {
      self.dates.toDate = value;
      const maxFromDate = moment(self.dates.toDate)
        .subtract(1, 'days')
        .format();
      self.dates.maxFromDate = new Date(maxFromDate);
      self.getEarningsChartData(self.dates.fromDate, self.dates.toDate);
    }
  }

  changeCuration() {
    const self = this;
    const info = {
      availableCuration: self.availableCuration
    };

    localStorage.setItem(
      'availableCuration',
      self.availableCuration.toString()
    );
    self.accountService.changeCuration(info);
  }

  onResize(event) {
    const self = this;

    self.getEarningsChartData(self.dates.fromDate, self.dates.toDate);
  }

  getRecentlyOnlineFootages() {
    const self = this;

    // self.panelService.getRecentlyOnlineFootages().then((result: any) => {
    //   console.log(result);
    //   if (result.success) {
    //     self.recentlyOnlineFootages = result.data;
    //     console.log(self.recentlyOnlineFootages)

    //     setTimeout(() => {
    //       plyr.setup('video', self.constants.videoControlsOptionsPanel);
    //     }, 250);
    //   }
    // });
    mApp.block('#footage');
    self.panelService.getTrendingData().then((result: any) => {
      if (result) {
        const list = result.list;
        list.forEach(footage => {
          footage.footageId = footage.id;
        });
        mApp.unblock('#footage');
        self.recentlyOnlineFootages = list;
        console.log(list);
      }
    });
  }

  getNotifications() {
    const self = this;

    self.panelService.getNotifications().then((result: any) => {
      console.log(result);
      self.notifications = result.data;
      self.notifications = _.map(self.notifications, item => {
        item.message = item.message.replace(/\n/g, '<br>');
        return item;
      });
      self.checkNewNotifications();
    });
  }

  shorten(txt: string, i: number) {
    const title = txt;
    let titleSlice = '';
    if (title.length > 50) {
      titleSlice += title.slice(0, 50);
      const a = titleSlice.split(' ');
      a.pop();
      titleSlice = a.join(' ');
      titleSlice += '...';
    } else {
      titleSlice += title;
    }
    return titleSlice;
  }

  readNotification(notification: any) {
    const self = this;

    if (notification.memberNotificationStatus !== 'read') {
      self.notifications = _.map(self.notifications, item => {
        if (item.notificationId === notification.notificationId) {
          item.memberNotificationStatus = 'read';
        }
        return item;
      });

      notification.memberNotificationStatus = 'read';
      self.panelService.updateNotification(notification);
      self.checkNewNotifications();
    }
  }

  checkNewNotifications() {
    let isNew = false;

    isNew = _.some(this.notifications, item => {
      return item.memberNotificationStatus === 'new';
    });

    this.isNew = isNew;
  }

  removeNotification(notification: any) {
    const self = this;

    notification.memberNotificationStatus = 'removed';

    self.panelService
      .updateNotification(notification)
      .then((result: any) => {
        console.log(result);
        if (result.success) {
          self.notifications = _.reject(self.notifications, item => {
            return item.notificationId === notification.notificationId;
          });
          self.checkNewNotifications();
          toastr.success('Removed successfully!', 'Success');
        }
      });
  }

  clearSearch() {
    this.searchKeyWords = '';
    this.search();
    this.searchFootageOrProject.nativeElement.focus();
  }

  clearSearchReferralMembers() {
    this.keywordSearch = '';
    this.searchReferralMembers.nativeElement.focus();
  }

  onChangeSearchKeywords() {
    if (!this.searchKeyWords) {
      this.search();
      this.allowShow = false;
    }
  }

  goLocated(item, isProject?) {
    console.log(item);
    if (!isProject) {
      if (item.submissionDate === null) {
        this.router.navigate(['/my-blackbox/workspace']);
      } else {
        this.router.navigate(['/my-blackbox/submitted-content']);
      }
    }

    if (isProject) {
      if (item.status === 'available') {
        this.router.navigate(['/my-blackbox/marketplace']);
      } else {
        this.router.navigate(['/my-blackbox/my-collaboration']);
      }
    }
  }

}
