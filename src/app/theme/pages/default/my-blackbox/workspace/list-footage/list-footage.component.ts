import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ElementRef
} from '@angular/core';
import { ApiUrl } from '../../../../../../utils/apiUrl';
import { UploadService } from '../../../../../../services/upload.service';
import { CommonService } from '../../../../../../services/common.service';
import { Constants } from '../../../../../../utils/constants';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ProjectsService } from '../../../../../../services/projects.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/internal/operators';
import { SharedService } from '../../../../../../services/shared-service';
import { AccountService } from '../../../../../../services/account.service';
import { ModalDirective } from 'ngx-bootstrap';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { AuthenticateService } from '../../../../../../services/authenticate.service';
import { ReleaseService } from 'src/app/services/release.service';
import { CameraService } from 'src/app/services/camera.service';
import { Utils } from 'src/app/utils/utils';
import * as keywordData from '../../../../../../../assets/auto-complete/keywords.json';
import { MyBlackboxComponent } from '../../my-blackbox.component';
import { RatingComponent } from 'src/app/theme/partials/rating/rating.component';
import { VideoModalComponent } from 'src/app/theme/partials/video-modal/video-modal.component';
import * as _ from 'underscore';

declare var $: any;
declare var mApp: any;
declare var moment: any;
@Component({
  selector: 'app-list-footage',
  templateUrl: './list-footage.component.html',
  styleUrls: ['./list-footage.component.css']
})
export class ListFootageComponent implements OnInit {
  @ViewChild('inputBatchName') inputBatchName: ElementRef;
  @ViewChild('confirmAssignCuratorModal')
  confirmAssignCuratorModal: ModalDirective;
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
  public pagingSharer = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    count: 0
  };

  pagingCurator = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    count: 0
  };
  keywords: any = '';
  filterStatus: any = '';
  public statusFilters: any;
  public allowShow: boolean = false;
  public allowShowFootage: boolean = false;
  public footages: any = [];
  public oldFootages: any = [];
  public thumbnailUrl: string;
  public keyUp = new Subject<string>();
  public listSelectedFootages: any = [];
  public partner = {
    sharer: 'sharer',
    curator: 'curator'
  };
  public keywordSearch = {
    text: ''
  };
  public memberAttributeList: any = [];
  public memberAttribute: string = 'email';
  public sharers: any = [];
  public totalPercentStatus: boolean = false;
  public selectedSharer: any = [];
  public currentFootage: any = {
    documents: {
      modelDocuments: [],
      propertyDocuments: []
    }
  };
  public currentSharers: any = [];
  public allowShowListSharers: boolean = false;
  public totalPercent: number = 0;
  public tempFootage: any = {};
  public invalidDesc: boolean;
  public keywordsArray: any = [];
  public keywordsDocument: string = '';
  public listDocumentModels: any = [];
  public listDocumentProperty: any = [];
  public masterData: any = [];
  public documentsInfo: any = {
    age: false,
    ethnicity: false,
    gender: false,
    status: false
  };
  public statusErrorDocumentsInfo: boolean = false;
  public statusValidDocumentInfo: boolean = false;
  public footageCheck: any = {};
  public maxDate: Date;
  public position: number;
  public checkAllFootages: boolean = false;
  public curators: any = [];
  public selectedCurator: any = {};
  public avatarUrlB: string = this.apiUrl.get_avatar.replace(
    '{defaultType}',
    'B'
  );
  public isValidPercentage: boolean = false;
  public listFootageAssignCurator: any = [];
  public listFootageSelectAssignCurator: any = [];
  public searchFootage: string = '';
  public notFootagesSelected: boolean = false;
  public notCuratorSelected: boolean = false;
  public batchName: string = '';
  public statusBatchName: boolean = false;
  public errorMessage: string = '';
  public listFootageSubmit: any = [];
  public listFootageSelectSubmit: any = [];
  public contentSubmitConfirm: string = '';
  public canSaveLocal: boolean = false;
  public temp: any = [];
  public showTips: boolean = false;
  public spinnerAssignCurator: boolean = false;
  public spinnerSubmit: boolean = false;
  getReleaseType: any = [];
  releaseType: string = 'm';
  canReminder: boolean = false;
  modelReleases: any = [];
  propertyReleases: any = [];
  newDocumentId: string = '';
  isUploadRelease: boolean = false;
  keywordSearchRelease: string = '';
  currentDocument: any = {};
  isLoadingCurators: boolean = false;
  isSaveChanges: boolean = false;
  countModelReleases: number = 0;
  countPropertyReleases: number = 0;
  listFootageRejected: any = {};
  debounceTimeChangeDescription: Subject<any> = new Subject<any>();
  submitStatus: boolean = false;
  isSubmitStatus: boolean = false;
  listFootageSelectSubmitRejected: any = [];
  currentFootageSubmitRejected: any = {};
  firstLoad: boolean = true;
  checkModalShow: boolean = false;
  currentCurators: any = [];
  batchNameFilter: string = '';
  listBatchName: any = [];
  canUploadProjectFiles: boolean = false;
  maxItem: any;
  isMissing = false;
  tempInfoCurationPage: any = {};
  isShowLink: boolean = false;
  isConfirm: boolean = false;
  responseMessage: string;
  creating: boolean = false;
  dataImage: any = [];
  isShowSubNote: boolean = false;
  public listKeywords: any = [];
  public dataKeywords: any = [];
  public listResentCollaborator: any = [];
  public footageRating: any = null;
  public curatorRating: any = null;
  @ViewChild('changeModelDocument') public changeModelDocument: ModalDirective;
  @ViewChild('submitFootagesConfirmModal')
  public submitFootagesConfirmModal: ModalDirective;
  @ViewChild('footageViewModal') public footageViewModal: ModalDirective;
  @ViewChild('checkFootagesSubmitModal')
  public checkFootagesSubmitModal: ModalDirective;
  @ViewChild('resubmissionText') public resubmissionText: ModalDirective;
  @ViewChild('resubmissionListText')
  public resubmissionListText: ModalDirective;
  @ViewChild('modalUploadRelease') public modalUploadRelease: ModalDirective;
  @ViewChild('csvUploadModal') public csvUploadModal: ModalDirective;
  @ViewChild('confirmRelease') confirmRelease: ModalDirective;
  @ViewChild('videoModal') public videoModal: VideoModalComponent;
  @ViewChild('errorMessageModal') public errorMessageModal: ModalDirective;
  @ViewChild(BsDatepickerDirective) public datepicker: BsDatepickerDirective;
  @ViewChild('search') search: ElementRef;
  @ViewChild('searchSharer') searchSharer: ElementRef;
  @ViewChild('searchCurator') searchCurator: ElementRef;
  @ViewChild('searchFootageClear') searchFootageClear: ElementRef;
  @ViewChild('searchFootageSubmitClear') searchFootageSubmitClear: ElementRef;
  @ViewChild('searchFootageSubmitRejectedClear')
  searchFootageSubmitRejectedClear: ElementRef;
  @ViewChild('searchModelDocuments') searchModelDocuments: ElementRef;
  @ViewChild('searchPropertyDocuments') searchPropertyDocuments: ElementRef;
  @ViewChild('checkCuratorListModal') checkCuratorListModal: ModalDirective;
  @ViewChild('curatorListModal') curatorListModal: ModalDirective;
  @ViewChild('sharersModal') sharersModal: ModalDirective;
  @ViewChild('confirmModal') confirmModal: ModalDirective;
  @ViewChild('viewReleaseModal') viewReleaseModal: ModalDirective;
  @ViewChild('ratingModal') ratingModal: RatingComponent;

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    console.debug('Scroll Event');
  }
  constructor(
    private cameraService: CameraService,
    private apiUrl: ApiUrl,
    private constants: Constants,
    private uploadService: UploadService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private projectsService: ProjectsService,
    private sharedService: SharedService,
    private accountService: AccountService,
    private router: Router,
    private authenticateService: AuthenticateService,
    private myBlackboxComponent: MyBlackboxComponent,
    private releaseService: ReleaseService,
    private utils: Utils
  ) {
    this.statusFilters = commonService.getStatusFootages();
    this.maxItem = this.constants.maxKeyword;
    this.masterData = {
      modelEthnicities: commonService.getModelEthnicities(),
      modelAges: commonService.getModelAges(),
      modelGenders: commonService.getModelGenders(),
      countries: commonService.getCountries(),
      footageCategories: commonService.getFootageCategories()
    };
    this.getReleaseType = commonService.getReleaseType();
    this.maxDate = new Date();

    this.debounceTimeChangeDescription
      .pipe(debounceTime(2000))
      .subscribe(footage => {
        this.checkValidDesc(footage);
        return;
      });
    this.memberAttributeList = commonService.getMemberSearchAttributes();
  }

  async ngOnInit() {
    var self = this;
    var memberId = localStorage.getItem('userid');
    self.thumbnailUrl = self.apiUrl.thumbnail.replace('{memberId}', memberId);
    self.sharedService.infoWorkspacePage$.subscribe(info => {
      if (info != '') {
        self.paging = info.paging;
        self.filterStatus = info.filterStatus;
        self.keywords = info.keywords;
        self.tempInfoCurationPage = self.utils.clone(info);
      }
    });
    self.loadFootages();
    self.checkUploadProjectFilesStatus();
    self.checkMissingCameraType();
    await self.initializeDocumentUpload();
    self.initializeCsvUploadModal();
    self.sharedService.infoModal$.subscribe(modalName => {
      if (modalName != '') {
        var modal = JSON.parse(modalName);
        console.log(modal);
        if (modal.id == 'modalUploadRelease' && modal.check) {
          self.checkModalShow = true;
          self.showUploadRelease();
        }
      }
    });
    var keywords: any = keywordData;
    this.dataKeywords = keywords.default;
  }
  checkShowTips(count: number) {
    var self = this;
    self.firstLoad = false;
    var currentUserConfig: any = JSON.parse(
      localStorage.getItem(self.accountService.getUserId())
    );
    var userConfig: any = {};
    if (count > 0) {
      if (currentUserConfig) {
        userConfig = currentUserConfig;
        if (userConfig.showTips == null) {
          userConfig.showTips = false;
          self.authenticateService.saveByUser(JSON.stringify(userConfig));
          self.showTips = userConfig.showTips;
        } else {
          self.showTips = userConfig.showTips;
        }
      } else {
        userConfig.showTips = false;
        self.authenticateService.saveByUser(JSON.stringify(userConfig));
        self.showTips = userConfig.showTips;
      }
    } else {
      if (currentUserConfig) {
        userConfig = currentUserConfig;
        if (userConfig.showTips == null) {
          self.showTips = true;
        }
        if (userConfig.showTips == false) {
          self.showTips = false;
        }
      } else {
        self.showTips = true;
      }
    }
  }

  checkMissingCameraType() {
    this.cameraService.getDefaultCamera().then((result: any) => {
      if (result.data) {
        this.isMissing = false;
      } else {
        this.isMissing = true;
      }
    });
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

  checkUploadProjectFilesStatus() {
    this.uploadService.checkUploadProject().then((result: any) => {
      console.log(result);
      this.canUploadProjectFiles = result.count > 0 ? true : false;
    });
  }

  showProjectUpload() {
    this.router.navigate(['my-blackbox/my-collaboration'], {
      queryParams: { collaborateFilter: 'U' }
    });
  }

  loadFootages() {
    var self = this;
    mApp.blockPage();
    var footageCategories = self.commonService.getFootageCategories();
    self.allowShowFootage = false;
    self.allowShow = false;
    self.uploadService
      .getFootages(
        self.paging.currentPage * self.paging.pageSize +
          1 -
          self.paging.pageSize,
        self.paging.pageSize,
        self.keywords,
        self.filterStatus
      )
      .then(function(result: any) {
        if (!result.success) {
          return false;
        }
        if (self.paging.currentPage > 1 && result.data.list.length == 0) {
          self.paging.currentPage -= 1;
          return self.loadFootages();
        }
        self.footages = result.data.list;
        var listFootageIds = self.footages.map(item => {
          return item.footageId;
        });
        self.sharedService.emitListFootageIds(listFootageIds);
        self.allowShow = !self.footages.length ? true : false;
        self.allowShowFootage = self.footages.length ? true : false;
        self.paging.total = result.data.pageInfo.totalRecords;
        self.myBlackboxComponent.countFootages();
        self.paging.count = result.data.pageInfo.totalDisplayRecords;
        let footages = self.footages;
        footages = _.map(self.footages, (footage: any) => {
          footage.modelDocuments = [];
          footage.propertyDocuments = [];
          footage.isDescription = false;
          footage.isKeywords = false;
          footage.isReleases = false;
          footage.invalidDesc = false;
          footage.invalidKeywords = false;
          footage.curatorCheck = false;
          footage.batchCheck = false;
          footage.check = false;
          if (footage.category == null) {
            footage.category = '';
          }
          if (footage.description == null) {
            footage.description = '';
          }
          if (footage.description) {
            footage.descriptionCharacters = footage.description.replace(
              /\s/g,
              ''
            );
          }
          if (footage.keywords == null || footage.keywords == '') {
            footage.keywordsArray = [];
          } else {
            var keywordsArray = footage.keywords;
            keywordsArray = keywordsArray.split(',').map(String);
            var keywords = footage.keywords;
            keywords = keywords.split(',').join(', ');
            footage.keywords = keywords;

            keywordsArray = _.map(keywordsArray, item => {
              var obj: any = {};
              obj.value = item;
              obj.display = item;
              return obj;
            });
            footage.keywordsArray = keywordsArray;
          }
        });
        self.dataOldFootage();

        self.checkAllFootages = false;
        mApp.unblockPage();
        console.log(self.footages);
        if (self.firstLoad) {
          self.checkShowTips(self.footages.length);
        }
        if (self.tempInfoCurationPage.removeData) {
          self.sharedService.emitInfoWorkspacePage('');
        }
      });
  }

  dataOldFootage() {
    var self = this;
    self.oldFootages = JSON.parse(JSON.stringify(self.footages));
    self.footages.forEach(footage => {
      self.oldFootages.forEach(oldFootage => {
        if (oldFootage.footageId == footage.footageId) {
          oldFootage.keywordsArray = footage.keywordsArray;
          // oldFootage.modelDocuments = footage.modelDocuments;
          // oldFootage.propertyDocuments = footage.propertyDocuments;
          oldFootage.rejectedReason = footage.rejectedReason;
          oldFootage.sharers = footage.sharers;
          oldFootage.documents = footage.documents;
        }
      });
    });
  }

  pageChanged(page, pageSize, total?) {
    var self = this;
    self.paging.currentPage = page;
    self.allowShowFootage = false;
    self.loadFootages();
  }

  pageSizeChange() {
    this.paging.goToPage = null;
    this.pageChanged(1, this.paging.pageSize);
  }

  filterFootages() {
    var self = this;
    this.paging.goToPage = null;
    self.paging.currentPage = 1;
    self.allowShowFootage = false;
    self.loadFootages();
  }

  deleteFootage(footage) {
    var self = this;
    var id = '#' + footage.footageId;
    mApp.block(id, {
      overlayColor: '#000000',
      type: 'loader',
      state: 'success',
      message: 'Please wait...'
    });
    self.uploadService.deleteFootages(footage).then(
      (res: any) => {
        if (res.ok && res.status == 204) {
          console.log(res);
          self.toastr.success('Deleted successfully!', 'Success');
          mApp.unblock(id);
          self.loadFootages();
        } else {
          self.toastr.error('Error');
        }
      },
      function(error) {
        console.log(error);
      }
    );
  }

  editFootage(footage: any) {
    var self = this;
    if (footage.editorialDate) {
      var editorialDate = moment.utc(footage.editorialDate);
      var year = editorialDate.get('year');
      var month = editorialDate.get('month');
      var date = editorialDate.get('date');
      footage.editorialDate = new Date(year, month, date);
    }
    self.sharedService.emitInfoModal('');
    self.sharedService.emitFootage(footage);
    let info = {
      paging: self.paging,
      filterStatus: self.filterStatus,
      keywords: self.keywords,
      removeInfo: false
    };
    self.sharedService.emitInfoWorkspacePage(info);
    self.router.navigate(['my-blackbox/workspace/edit']);
  }

  cancelFootageEdited(footageId: string) {
    var self = this;
    var oldFootageId = footageId;
    var oldFootage;
    self.oldFootages.forEach(element => {
      if (element.footageId == oldFootageId) {
        oldFootage = element;
      }
    });
    var currentFootages = self.footages;
    currentFootages.forEach(footage => {
      if (footage.footageId == oldFootage.footageId) {
        footage.category = oldFootage.category;
        footage.categoryText = oldFootage.categoryText;
        footage.keywords = oldFootage.keywords;
        footage.keywordsArray = oldFootage.keywordsArray;
        footage.description = oldFootage.description;
        footage.documents = oldFootage.documents;
        footage.isDescription = false;
        footage.isKeywords = false;
        footage.isReleases = false;
      }
    });
    self.footages = currentFootages;
    console.log('old', self.oldFootages);
    console.log('footage', self.footages);
  }

  getDataSharing(footage: any) {
    var self = this;
    var sharers = footage.sharers;
    self.tempFootage = footage;
    self.totalPercentStatus = false;
    self.keywordSearch.text = '';
    self.currentCurators = [];
    mApp.blockPage();
    self.uploadService
      .getSharers(
        self.pagingSharer.currentPage * self.pagingSharer.pageSize +
          1 -
          self.pagingSharer.pageSize,
        self.pagingSharer.pageSize,
        self.partner.sharer,
        self.keywordSearch.text
      )
      .then(
        (result: any) => {
          mApp.unblockPage();
          self.sharersModal.show();
          if (result) {
            self.sharers = result.list;
            self.pagingSharer.total = result.pageInfo.totalRecords;
            self.pagingSharer.count = result.pageInfo.totalDisplayRecords;
            self.sharers = self.keepSharers(
              self.sharers,
              self.selectedSharer,
              self.pagingSharer.total,
              self.pagingSharer.count,
              self.pagingSharer.pageSize
            );
            self.checkSharers();
            var currentSharers = [];
            if (footage.curators.length > 0) {
              self.currentCurators = JSON.parse(
                JSON.stringify(footage.curators)
              );
            }
            var newSharers = self.sharers;
            sharers.forEach(element => {
              self.sharers.forEach(item => {
                if (item.id == element.id) {
                  item.collabShare = element.collabShare;
                  currentSharers.push(item);
                }
              });
              newSharers = _.reject(newSharers, item => {
                return (
                  item.id == element.id && item.collabType == element.collabType
                );
              });
            });
            var oldSharers = JSON.stringify(currentSharers);
            self.oldFootages = JSON.parse(oldSharers);
            self.currentSharers = currentSharers;
            self.sharers = newSharers;
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  keepSharers(sharers, selectedSharers, total, count, pageSize) {
    var self = this;
    var originalLength = sharers.length;
    if (selectedSharers && selectedSharers.length) {
      _.each(self.selectedSharer, function(sharer) {
        sharers = _.reject(sharers, function(item) {
          return sharer.id == item.id && sharer.collabType == item.collabType;
        });
      });
      sharers = selectedSharers.concat(sharers);
      var diff = sharers.length - originalLength;
      self.pagingSharer.total = total + diff;
      self.pagingSharer.count = count + diff;
      self.pagingSharer.pageSize = pageSize + diff;
    }
    return sharers;
  }

  checkSharers() {
    var self = this;
    var currentSharers = self.selectedSharer;

    if (self.sharers) {
      for (var i = 0; i < self.sharers.length; i++) {
        if (currentSharers) {
          var exist = false;
          for (var j = 0; j < currentSharers.length; j++) {
            if (self.sharers[i].id == currentSharers[j].id) {
              self.sharers[i].selectSharer = true;
              self.sharers[i].locked = currentSharers[j].locked;
              self.sharers[i].collabShare = currentSharers[j].collabShare;
              self.sharers[i].collabType = currentSharers[j].collabType;
              exist = true;
              break;
            }
          }
          if (exist == false) {
            self.sharers[i].collabShare = 15;
            self.sharers[i].collabType = 'sharer';
          }
        } else {
          self.sharers[i].collabShare = 15;
          self.sharers[i].collabType = 'sharer';
        }
      }
    }
  }

  addCurrentSharer(sharer: any) {
    var self = this;

    self.currentSharers.push(sharer);
    self.sharers = _.reject(self.sharers, item => {
      return item.id == sharer.id && sharer.collabType == item.collabType;
    });
  }

  removedCurrentSharer(sharer: any) {
    var self = this;

    self.sharers.push(sharer);
    self.currentSharers = _.reject(self.currentSharers, item => {
      return item.id == sharer.id && sharer.collabType == item.collabType;
    });
  }

  loadSharers() {
    var self = this;
    var blockId = '#m_blockui_sharers_content';
    mApp.block(blockId);
    self.allowShowListSharers = false;
    self.projectsService
      .getPartners(
        self.pagingSharer.currentPage * self.pagingSharer.pageSize +
          1 -
          self.pagingSharer.pageSize,
        self.pagingSharer.pageSize,
        self.partner.sharer,
        self.keywordSearch.text,
        '',
        self.memberAttribute
      )
      .then((result: any) => {
        if (result) {
          self.sharers = result.list;
          self.allowShowListSharers = !self.sharers.length ? true : false;
          self.pagingSharer.total = result.pageInfo.totalRecords;
          self.pagingSharer.count = result.pageInfo.totalDisplayRecords;
          self.sharers = self.keepSharers(
            self.sharers,
            self.selectedSharer,
            self.pagingSharer.total,
            self.pagingSharer.count,
            self.pagingSharer.pageSize
          );
          self.checkSharers();
          self.currentSharers.forEach(element => {
            self.sharers = _.reject(self.sharers, item => {
              return (
                item.id == element.id && item.collabType == element.collabType
              );
            });
          });
          mApp.unblock(blockId);
        }
      });
  }

  filterSharers(keyword: string) {
    var self = this;

    self.pagingSharer.currentPage = 1;
    self.loadSharers();
  }

  changeSharer() {
    var self = this;
    var totalPercent = 0;
    self.totalPercentStatus = false;
    var listSharersAndCurators = self.currentSharers.concat(
      self.currentCurators
    );

    listSharersAndCurators = self.checkPercentage(listSharersAndCurators);
    listSharersAndCurators.forEach(element => {
      totalPercent += element.collabShare;
    });

    if (
      listSharersAndCurators.length &&
      (totalPercent < 1 || totalPercent > 99)
    ) {
      self.totalPercentStatus = true;
    } else {
      var info = {
        footageId: self.tempFootage.footageId,
        sharers: self.currentSharers
      };

      self.isSaveChanges = true;
      self.uploadService.changeSharer(info).then((result: any) => {
        var result = result.json();
        console.log('changeSharer: ', result);
        if (result.success) {
          self.toastr.success('Saved successfully!', 'Success');
          self.sharersModal.hide();
          self.loadFootages();
        }
        self.isSaveChanges = false;
      });
    }
  }

  checkPercentage(sharers) {
    var checkedSharers = _.map(sharers, item => {
      if (!item.collabShare) {
        item.collabShare = 15;
      }
      return item;
    });

    return checkedSharers;
  }

  submitEditFootage(type: string) {
    var self = this;
    if (self.tempFootage.batchId != null) {
      var batchId = self.tempFootage.batchId;
      var footage = {
        memberId: self.tempFootage.memberId,
        projectId: self.tempFootage.projectId,
        footageId: self.tempFootage.footageId
      };
      var footagesInfo = {};
    }
    if (type == 'sharers') {
      self.tempFootage.sharers = self.currentSharers;
      self.tempFootage.modelDocuments =
        self.tempFootage.documents.modelDocuments;
      self.tempFootage.propertyDocuments =
        self.tempFootage.documents.propertyDocuments;
    }

    self.tempFootage.keyword_list = self.tempFootage.keywords
      ? self.tempFootage.keywords.split(',')
      : [];
    self.uploadService.updateFootage(self.tempFootage).then(
      (result: any) => {
        var resultJSON = result.json();
        if (result.status == 204) {
          if (type == 'sharers') {
            $('#sharers').modal('hide');
            self.tempFootage.ownership = 100 - self.totalPercent;
          }
          self.dataOldFootage();
        } else {
          $('#sharers').modal('hide');
          self.toastr.error(resultJSON.message, 'Error');
          self.loadFootages();
        }
      },
      err => {
        console.log(err);
        self.loadFootages();
      }
    );
  }

  checkValidDesc(footage: any, isClean?: boolean) {
    var count = 0;
    if (footage.description != undefined) {
      var validDescription = this.utils.validDescription(footage.description);
      console.log(footage.description);
      var words = footage.description.replace(/(^\s*)|(\s*$)/gi, ''); //exclude  start and end white-space
      words = words.replace(/[ ]{3,}/gi, ' '); //3 or more space to 2
      words = words.replace(/\n /, '\n'); // exclude newline with a start spacing
      footage.descriptionCharacters = footage.description.replace(/\s/g, '');
      count = words.split(' ').length + words.split('\n').length - 1;
      footage.descriptionWords = count;
      if (isClean) {
        footage.description = words;
      }
      let tempWords = words.replace(/\n/gi, ' ');
      var wordArray = tempWords.split(' ');
      var items = _.difference(
        wordArray,
        this.constants.ignoreDescriptionWords
      );
      var tempArray = _.chain(items)
        .countBy()
        .value();
      var valueArray = [];
      tempArray = _.mapObject(tempArray, (val, key) => {
        var sub = {
          word: key,
          times: val
        };

        valueArray.push(sub);
        return val;
      });
      var maxTimes = _.chain(valueArray)
        .map(item => {
          return item;
        })
        .find(item => {
          return item.times > this.constants.maxRepeatTimes;
        })
        .value();
      console.log('maxTimes', maxTimes);
      footage.maxTimes = maxTimes;
      if (
        count >= 5 &&
        words.length >= 15 &&
        words.length <= 200 &&
        validDescription
      ) {
        footage.invalidDesc = false;
        return true;
      } else {
        footage.invalidDesc = true;
        return false;
      }
    } else {
      footage.invalidDesc = true;
      return false;
    }
  }

  checkKeywordsNumber(footage: any) {
    footage.keywordsArray = _.reject(footage.keywordsArray, item => {
      return item.value == '';
    });
    footage.keywordsArray = _.uniq(footage.keywordsArray, item => {
      return item.value.toLowerCase();
    });
    if (footage.keywordsArray.length > 7 && footage.keywordsArray.length < 50) {
      footage.invalidKeywords = false;
      return true;
    }
    footage.invalidKeywords = true;
    return false;
  }

  savedEdit(footage: any) {
    var self = this;
    var id = '#' + footage.footageId;
    var invalidDesc = self.checkValidDesc(footage, true);
    var keywordsNumber = self.checkKeywordsNumber(footage);

    mApp.block(id, {
      overlayColor: '#000000',
      type: 'loader',
      state: 'success',
      message: 'Processing...'
    });
    var keywordArray = footage.keywordsArray;
    keywordArray = _.pluck(keywordArray, 'value');
    keywordArray = keywordArray.toString();
    keywordArray.split(',').map(String);
    footage.keywords = keywordArray;
    footage.keyword_list = footage.keywords ? footage.keywords.split(',') : [];
    footage.modelDocuments = footage.documents.modelDocuments;
    footage.propertyDocuments = footage.documents.propertyDocuments;
    console.log(footage);
    self.uploadService.updateFootage(footage).then(
      (result: any) => {
        console.log(result);
        if (result) {
          if (
            footage.category != '' &&
            invalidDesc &&
            keywordsNumber &&
            !footage.maxTimes
          ) {
            footage.canSubmit = true;
          } else {
            footage.canSubmit = false;
          }
          footage.isDescription = false;
          footage.isKeywords = false;
          var keywords = footage.keywords;
          keywords = keywords.split(',').join(', ');
          footage.keywords = keywords;
          self.dataOldFootage();
          mApp.unblock(id);
          self.toastr.success('Saved successfully!', 'Success');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  initializeDocumentUpload() {
    var self = this;
    var url = self.apiUrl.upload_footage_document.replace(
      '{memberId}',
      self.accountService.getUserId()
    );
    var $fModel = $('#fModel');
    if ($fModel.fileinput) {
      $fModel.fileinput('destroy');
    }
    $fModel.fileinput(
      $.extend(self.constants.defaultFileInputSettings, {
        uploadUrl: url.replace('{documentType}', 'M'),
        uploadAsync: true,
        showPreview: true,
        allowedFileExtensions: ['pdf', 'jpeg', 'jpg', 'png'],
        ajaxSettings: {
          headers: {
            Token: self.accountService.getToken()
          }
        }
      })
    );
    $fModel.fileinput('clear');

    var $fProperty = $('#fProperty');
    if ($fProperty.fileinput) {
      $fProperty.fileinput('destroy');
    }
    $fProperty.fileinput(
      $.extend(self.constants.defaultFileInputSettings, {
        uploadUrl: url.replace('{documentType}', 'P'),
        showPreview: true,
        allowedFileExtensions: ['pdf', 'jpeg', 'jpg', 'png'],
        ajaxSettings: {
          headers: {
            Token: self.accountService.getToken()
          }
        }
      })
    );
    $fProperty.fileinput('clear');
    var toastr = self.toastr;

    $fModel
      .off('fileuploaded')
      .on('fileuploaded', function(event, data, previewId, index) {
        self.canReminder = false;
        if (data.response.message) {
          toastr.error(data.response.message, 'Error');
        } else {
          console.log(data.response);
          self.newDocumentId = data.response.documentId;
          self.loadDocuments(true, false);
          self.updateDocumentInfo(data.response);
        }
      });

    $fModel
      .off('filebatchuploadcomplete')
      .on('filebatchuploadcomplete', function(event, files, extra) {
        $fModel.fileinput('clear');
      });
    $('#fModel')
      .off('fileloaded')
      .on('fileloaded', (event, file, previewId, index, reader) => {
        self.canReminder = true;
      });

    $('#fModel')
      .off('fileclear')
      .on('fileclear', (event, file, previewId, index, reader) => {
        self.canReminder = false;
      });

    $('#fModel')
      .off('fileremoved')
      .on('fileremoved', function(event, id, index) {
        self.canReminder = false;
      });

    $fProperty
      .off('fileuploaded')
      .on('fileuploaded', function(event, data, previewId, index) {
        self.canReminder = false;
        if (data.response.message) {
          toastr.error(data.response.message, 'Error');
        } else {
          self.newDocumentId = data.response.documentId;
          self.loadDocuments(false, true);
        }
      });

    $fProperty
      .off('filebatchuploadcomplete')
      .on('filebatchuploadcomplete', function(event, files, extra) {
        $fProperty.fileinput('clear');
      });

    $fProperty.change(function() {
      self.canReminder = true;
      if (self.newDocumentId != '') {
        self.canReminder = false;
      }
    });

    $fModel.change(function() {
      self.canReminder = true;
      if (self.newDocumentId != '') {
        self.canReminder = false;
      }
    });

    $('#fProperty')
      .off('filebatchuploadcomplete')
      .on('filebatchuploadcomplete', function(event, files, extra) {
        $fProperty.fileinput('clear');
      });

    $('#fProperty')
      .off('fileloaded')
      .on('fileloaded', (event, file, previewId, index, reader) => {
        self.canReminder = true;
      });

    $('#fProperty')
      .off('fileclear')
      .on('fileclear', (event, file, previewId, index, reader) => {
        self.canReminder = false;
      });

    $('#fProperty')
      .off('fileremoved')
      .on('fileremoved', function(event, id, index) {
        self.canReminder = false;
      });
  }

  previewFootage(footage: any) {
    var self = this;
    self.videoModal.previewFootage(footage);
  }
  checkValidEditorial() {
    var self = this;
    self.currentFootage.editorialDate = new Date();
    if (self.currentFootage.editorial) {
      self.currentFootage.editorialCity = '';
      self.currentFootage.editorialCountry = '';
      self.currentFootage.editorialDate = self.maxDate;
      self.currentFootage.editorialState = '';
      self.currentFootage.editorialText = '';
      // self.form.editForm.city.$invalid = false;
      // self.form.editForm.country.$invalid = false;
      // self.form.editForm.date.$invalid = false;
    }
  }

  canChangeSharer(footage: any) {
    if (
      footage.projectId ||
      (!footage.sharers.length && !footage.curators.length)
    ) {
      return false;
    }
    return true;
  }

  canAssignSharer(footage: any) {
    if (footage.projectId) {
      return false;
    }
    return true;
  }

  checkFootages() {
    var self = this;
    self.footages.forEach(footage => {
      if (!footage.projectId) {
        footage.batchCheck = self.checkAllFootages;
      }
    });
  }

  loadCurators() {
    var self = this;
    var blockId = '#m_blockui_curators_content';
    mApp.block(blockId);
    self.uploadService
      .getSharers(
        self.pagingCurator.currentPage * self.pagingCurator.pageSize +
          1 -
          self.pagingCurator.pageSize,
        self.pagingCurator.pageSize,
        self.partner.curator,
        self.keywordSearch.text,
        self.memberAttribute
      )
      .then(function(result: any) {
        console.log(result);
        if (result) {
          self.curators = result.list;
          self.pagingCurator.total = result.pageInfo.totalRecords;
          self.pagingCurator.count = result.pageInfo.totalDisplayRecords;
          self.checkCurators();
          self.isLoadingCurators = false;
          mApp.unblock(blockId);
          setTimeout(() => {
            self.checkCuratorListModal.hide();
            self.curatorListModal.show();
          }, 100);
        }
      });
  }

  pageCuratorChanged(currentPage: any) {
    if (this.pagingCurator.currentPage === currentPage.page) {
      return;
    }
    this.pagingCurator.currentPage = currentPage.page;
    this.loadCurators();
  }

  pageSharerChanged(currentPage: any) {
    if (this.pagingSharer.currentPage === currentPage.page) {
      return;
    }
    this.pagingSharer.currentPage = currentPage.page;
    this.loadSharers();
  }

  filterCurators(keyword) {
    var self = this;
    self.selectedCurator = {};
    self.pagingCurator.currentPage = 1;
    return self.loadCurators();
  }

  checkCurators() {
    var self = this;
    var currentCurator = self.selectedCurator;
    if (self.curators) {
      for (var i = 0; i < self.curators.length; i++) {
        if (currentCurator) {
          if (self.curators[i].id == currentCurator.id) {
            self.curators[i].collabShare = currentCurator.collabShare;
          } else {
            self.curators[i].collabShare = 40;
          }
        } else {
          self.curators[i].collabShare = 40;
        }
      }
    }
  }

  closeSharerModal() {
    var self = this;
    self.pagingSharer.currentPage = 1;
    self.keywordSearch = {
      text: ''
    };
  }

  backShareModal() {
    var self = this;
    console.log(self.selectedCurator);
    self.selectedCurator = {};
    self.notCuratorSelected = false;
    self.keywordSearch.text = '';
    self.curatorListModal.hide();
    self.isLoadingCurators = false;
    self.checkCuratorListModal.show();
  }

  checkListAssignCurator() {
    var self = this;
    // self.spinnerAssignCurator = true;
    self.searchFootage = '';
    self.notFootagesSelected = false;
    self.listFootageSelectAssignCurator = [];
    self.listFootageAssignCurator = [];
    self.isLoadingCurators = false;
    self.getListBatchName('curator');
    self.loadFootagesFilter('curator', true).then(() => {
      self.spinnerAssignCurator = false;
      self.checkCuratorListModal.show();
    });
  }

  assignCurator() {
    var self = this;

    self.keywordSearch.text = '';
    if (self.listFootageSelectAssignCurator.length > 0) {
      self.isLoadingCurators = true;
      self.pagingCurator.currentPage = 1;
      self.loadCurators();
      self.notFootagesSelected = false;
    } else {
      self.notFootagesSelected = true;
    }
  }

  openCreateBatchModal() {
    var self = this;

    if (self.statusBathchName()) {
      self.toastr.warning('Must select the item(s) first', 'Warning');
      return;
    }

    self.batchName = '';
    $('#create-batch-modal').modal('show');
    setTimeout(() => {
      self.inputBatchName.nativeElement.focus();
    }, 500);
  }

  createBatch() {
    var self = this;
    var footageIds = self.getSelectedBatchFootages();
    if (self.batchName == '') {
      self.statusBatchName = true;
    } else {
      if (footageIds) {
        self.creating = true;
        self.uploadService
          .createBatch(self.batchName, footageIds)
          .then(function(result: any) {
            self.creating = false;
            result = result.json();
            console.log(result);

            if (result.message) {
              self.responseMessage = result.message;
              return self.showConfirmCreateBatchNameModal(
                self.batchName,
                footageIds
              );
            }

            if (result.success) {
              $('#create-batch-modal').modal('hide');
              self.loadFootages();
            }
          });
      }
    }
  }

  showConfirmCreateBatchNameModal(batchName, footageIds) {
    this.confirmModal.show();
    $('#confirmModal')
      .off('click', '.btn-success')
      .on('click', '.btn-success', () => {
        this.confirmModal.hide();
        this.creating = true;
        this.uploadService
          .createBatch(batchName, footageIds, true)
          .then((result: any) => {
            this.creating = false;
            result = result.json();
            if (result.success) {
              $('#create-batch-modal').modal('hide');
              this.loadFootages();
            }
          });
      });
  }

  getSelectedBatchFootages() {
    var self = this;
    var listFootages = self.footages;
    var list = [];
    self.selectedCurator = {};
    listFootages = _.filter(listFootages, footages => {
      return footages.batchCheck == true;
    });
    listFootages.forEach(footageId => {
      list.push(footageId.footageId);
    });
    return list;
  }

  selectCurator(curator) {
    var self = this;
    self.selectedCurator = curator;
    console.log(self.selectedCurator);
  }

  openAssignCuratorWarningModal() {
    var self = this;
    if (self.selectedCurator.id) {
      self.notCuratorSelected = false;

      if (!self.selectedCurator.collabShare) {
        return self.toastr.error('The sharing percentage is invalid.', 'Error');
      } else {
        self.isValidPercentage = self.checkValidPercentageCurator(
          self.selectedCurator.collabShare
        );
      }

      if (!self.isValidPercentage) {
        return self.toastr.error(
          'The sharing percentage of the curator has exceeded the total ownership percentage.',
          'Error'
        );
      }

      self.curatorListModal.hide();
      self.confirmAssignCuratorModal.show();
    } else {
      self.notCuratorSelected = true;
    }
  }

  closeWarningCuratorAssign() {
    this.confirmAssignCuratorModal.hide();
    this.curatorListModal.show();
  }

  checkValidPercentageCurator = function(percentage) {
    var list = [];
    var self = this;

    self.listFootageSelectAssignCurator.forEach(footage => {
      list.push(footage.ownership);
    });
    var isValidPercentage = _.every(list, function(num) {
      return num > percentage;
    });
    return isValidPercentage;
  };

  submitAssignCurator() {
    var self = this;
    var footageIds = self.getSelectedCurationFootages();
    console.log(footageIds);
    if (self.isValidPercentage) {
      if (footageIds) {
        self.selectedCurator.loading = true;
        self.uploadService
          .assignCurator(self.selectedCurator, footageIds)
          .then(function(result: any) {
            result = result.json();
            console.log(result);
            self.selectedCurator.loading = false;
            self.confirmAssignCuratorModal.hide();
            if (result && result.success) {
              self.loadFootages();
              self.closeSharerModal();
            } else {
              if (result && result.errMsg) {
                self.toastr.error(result.errMsg, 'Error');
              }
            }
          });
      }
    }
  }

  getSelectedCurationFootages() {
    var list = [];
    var self = this;
    self.batchNameFilter = '';
    self.listFootageSelectAssignCurator.forEach(footage => {
      list.push(footage.footageId);
    });
    return list;
  }

  loadFootagesFilter(type: string, isRequest: boolean) {
    return new Promise((resolve, reject) => {
      var self = this;
      var blockId = '';
      this.batchNameFilter = '';
      if (!self.searchFootage && self.keywords) {
        self.searchFootage = self.keywords;
      }

      if (type == 'curator') {
        blockId = '#m_blockui_curator_content';
      }

      if (type == 'submit') {
        blockId = '#m_blockui_submit_content';
      }

      if (isRequest) {
        mApp.block(blockId);
        self.uploadService
          .getFootages(
            self.paging.currentPage * self.paging.pageSize +
              1 -
              self.paging.pageSize,
            self.paging.pageSize,
            self.searchFootage,
            self.filterStatus
          )
          .then(
            (result: any) => {
              mApp.unblock(blockId);
              var listFootage = result.data.list;

              if (type == 'curator') {
                listFootage = _.filter(listFootage, footage => {
                  return footage.canAssignCurator == true;
                });
                self.removeFootagesSelectAssignCurator(listFootage);
                resolve();
              }

              if (type == 'submit') {
                listFootage = _.filter(listFootage, footage => {
                  return footage.canSubmit == true;
                });
                self.removeFootagesSelectSubmit(listFootage);
                resolve();
              }

              if (type == 'submitRejected') {
                listFootage = _.filter(listFootage, footage => {
                  return (
                    footage.canSubmit == true &&
                    footage.reviewStatus === 'rejected'
                  );
                });
                self.listFootageSelectSubmitRejected = listFootage;
                resolve();
              }
            },
            err => {
              console.log(err);
            }
          );
      } else {
        var listFootage = self.utils.clone(self.footages);
        if (type == 'curator') {
          listFootage = _.filter(listFootage, footage => {
            return footage.canAssignCurator == true;
          });
          self.removeFootagesSelectAssignCurator(listFootage);
          resolve();
        }

        if (type == 'submit') {
          listFootage = _.filter(listFootage, footage => {
            return footage.canSubmit == true;
          });
          self.removeFootagesSelectSubmit(listFootage);
          resolve();
        }

        if (type == 'submitRejected') {
          listFootage = _.filter(listFootage, footage => {
            return (
              footage.canSubmit == true && footage.reviewStatus === 'rejected'
            );
          });
          self.listFootageSelectSubmitRejected = listFootage;
          resolve();
        }
      }
    });
  }

  removeFootagesSelectAssignCurator(listFootages: any) {
    var self = this;
    if (
      self.listFootageSelectAssignCurator.length > 0 &&
      listFootages.length > 0
    ) {
      self.listFootageSelectAssignCurator.forEach(footage => {
        listFootages.forEach(element => {
          if (element.footageId == footage.footageId) {
            element.curatorCheck = true;
          }
        });
      });
      self.listFootageAssignCurator = listFootages;
    } else {
      self.listFootageAssignCurator = listFootages;
    }
  }

  addFootageSelect(footage: any) {
    var self = this;
    footage.curatorCheck = true;
    var listFootageSelectAssignCurator = self.listFootageSelectAssignCurator;
    listFootageSelectAssignCurator.push(footage);
  }

  removedFootageSelect(footage: any) {
    var self = this;
    self.listFootageSelectAssignCurator = _.reject(
      self.listFootageSelectAssignCurator,
      item => {
        return item.footageId == footage.footageId;
      }
    );
    console.log(self.listFootageSelectAssignCurator);
    self.listFootageAssignCurator.forEach(element => {
      if (element.footageId == footage.footageId) {
        element.curatorCheck = false;
      }
    });
  }

  removedAllFootageSelect() {
    var self = this;
    self.listFootageSelectAssignCurator = [];
    console.log(self.listFootageSelectAssignCurator);
    self.listFootageAssignCurator.forEach(element => {
      element.curatorCheck = false;
    });
  }

  addAllFootageSelect() {
    var self = this;
    var listFootageSelectAssignCurator = self.listFootageSelectAssignCurator;
    self.listFootageAssignCurator.forEach(footage => {
      if (!footage.curatorCheck) {
        footage.curatorCheck = true;
        listFootageSelectAssignCurator.push(footage);
      }
    });
  }

  statusBathchName() {
    var self = this;
    var a = _.find(self.footages, footage => {
      return footage.batchCheck == true && footage.projectId == null;
    });
    if (a != undefined) {
      return false;
    }
    return true;
  }

  initializeCsvUploadModal() {
    var self = this;
    var $fCsv = $('#fCsv');
    var id = '#full';
    var url = self.apiUrl.upload_csv.replace(
      '{memberId}',
      self.accountService.getUserId()
    );
    $fCsv.fileinput(
      $.extend(self.constants.defaultFileInputSettings, {
        uploadUrl: url,
        uploadAsync: false,
        showPreview: false,
        allowedFileExtensions: ['csv', 'xls', 'xlsx'],
        ajaxSettings: {
          headers: {
            Token: self.accountService.getToken()
          }
        }
      })
    );
    $fCsv.fileinput('clear');
    var csvUploadModal = this.csvUploadModal;
    var errorMessageModal = this.errorMessageModal;

    $fCsv
      .off('filebatchuploadsuccess')
      .on('filebatchuploadsuccess', function(event, data) {
        if (data.response) {
          csvUploadModal.hide();
          console.log(data.response);
          var errorMessage = data.response.errorMessage;
          if (errorMessage == 'invalid csv') {
            self.isShowLink = true;
            self.errorMessage =
              'The uploaded csv file is invalid format, please use the latest template by download it from the link ';
            errorMessageModal.show();
            $fCsv.fileinput('destroy');
            return false;
          } else {
            self.isShowLink = false;
          }
          mApp.blockPage({ state: 'success' });
          // self.blockUI.start("It might take a few minutes before the meta-data are fully processed from the csv import.");

          if (errorMessage) {
            errorMessageModal.show();
            self.errorMessage = errorMessage;
          }

          var countValidRow = data.response.countValidRow;

          $fCsv.fileinput('destroy');
          setTimeout(() => {
            mApp.unblockPage();
            self.loadFootages();
          }, countValidRow * 500);
        }
      });
  }

  showCSVUpload() {
    var self = this;
    self.initializeCsvUploadModal();
    self.csvUploadModal.show();
  }

  downloadCSVTemplate() {
    var self = this;
    window.open(
      self.apiUrl.download_template.replace('{type}', '1'),
      'Download CSV template'
    );
  }

  checkListSubmit() {
    var self = this;
    // self.spinnerSubmit = true;
    self.searchFootage = '';
    self.notFootagesSelected = false;
    self.listFootageSelectSubmit = [];
    self.listFootageSubmit = [];
    self.canSaveLocal = false;
    this.getListBatchName('submit');
    self.loadFootagesFilter('submit', true).then(() => {
      // self.spinnerSubmit = false;
      self.checkFootagesSubmitModal.show();
    });
  }

  removeFootagesSelectSubmit(listFootages: any) {
    var self = this;
    if (self.listFootageSelectSubmit.length > 0 && listFootages.length > 0) {
      self.listFootageSelectSubmit.forEach(footage => {
        listFootages.forEach(element => {
          if (element.footageId == footage.footageId) {
            element.check = true;
          }
        });
      });
      self.listFootageSubmit = listFootages;
    } else {
      self.listFootageSubmit = listFootages;
    }
  }

  addFootageSelectSubmit(footage: any) {
    var self = this;
    footage.check = true;
    var listFootageSelectSubmit = self.listFootageSelectSubmit;
    listFootageSelectSubmit.push(footage);
  }

  removedFootageSelectSubmit(footage: any) {
    var self = this;
    self.listFootageSelectSubmit = _.reject(
      self.listFootageSelectSubmit,
      item => {
        return item.footageId == footage.footageId;
      }
    );
    console.log(self.listFootageSelectSubmit);
    self.listFootageSubmit.forEach(element => {
      if (element.footageId == footage.footageId) {
        element.check = false;
      }
    });
  }

  removedAllFootageSelectSubmit() {
    var self = this;
    self.listFootageSelectSubmit = [];
    self.listFootageSubmit.forEach(element => {
      element.check = false;
    });
  }

  addAllFootageSelectSubmit() {
    var self = this;
    var listFootageSelectSubmit = self.listFootageSelectSubmit;
    self.listFootageSubmit.forEach(footage => {
      if (!footage.check) {
        footage.check = true;
        listFootageSelectSubmit.push(footage);
      }
    });
  }

  submitAllFootages() {
    var self = this;
    var temp = self.listFootageSelectSubmit;
    if (temp && !temp.length) {
      return (self.notFootagesSelected = true);
    }
    var check = _.every(temp, item => {
      return !item.noteToOwner;
    });
    self.checkListFootage();
    temp = self.listFootageSelectSubmit;
    var tempRejected = self.listFootageSelectSubmitRejected;
    var user: any = JSON.parse(
      localStorage.getItem(self.accountService.getUserId())
    );
    if (user && user.notShowSubmitConfirm) {
      if (temp.length != 0 || tempRejected.length != 0) {
        if (temp.length != 0) {
          self.uploadService.submitFootages(temp).then((result: any) => {
            if (result.status == 200) {
              var data = result.json();
              if (!data.success) {
                return self.toastr.error(data.message, 'Error', {
                  enableHtml: true
                });
              }

              self.toastr.success(
                'The uploaded ' +
                  temp.length +
                  ' file(s) is available in "SUBMITTED CONTENT" for further processing.',
                'Success'
              );
              if (tempRejected.length == 0) {
                self.loadFootages();
                self.checkFootagesSubmitModal.hide();
              }

              if (data.warningMessage) {
                self.toastr.warning(data.warningMessage, 'Warning');
              }
            }

            if (result.status == 204) {
              self.toastr.success(
                'The uploaded ' +
                  temp.length +
                  ' file(s) is available in "SUBMITTED CONTENT" for further processing.',
                'Success'
              );
              if (tempRejected.length == 0) {
                self.loadFootages();
                self.checkFootagesSubmitModal.hide();
              }
            }
          });
        }
        if (tempRejected.length != 0) {
          self.checkFootagesSubmitModal.hide();
          self.searchFootage = '';
          self.resubmissionListText.show();
        }
        return;
      }
    }

    this.isShowSubNote = check;
    self.checkFootagesSubmitModal.hide();
    self.submitFootagesConfirmModal.show();
  }

  confirmSubmitAllFootages() {
    var self = this;
    var temp = self.listFootageSelectSubmit;
    var tempRejected = self.listFootageSelectSubmitRejected;
    if (temp.length != 0 || tempRejected.length != 0) {
      if (self.canSaveLocal) {
        var userLocal: any = {};
        var currentUserLocal: any = JSON.parse(
          localStorage.getItem(self.accountService.getUserId())
        );
        if (currentUserLocal) {
          userLocal = currentUserLocal;
        }
        userLocal.notShowSubmitConfirm = true;
        self.authenticateService.saveByUser(JSON.stringify(userLocal));
      }
      self.submitFootagesConfirmModal.hide();
      if (temp.length != 0) {
        self.uploadService.submitFootages(temp).then(function(result: any) {
          console.log(result);
          if (result.status == 200) {
            var data = result.json();
            if (!data.success) {
              return self.toastr.error(data.message, 'Error', {
                enableHtml: true
              });
            }

            self.toastr.success(
              'The uploaded ' +
                temp.length +
                ' file(s) is available in "SUBMITTED CONTENT" for further processing.',
              'Success'
            );
            if (!tempRejected && tempRejected.length == 0) {
              self.loadFootages();
            }

            if (data.warningMessage) {
              self.toastr.warning(data.warningMessage, 'Warning');
            }
          }

          if (result.status == 204) {
            self.toastr.success(
              'The uploaded ' +
                temp.length +
                ' file(s) is available in "SUBMITTED CONTENT" for further processing.',
              'Success'
            );
            if (!tempRejected && tempRejected.length == 0) {
              self.loadFootages();
            }
          }
        });
      }
      if (tempRejected.length != 0) {
        self.searchFootage = '';
        self.resubmissionListText.show();
      }
    }
  }

  changeCategory(footage: any) {
    var self = this;
    var footageCategories = self.commonService.getFootageCategories();
    footageCategories.forEach(element => {
      if (element.value == footage.category) {
        footage.categoryText = element.text;
      }
    });
  }

  checkListFootage() {
    var listFootageRejected = [];
    var listFootage = [];
    listFootageRejected = _.filter(this.listFootageSelectSubmit, footage => {
      return footage.reviewStatus === 'rejected';
    });
    listFootage = _.reject(this.listFootageSelectSubmit, footage => {
      return footage.reviewStatus === 'rejected';
    });
    this.listFootageSelectSubmitRejected = listFootageRejected;
    this.listFootageSelectSubmit = listFootage;
  }

  submitFootageRejected(footage: any) {
    var self = this;
    var check = false;
    footage.submission = true;
    footage.approvalStatus = 'pending';
    footage.isLoading = true;
    var keywordsArray = footage.keywords;
    keywordsArray = keywordsArray.split(',').map(String);
    footage.keyword_list = keywordsArray;
    footage.modelDocuments = footage.documents.modelDocuments;
    footage.propertyDocuments = footage.documents.propertyDocuments;
    var temp = footage;
    if (temp) {
      self.uploadService.updateFootage(temp).then((result: any) => {
        footage.isLoading = false;
        if (result.status == 200) {
          var data = result.json();

          if (!data.success) {
            return self.toastr.error(data.message, 'Error');
          }

          if (data.warningMessage) {
            self.toastr.warning(data.warningMessage, 'Warning');
          }

          var tempList = _.reject(
            self.listFootageSelectSubmitRejected,
            item => {
              return item.footageId == temp.footageId;
            }
          );
          self.listFootageSelectSubmitRejected = tempList;
          self.resubmissionText.hide();
          if (self.listFootageSelectSubmitRejected.length == 0) {
            self.resubmissionListText.hide();
            self.loadFootages();
          }
          self.toastr.success(
            'The uploaded file(s) is available in "SUBMITTED CONTENT" for further processing.',
            'Success'
          );
        }
      });
    }
  }

  closeResubmissionList() {
    this.resubmissionListText.hide();
    this.loadFootages();
  }

  checkFootage(footage: any) {
    var self = this;
    if (footage.reviewStatus === 'rejected') {
      self.listFootageRejected = footage;
      self.listFootageRejected.resubmissionText = '';
      self.submitStatus = false;
      self.isSubmitStatus = false;
      return self.resubmissionText.show();
    }
    self.submitFootage(footage);
  }

  submitFootage(footage: any) {
    var self = this;
    if (self.submitStatus) {
      self.isSubmitStatus = true;
    }
    self.temp = [];
    self.contentSubmitConfirm = '';
    var temp = [footage];
    self.temp = temp;
    if (footage.canSubmit) {
      var user: any = JSON.parse(
        localStorage.getItem(self.accountService.getUserId())
      );
      if (user && user.notShowSubmitConfirm) {
        if (temp) {
          return self.uploadService
            .submitFootages(temp)
            .then(function(result: any) {
              console.log(result);
              if (result.status == 200) {
                var data = result.json();
                if (!data.success) {
                  return self.toastr.error(data.message, 'Error', {
                    enableHtml: true
                  });
                }

                self.toastr.success(
                  'The uploaded file(s) is available in "CONTENT" for further processing.',
                  'Success'
                );
                if (self.submitStatus) {
                  self.isSubmitStatus = false;
                  self.resubmissionText.hide();
                }
                self.loadFootages();

                if (data.warningMessage) {
                  self.toastr.warning(data.warningMessage, 'Warning');
                }
              }

              if (result.status == 204) {
                self.toastr.success(
                  'The uploaded file(s) is available in "CONTENT" for further processing.',
                  'Success'
                );
                if (self.submitStatus) {
                  self.isSubmitStatus = false;
                  self.resubmissionText.hide();
                }
                self.loadFootages();
              }
            });
        }
      }
    } else {
      return self.toastr.error('Footage not submit', 'Error');
    }

    if (footage.noteToOwner) {
      self.contentSubmitConfirm =
        'Please make sure you have reviewed the notes from the curator.';
    } else {
      self.contentSubmitConfirm = '';
    }
    self.isConfirm = false;
    $('#submit-footage-confirm-modal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#submit-footage-confirm-modal').modal('show');
  }

  confirmSubmitFootage() {
    var self = this;
    if (self.submitStatus) {
      self.isSubmitStatus = true;
    }
    var temp = self.temp;
    if (temp) {
      if (self.canSaveLocal) {
        var userCookies: any = {};
        var currentUserCookies: any = JSON.parse(
          localStorage.getItem(self.accountService.getUserId())
        );
        if (currentUserCookies) {
          userCookies = currentUserCookies;
        }
        userCookies.notShowSubmitConfirm = true;
        self.authenticateService.saveByUser(JSON.stringify(userCookies));
      }
      self.isConfirm = true;
      self.uploadService.submitFootages(temp).then((result: any) => {
        console.log(result);
        self.isConfirm = false;
        if (result.status == 200) {
          var data = result.json();
          if (!data.success) {
            return self.toastr.error(data.message, 'Error', {
              enableHtml: true
            });
          }

          $('#submit-footage-confirm-modal').modal('hide');
          self.toastr.success(
            'The uploaded file(s) is available in "SUBMITTED CONTENT" for further processing.',
            'Success'
          );
          if (self.submitStatus) {
            self.isSubmitStatus = false;
            self.resubmissionText.hide();
          }
          self.loadFootages();

          if (data.warningMessage) {
            self.toastr.warning(data.warningMessage, 'Warning');
          }
        }

        if ((result.status = 204)) {
          $('#submit-footage-confirm-modal').modal('hide');
          self.toastr.success(
            'The uploaded file(s) is available in "SUBMITTED CONTENT" for further processing.',
            'Success'
          );
          if (self.submitStatus) {
            self.isSubmitStatus = false;
            self.resubmissionText.hide();
          }
          self.loadFootages();
        }
      });
    }
  }

  showHelpModal() {
    $('#help-footage-contribute-modal').modal('show');
  }

  valueKeywords(footage): string {
    var self = this;
    var keywords = footage.keywordsArray;
    if (keywords) {
      if (keywords.length > 0) {
        keywords = _.pluck(keywords, 'value');
        keywords = keywords.toString();
        keywords = keywords.split(',').map(String);
        return keywords;
      }
    }
  }

  copyKeywords(val: string) {
    let value = this.valueKeywords(val);
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  clearKeywords(footage: any) {
    footage.keywordsArray = [];
    footage.keywords = '';
  }

  clickEdit(footage) {
    footage.isDescription = true;
    footage.isKeywords = true;
    this.checkValidDesc(footage);
    this.checkKeywordsNumber(footage);
  }

  backCkeckFootagesSubmit() {
    this.submitFootagesConfirmModal.hide();
    this.checkFootagesSubmitModal.show();
  }

  hideTips() {
    var self = this;
    var userConfig: any = {};
    var currentUserConfig: any = JSON.parse(
      localStorage.getItem(self.accountService.getUserId())
    );

    if (currentUserConfig) {
      userConfig = currentUserConfig;
      if (userConfig.showTips == null) {
        userConfig.showTips = false;
        self.authenticateService.saveByUser(JSON.stringify(userConfig));
        self.showTips = userConfig.showTips;
      } else {
        self.showTips = userConfig.showTips;
      }
    } else {
      userConfig.showTips = false;
      self.authenticateService.saveByUser(JSON.stringify(userConfig));
      self.showTips = userConfig.showTips;
    }
  }

  // Show rejection reason when the footage was rejected by reviewer
  showRejectedReason(footage: any) {
    var rejectedReason = '';

    if (footage.rejectedReason) {
      _.each(footage.rejectedReason, item => {
        rejectedReason += item.message + '<br>';
        rejectedReason += '<br>';
      });
    }
    this.toastr.info(rejectedReason, 'Rejection Reason', {
      enableHtml: true
    });
  }

  clearSearch() {
    this.keywords = '';
    this.loadFootages();
    this.search.nativeElement.focus();
  }

  clearSearchSharer() {
    this.keywordSearch.text = '';
    this.filterSharers('');
    this.searchSharer.nativeElement.focus();
  }

  clearSearchCurator() {
    this.keywordSearch.text = '';
    this.filterCurators('');
    this.searchCurator.nativeElement.focus();
  }

  clearSearchFootage() {
    this.searchFootage = '';
    this.loadFootagesFilter('curator', true);
    this.searchFootageClear.nativeElement.focus();
  }

  clearSearchFootageSubmitClear() {
    this.searchFootage = '';
    this.loadFootagesFilter('submit', true);
    this.searchFootageSubmitClear.nativeElement.focus();
  }

  clearSearchFootageSubmitRejectedClear() {
    this.searchFootage = '';
    this.searchFootageSubmitRejectedClear.nativeElement.focus();
  }

  showUploadRelease() {
    var self = this;
    this.releaseType = 'm';
    self.keywordSearchRelease = '';
    $('#fModel').fileinput('clear');
    $('#fProperty').fileinput('clear');
    self.loadDocuments(true, false);
    self.modalUploadRelease.show();
  }

  changeReleaseType() {
    this.keywordSearchRelease = '';
    if (this.releaseType == 'm') {
      $('#fModel').fileinput('clear');
      this.loadDocuments(true, false);
    }
    if (this.releaseType == 'p') {
      $('#fProperty').fileinput('clear');
      this.loadDocuments(false, true);
    }
  }

  loadDocuments(modelCheck, propertyCheck, footageId?, getFootage?) {
    var self = this;
    var memberId = localStorage.getItem('userid');
    var keyword = self.keywordSearchRelease;
    self.isUploadRelease = true;
    if (modelCheck == true) {
      self.uploadService
        .getDocuments(memberId, true, false, keyword, footageId, false)
        .then((result: any) => {
          if (!result) {
            return false;
          } else {
            console.log(result);
            self.modelReleases = result.list;
            self.isUploadRelease = false;
          }
        });
    }

    if (propertyCheck == true) {
      self.uploadService
        .getDocuments(memberId, false, true, keyword, footageId, false)
        .then((result: any) => {
          if (!result) {
            return false;
          } else {
            console.log(result);
            self.propertyReleases = result.list;
            self.isUploadRelease = false;
          }
        });
    }

    self.countReleases();
  }

  clearSearchPropertyDocuments() {
    this.keywordSearchRelease = '';
    this.loadDocuments(false, true);
    this.searchPropertyDocuments.nativeElement.focus();
  }

  clearSearchModelDocuments() {
    this.keywordSearchRelease = '';
    this.loadDocuments(true, false);
    this.searchModelDocuments.nativeElement.focus();
  }

  deleteRelease(release: any, model: boolean, property: boolean) {
    var self = this;
    console.log(release);
    self.releaseService.deleteRelease(release).then((result: any) => {
      console.log(result);
      if (result.status == 400) {
        return self.toastr.error('Error');
      } else {
        if (model) {
          self.modelReleases = _.reject(self.modelReleases, item => {
            return item.documentId == release.documentId;
          });
          self.countModelReleases -= 1;
        }

        if (property) {
          self.propertyReleases = _.reject(self.propertyReleases, item => {
            return item.documentId == release.documentId;
          });
          self.countPropertyReleases -= 1;
        }
        self.toastr.success('Deleted successfully!', 'Success');
      }
    });
  }

  updateDocumentInfo(model: any) {
    var self = this;
    self.currentDocument = model;
    console.log(self.currentDocument);
    self.statusErrorDocumentsInfo = false;
    self.changeModelDocument.show();
  }

  saveDocumentInfo(document: any) {
    var self = this;
    self.checkDocumentInfo(document);
    if (self.documentsInfo.status == false) {
      self.statusErrorDocumentsInfo = true;
    } else {
      self.uploadService.updateDocumentInfo(document).then(
        (result: any) => {
          console.log(result);
          if (result && result.status == 204) {
            self.toastr.success('Edited release successfully', 'Success');
            self.modelReleases.forEach(item => {
              if (item.documentId == document.documentId) {
                item.age = document.age;
                item.ethnicity = document.ethnicity;
                item.gender = document.gender;
                item.valid = true;
              }
            });
            self.changeModelDocument.hide();
          }
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  checkDocumentInfo(document: any) {
    var self = this;
    self.documentsInfo.age = false;
    self.documentsInfo.ethnicity = false;
    self.documentsInfo.gender = false;
    self.documentsInfo.all = false;
    if (document.age != null && document.age != '') {
      self.documentsInfo.age = true;
    }
    if (document.ethnicity != null && document.ethnicity != '') {
      self.documentsInfo.ethnicity = true;
    }
    if (document.gender != null && document.gender != '') {
      self.documentsInfo.gender = true;
    }
    if (
      self.documentsInfo.age == true &&
      self.documentsInfo.ethnicity == true &&
      self.documentsInfo.gender == true
    ) {
      self.documentsInfo.status = true;
    }
  }

  cancelDocumentInfo() {
    var self = this;
    self.changeModelDocument.hide();
    if (!self.statusValidDocumentInfo) {
      self.modalUploadRelease.show();
    }
  }

  hideChildModal(): void {
    var self = this;
    self.changeModelDocument.hide();
    if (!self.statusValidDocumentInfo) {
      self.modalUploadRelease.show();
    }
  }

  closeReleaseModal() {
    var self = this;
    if (self.canReminder) {
      return self.confirmRelease.show();
    }
    self.modalUploadRelease.hide();
    if (self.checkModalShow) {
      $('body').removeClass('modal-open');
      $('bs-modal-backdrop').removeClass('modal-backdrop fade in show');
      self.checkModalShow = false;
      self.sharedService.emitInfoModal('');
    }
  }

  closeConfirmRelease() {
    var self = this;
    self.confirmRelease.hide();
    self.canReminder = false;
    self.modalUploadRelease.hide();
  }

  viewRelease(release) {
    var self = this;
    var url = this.apiUrl.get_release
      .replace('{memberId}', this.accountService.getUserId())
      .replace('{documentId}', release.documentId);
    console.log(url);
    if (
      (release.modelAgreementLocation &&
        release.modelAgreementLocation.indexOf('.pdf') > 0) ||
      (release.propertyAgreementLocation &&
        release.propertyAgreementLocation.indexOf('.pdf') > 0)
    ) {
      return window.open(url);
    }
    self.dataImage = [url];
    self.viewReleaseModal.show();
  }

  showRejectedReasonOfRelease(release) {
    var self = this;
    var rejectedReason = '';
    if (release.rejectedReason) {
      var rejectedReasons = JSON.parse(release.rejectedReason);
      _.each(rejectedReasons, item => {
        rejectedReason += item.content + '<br>';
        rejectedReason += '<br>';
      });
      self.toastr.info(rejectedReason, 'Rejected reasons', {
        enableHtml: true
      });
    }
  }

  countReleases() {
    var self = this;

    self.releaseService.countReleases().then((result: any) => {
      console.log(result);

      if (result) {
        self.countModelReleases = result.countModelReleases;
        self.countPropertyReleases = result.countPropertyReleases;
      }
    });
  }
  changeDescription(footage: any) {
    this.debounceTimeChangeDescription.next(footage);
  }

  shorten(keywords: string, i: number) {
    var keywords = keywords;
    var keywordSlice = '';
    if (keywords.length > 200) {
      keywordSlice = keywords.slice(0, 200);
      keywordSlice += '...';
    } else {
      keywordSlice = keywords;
    }
    return keywordSlice;
  }

  viewFootageRejected(footage: any) {
    this.currentFootageSubmitRejected = footage;
    this.footageViewModal.show();
  }

  countsharers(footage) {
    var count = footage.curators.length + footage.sharers.length;
    return count;
  }

  routerLegalForms(id: string) {
    var modal = {
      id: id,
      check: false
    };
    this.sharedService.emitInfoModal(JSON.stringify(modal));
    this.router.navigate(['/legal-forms']);
  }

  navigateCollaboration(id: string) {
    var modal = {
      id: id,
      check: true
    };
    this.sharedService.emitInfoModal(JSON.stringify(modal));
    this.confirmAssignCuratorModal.hide();
    this.router.navigate(['my-blackbox/my-collaboration']);
  }

  getListBatchName(type) {
    if (type === 'curator') {
      this.spinnerAssignCurator = true;
    }

    if (type === 'submit') {
      this.spinnerSubmit = true;
    }

    this.uploadService.getListBatchName(type).then((result: any) => {
      this.listBatchName = result.data;
      this.spinnerAssignCurator = false;
      this.spinnerSubmit = false;
    });
  }

  filterByBatchName(type) {
    var self = this;
    var pageSize = this.paging.pageSize;
    if (this.batchNameFilter) {
      pageSize = self.paging.total;
    }

    if (type === 'curator') {
      var blockId = '#m_blockui_curator_content';
      mApp.block(blockId);
      self.uploadService
        .getFootages(1, pageSize, self.batchNameFilter, '')
        .then((result: any) => {
          mApp.unblock(blockId);

          var listFootage = _.filter(result.data.list, footages => {
            return footages.canAssignCurator == true;
          });

          if (this.batchNameFilter) {
            listFootage = _.filter(listFootage, item => {
              return item.batchName === this.batchNameFilter;
            });
          }

          self.removeFootagesSelectAssignCurator(listFootage);
        });
    }

    if (type === 'submit') {
      var blockId = '#m_blockui_submit_content';
      mApp.block(blockId);
      self.uploadService
        .getFootages(1, pageSize, self.batchNameFilter, '')
        .then((result: any) => {
          mApp.unblock(blockId);

          var listFootage = _.filter(result.data.list, footages => {
            return footages.canSubmit;
          });

          if (this.batchNameFilter) {
            listFootage = _.filter(listFootage, item => {
              return item.batchName === this.batchNameFilter;
            });
          }

          self.removeFootagesSelectSubmit(listFootage);
        });
    }
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

  getListKeywords(strInput): void {
    strInput = strInput.toLowerCase();
    if (strInput == '') {
      this.listKeywords = this.dataKeywords;
    } else {
      this.listKeywords = this.dataKeywords.filter(item => {
        if (item) {
          item = item.toLowerCase();
          if (item.startsWith(strInput)) {
            return item;
          }
        }
      });
    }
  }
  openModalMyResentCollaborator(): void {
    var self = this;
    this.projectsService.getResentCollaborators().then(function(result: any) {
      if (result.success) {
        self.listResentCollaborator = result.data;
        $('#modalCollaborator').modal('show');
      }
    });
  }
  openRatingModal(member): void {
    var self = this;
    this.curatorRating = member;
    if (this.curatorRating) {
      this.projectsService
        .getInfoCuratorRating(this.curatorRating.id, null, 'footage')
        .then(function(result: any) {
          if (result.success) {
            var rating = result.data;
            self.curatorRating.curatorId = self.curatorRating.id;
            self.curatorRating.footageId = null;
            self.curatorRating.projectId = null;
            self.curatorRating.name = null;
            self.curatorRating.rated = member.rated;
            if (!member.rated) {
              self.curatorRating.numberRating = 0;
              self.curatorRating.commentRating = '';
              // self.curatorRating.numberOfProject = result.countProjectJoined;
              self.curatorRating.numberOfFootage = result.countFootageJoined;
              // self.curatorRating.rejectRateAtBB = result.countRejectRateAtBB;
              // self.curatorRating.rejectRateAtStorefront = result.countRejectRateAtStorefront;
              // self.curatorRating.numberOfFootageSold = result.countFootageSold;
            } else {
              self.curatorRating.numberRating = rating.numberRating;
              self.curatorRating.comment = rating.comment;
              var metaData = JSON.parse(rating.metaData);
              // self.curatorRating.numberOfProject = metaData.numberOfProject;
              self.curatorRating.numberOfFootage = metaData.numberOfFootage;
              // self.curatorRating.rejectRateAtBB = metaData.rejectRateAtBB;
              // self.curatorRating.rejectRateAtStorefront = metaData.rejectRateAtStorefront;
              // self.curatorRating.numberOfFootageSold = metaData.numberOfFootageSold;
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
        self.curatorRating.rated = true;
        self.ratingModal.doneRating();
      }
    });
  }
  closeModalRecentCollaborator(): void {
    $('#modalCollaborator').modal('hide');
  }
}
