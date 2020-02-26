import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Constants } from 'src/app/utils/constants';
import { CommonService } from 'src/app/services/common.service';
import { UploadService } from 'src/app/services/upload.service';
import { ApiUrl } from 'src/app/utils/apiUrl';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/services/shared-service';
import { Router } from '@angular/router';
import { MediaProductService } from 'src/app/services/media-product.service';
import { Utils } from 'src/app/utils/utils';
import { ProjectsService } from 'src/app/services/projects.service';
import { VideoModalComponent } from 'src/app/theme/partials/video-modal/video-modal.component';
import { MyBlackboxComponent } from '../../my-blackbox.component';
import { RatingComponent } from 'src/app/theme/partials/rating/rating.component';

declare var $: any;
declare var moment: any;
declare var mApp: any;
@Component({
  selector: 'app-list-footage-content',
  templateUrl: './list-footage-content.component.html',
  styles: []
})
export class ListFootageContentComponent implements OnInit {
  public thumbnailUrl: string;
  public thumbnailMediaProductUrl: string;
  public paging: any = {
    currentPage: 1,
    pageSize: this.constants.pageSize,
    total: 0,
    firstEntry: 0,
    lastEntry: 0,
    count: 0,
    pageSizeList: this.constants.pageSizeList,
    goToPage: null
  };
  public contentFilters: any = [];
  public statusFilters: any = [];
  public keywords: string = '';
  public contentFilter: string = 'O';
  public filterStatus: string = '';
  public footages: any = [];
  allowShow: boolean = false;
  public currentFootage: any;
  public masterData: any = {};
  listSubmittedContentType: any = [];
  contentType: string = 'footage';
  infoSubmitContentPage: any = {};
  public footageRating: any = null;
  public curatorRating: any = null;
  @ViewChild('videoModal') public videoModal: VideoModalComponent;
  @ViewChild('search') search: ElementRef;
  @ViewChild('ratingModal') public ratingModal: RatingComponent;
  tempProjectId: string = '';
  constructor(
    private constants: Constants,
    private commonService: CommonService,
    private uploadService: UploadService,
    private apiUrl: ApiUrl,
    private toastr: ToastrService,
    private myBlackboxComponent: MyBlackboxComponent,
    private sharedService: SharedService,
    private router: Router,
    private mediaProductService: MediaProductService,
    private utils: Utils,
    private projectsService: ProjectsService
  ) {
    this.contentFilters = commonService.getContentFilter();
    this.statusFilters = commonService.getFootageStatus();
    this.listSubmittedContentType = commonService.getSubmittedContentType();
    this.masterData = {
      footageCategories: commonService.getFootageCategories(),
      countries: commonService.getCountries()
    };
  }

  ngOnInit() {
    var self = this;
    var memberId = localStorage.getItem('userid');
    self.thumbnailUrl = self.apiUrl.thumbnail.replace('{memberId}', memberId);
    self.thumbnailMediaProductUrl = self.apiUrl.thumbnail_media_products.replace(
      '{memberId}',
      memberId
    );
    self.sharedService.infoSubmitContentPage$.subscribe(info => {
      if (info != '') {
        self.paging = info.paging;
        self.contentType = info.contentType;
        self.contentFilter = info.contentFilter;
        self.filterStatus = info.filterStatus;
        self.keywords = info.keywords;
        self.infoSubmitContentPage = self.utils.clone(info);
      }
    });
    self.loadFootages();
  }

  showHelpModal() {
    $('#help-footage-content-modal').modal('show');
  }

  filterFootages() {
    this.paging.goToPage = null;
    this.paging.currentPage = 1;
    this.loadFootages();
  }
  setAllowRating(): void {
    this.footages?.forEach(footage => {
      footage.allowRating = false;
      if (footage.sharers.length > 0) {
        var curatorExist = footage.sharers.find(
          item => item.collabType == 'curator'
        );
        if (
          curatorExist &&
          (footage.transitionStatus == 'ready' ||
            footage.transitionStatus == 'online')
        ) {
          footage.allowRating = true;
        }
      }
    });
  }
  loadFootages() {
    var self = this;
    mApp.blockPage();
    self.allowShow = false;
    if (self.contentType === 'footage') {
      self.uploadService
        .getContentFootages(
          self.paging.currentPage * self.paging.pageSize +
            1 -
            self.paging.pageSize,
          self.paging.pageSize,
          self.keywords,
          self.contentFilter,
          self.filterStatus
        )
        .then(
          (result: any) => {
            console.log(result);
            mApp.unblockPage();
            if (!result) {
              return false;
            }
            if (self.paging.currentPage > 1 && result.list.length == 0) {
              self.paging.currentPage -= 1;
              return self.loadFootages();
            }
            self.footages = result.list;
            self.setAllowRating();
            self.allowShow = !self.footages?.length ? true : false;
            self.paging.total = result.pageInfo.totalRecords;
            self.paging.count = result.pageInfo.totalDisplayRecords;
            self.myBlackboxComponent.countFootages();
            if (self.infoSubmitContentPage.removeInfo) {
              self.sharedService.emitInfoSubmitContentPage('');
            }
          },
          error => {
            console.log(error);
          }
        );
    }

    if (self.contentType === 'media product') {
      console.log(self.contentType);
      self.mediaProductService
        .getSubmittedMediaProducts(
          self.paging.currentPage * self.paging.pageSize +
            1 -
            self.paging.pageSize,
          self.paging.pageSize,
          self.keywords
        )
        .then(
          (result: any) => {
            console.log(result);
            mApp.unblockPage();
            if (!result) {
              return false;
            }
            if (self.paging.currentPage > 1 && result.list.length == 0) {
              self.paging.currentPage -= 1;
              return self.loadFootages();
            }
            self.footages = result.list;
            self.setAllowRating();
            self.allowShow = !self.footages?.length ? true : false;
            self.paging.total = result.pageInfo.totalRecords;
            self.paging.count = result.pageInfo.totalDisplayRecords;
            self.myBlackboxComponent.countFootages();
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  previewFootage(footage: any) {
    var self = this;
    self.videoModal.previewFootage(footage);
  }

  page(currentPage: any) {
    var self = this;
    if (self.paging.currentPage == currentPage.page) {
      return;
    }
    self.paging.currentPage = currentPage.page;
    self.loadFootages();
    if (this.paging.currentPage != this.paging.goToPage) {
      this.paging.goToPage = null;
    }
  }

  pageSizeChange() {
    this.paging.goToPage = null;
    this.pageChanged(1, this.paging.pageSize);
  }

  pageChanged(page, pageSize, total?) {
    var self = this;
    self.paging.currentPage = page;
    self.loadFootages();
  }

  viewInventory(footage: any) {
    var self = this;
    self.currentFootage = JSON.parse(JSON.stringify(footage));
    self.currentFootage.sharers = footage.sharers;

    if (this.contentType === 'footage') {
      if (self.currentFootage.editorial) {
        var editorialDate = moment.utc(footage.editorialDate);
        var year = editorialDate.get('year');
        var month = editorialDate.get('month');
        var date = editorialDate.get('date');
        self.currentFootage.editorialDate = new Date(year, month, date);
      }

      self.uploadService
        .getFootageDocuments(footage.footageId, true, false, footage)
        .then((result: any) => {
          self.currentFootage.modelDocuments = result.list;
        });

      self.uploadService
        .getFootageDocuments(footage.footageId, false, true, footage)
        .then((result: any) => {
          self.currentFootage.propertyDocuments = result.list;
        });
      console.log(self.currentFootage);
      $('#footageView-modal').modal('show');
    } else {
      $('#media-product-info-modal').modal('show');
    }
  }

  approveInventory(footage: any) {
    var self = this;
    self.tempProjectId = '';
    self.uploadService.approveFootage(footage).then((result: any) => {
      console.log(result);
      if (result) {
        if (result.message) {
          self.loadFootages();
          return self.toastr.error(result.message, 'Error');
        }

        self.toastr.success('Approved successfully!', 'Success');
        self.loadFootages();

        if (result.canComplete) {
          setTimeout(function() {
            $('#complete-project-modal').modal('show');
            self.tempProjectId = footage.projectId;
          }, 800);
        }
      }
    });
  }

  completeProject() {
    var self = this;
    self.uploadService
      .completeProject(self.tempProjectId)
      .then((result: any) => {
        if (result && result.status == 200) {
          self.toastr.success('Completed successfully!', 'Success');
        } else {
          self.toastr.error('Sorry! please try again!', 'Error');
        }
      });
    $('#complete-project-modal').modal('hide');
  }

  deleteInventory(footage) {
    var self = this;
    footage.deleting = true;
    self.uploadService.deleteFootages(footage).then((result: any) => {
      console.log(result);
      footage.deleting = false;
      if (result.ok && result.status == 204) {
        self.loadFootages();
        self.toastr.success(
          'The footage' + (footage.footageTitle || '') + ' has been deleted!',
          'Success'
        );
      } else {
        self.toastr.error(
          'Cannnot delete footage ' + (footage.footageTitle || ''),
          'Error'
        );
      }
    });
  }

  rejectInventory(footage: any) {
    var self = this;
    self.uploadService.rejectFootage(footage).then((result: any) => {
      if (result) {
        self.toastr.success('Rejected successfully!', 'Success');
        self.loadFootages();
      }
    });
  }

  editFootage(footage: any) {
    var self = this;
    if (footage.editorial) {
      var editorialDate = moment.utc(footage.editorialDate);
      var year = editorialDate.get('year');
      var month = editorialDate.get('month');
      var date = editorialDate.get('date');
      footage.editorialDate = new Date(year, month, date);
    }
    footage.documents = {
      modelDocuments: [],
      propertyDocuments: []
    };
    self.sharedService.emitFootageContent(footage);
    let info = {
      paging: self.paging,
      contentType: self.contentType,
      contentFilter: self.contentFilter,
      filterStatus: self.filterStatus,
      keywords: self.keywords,
      removeInfo: false
    };
    self.sharedService.emitInfoSubmitContentPage(info);
    self.router.navigate(['my-blackbox/submitted-content/edit']);
  }

  clearSearch() {
    this.keywords = '';
    this.filterFootages();
    this.search.nativeElement.focus();
  }

  canDelete(footage) {
    if (
      footage.canDelete &&
      footage.memberId === localStorage.getItem('userid')
    ) {
      return true;
    }
    return false;
  }

  goToPage() {
    if (this.paging.goToPage && !isNaN(this.paging.goToPage)) {
      var minPage = 1,
        maxPage = Math.ceil(this.paging.total / this.paging.pageSize);
      this.paging.goToPage =
        this.paging.goToPage < minPage ? minPage : this.paging.goToPage;
      this.paging.goToPage =
        this.paging.goToPage > maxPage ? maxPage : this.paging.goToPage;
      this.page({ page: this.paging.goToPage });
    }
  }
  openRatingModal(footage): void {
    var self = this;
    this.footageRating = footage;
    this.curatorRating = footage.sharers.find(
      item => item.collabType == 'curator'
    );
    if (this.curatorRating) {
      this.projectsService
        .getInfoCuratorRating(
          this.curatorRating.id,
          footage.footageId,
          'footage'
        )
        .then(function(result: any) {
          if (result.success) {
            var rating = result.data;
            self.curatorRating.curatorId = self.curatorRating.id;
            self.curatorRating.footageId = footage.footageId;
            self.curatorRating.projectId = null;
            self.curatorRating.name = footage.originalFileName;
            self.curatorRating.rated = footage.rated;
            if (!footage.rated) {
              self.curatorRating.numberRating = 0;
              self.curatorRating.commentRating = '';
              // self.curatorRating.numberOfProject = result.countProjectJoined;
              self.curatorRating.numberOfFootage = result.countFootageJoined;
              // self.curatorRating.rejectRateAtBB = result.countRejectRateAtBB;
              // self.curatorRating.rejectRateAtStorefront = result.countRejectRateAtStorefront;
              // self.curatorRating.numberOfFootageSold = result.countFootageSold;
              self.curatorRating.ratingType = 'positive';
            } else {
              self.curatorRating.numberRating = rating.numberRating;
              self.curatorRating.comment = rating.comment;
              var metaData = JSON.parse(rating.metaData);
              // self.curatorRating.numberOfProject = metaData.numberOfProject;
              self.curatorRating.numberOfFootage = metaData.numberOfFootage;
              // self.curatorRating.rejectRateAtBB = metaData.rejectRateAtBB;
              // self.curatorRating.rejectRateAtStorefront = metaData.rejectRateAtStorefront;
              // self.curatorRating.numberOfFootageSold = metaData.numberOfFootageSold;
              self.curatorRating.ratingType = rating.ratingType;
            }
            self.ratingModal.openModalRating(self.curatorRating);
          }
        });
    }
  }
  saveRating(info): void {
    var self = this;
    this.projectsService.addRating(info).then(function(result: any) {
      result = result.json();
      if (result.success) {
        self.toastr.success('Rating for curator success');
        self.footageRating.rated = true;
        self.ratingModal.doneRating();
      }
    });
  }
}
