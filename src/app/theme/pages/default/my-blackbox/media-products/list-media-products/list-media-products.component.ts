import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Constants } from 'src/app/utils/constants';
import { ApiUrl } from 'src/app/utils/apiUrl';
import { VideoModalComponent } from 'src/app/theme/partials/video-modal/video-modal.component';
import { CommonService } from 'src/app/services/common.service';
import { ModalDirective } from 'ngx-bootstrap';
import { UploadService } from 'src/app/services/upload.service';
import { Utils } from 'src/app/utils/utils';
import { MediaProductService } from 'src/app/services/media-product.service';
import { ToastrService } from 'ngx-toastr';
import { MyBlackboxComponent } from '../../my-blackbox.component';
import { ProjectsService } from 'src/app/services/projects.service';
import { AccountService } from 'src/app/services/account.service';
import { SharedService } from 'src/app/services/shared-service';
import { Router } from '@angular/router';
import * as keywordData from '../../../../../../../assets/auto-complete/keywords.json';
import * as _ from 'underscore';

declare var $: any;
declare var mApp: any;
declare var moment: any;

@Component({
  selector: 'app-list-media-products',
  templateUrl: './list-media-products.component.html',
  styleUrls: ['./list-media-products.component.css']
})
export class ListMediaProductsComponent implements OnInit {
  paging: any = {
    currentPage: 1,
    pageSize: this.constants.pageSize,
    total: 0,
    firstEntry: 0,
    lastEntry: 0,
    count: 0,
    pageSizeList: this.constants.pageSizeList
  };

  allowShow: boolean = false;
  allowShowFootage: boolean = false;
  footages: any;
  masterData: any;
  oldFootages: any;
  listSharing: any = {
    sharers: []
  };
  keywords: any = '';
  avatarUrlB: string = this.apiUrl.get_avatar.replace('{defaultType}', "B");
  spinnerSubmit: boolean = false;
  searchFootage: string = '';
  notFootagesSelected: boolean = false;
  listFootageSelectSubmit: any = [];
  listFootageSubmit: any = [];
  canSaveLocal: boolean = false;
  listFootageSelectAssignCurator: any = [];
  listFootageSelectSubmitRejected: any = [];
  mediaProducts: any = [];
  availableMediaProducts: boolean = false;
  thumbnailUrl: string;
  isLoading: boolean = false;
  listFootageAssignCurator: any = [];
  spinnerAssignCurator: boolean = false;
  isLoadingCurators: boolean = false;
  keywordSearch = {
    text: ""
  };
  pagingSharer = {
    currentPage: 1,
    pageSize: this.constants.pageSharerSize[0],
    total: 0,
    firstEntry: 0,
    lastEntry: 0,
    count: 0,
    pageSizeList: this.constants.pageSizeList
  };
  curators: any = [];
  selectedCurator: any = {};
  partner = {
    sharer: 'sharer',
    curator: 'curator'
  };
  notCuratorSelected: boolean = false;
  isValidPercentage: boolean = false;
  contentSubmitConfirm: string = '';
  memberId: string;
  isSave: boolean = false;
  hideSelectAll: boolean = false;
  maxItem: number;
  infoContentPage: any = {};
  public listKeywords: any = [];
  public dataKeywords: any = [];
  @ViewChild('sharersModal') sharersModal: ModalDirective;
  @ViewChild('search') search: ElementRef;
  @ViewChild('checkFootagesSubmitModal') public checkFootagesSubmitModal: ModalDirective;
  @ViewChild('searchFootageSubmitClear') searchFootageSubmitClear: ElementRef;
  @ViewChild('videoModal') public videoModal: VideoModalComponent;
  @ViewChild('checkCuratorListModal') public checkCuratorListModal: ModalDirective;
  @ViewChild('curatorListModal') curatorListModal: ModalDirective;
  @ViewChild('searchFootageClear') searchFootageClear: ElementRef;
  @ViewChild('searchCurator') searchCurator: ElementRef;
  @ViewChild('resubmissionListText') public resubmissionListText: ModalDirective;
  @ViewChild('submitFootagesConfirmModal') public submitFootagesConfirmModal: ModalDirective;
  @ViewChild('confirmSubmitAll') public confirmSubmitAll: ModalDirective;
  @ViewChild("completeProjectModal") completeProjectModal: ModalDirective;
  @ViewChild("confirmSharer") confirmSharer: ModalDirective;

  constructor(private constants: Constants, private apiUrl: ApiUrl, private commonService: CommonService,
    private uploadService: UploadService, private utils: Utils, private mediaProductService: MediaProductService,
    private toastr: ToastrService, private myBlackboxComponent: MyBlackboxComponent, private projectsService: ProjectsService,
    private accountService: AccountService, private projectService: ProjectsService, private sharedService: SharedService,
    private router: Router
  ) {
    this.maxItem = this.constants.maxKeyword;
    this.masterData = {
      footageCategories: commonService.getFootageCategories()
    }

    this.masterData.footageCategories = _.map(this.masterData.footageCategories, item => {
      if (!item.value) {
        item.value = null;
      }

      return item;
    });
  }

  ngOnInit() {
    this.sharedService.infoContentPage$.subscribe(info => {
      if(info != ''){
        this.paging = info.paging;
        this.keywords = info.keywords;
        this.infoContentPage = this.utils.clone(info);
      }
    });
    this.getMediaProducts();
    this.memberId = localStorage.getItem('userid');
    this.thumbnailUrl = this.apiUrl.thumbnail_media_products.replace('{memberId}', this.memberId);
    var keywords: any = keywordData;
    this.dataKeywords = keywords.default;
  }

  openLink(link) {
    if (link && link.indexOf('http') === 0) {
      return window.open(link);
    }
    return window.open('//' + link);
  }

  clearSearch() {
    this.keywords = '';
    this.getMediaProducts();
    this.search.nativeElement.focus();
  }

  getFootageCategories(mediaProduct) {
    mediaProduct.footageCategories = this.commonService.getFootageCategories();
    mediaProduct.footageCategories[0].value = null;
    if (mediaProduct.category) {
      var temp = _.find(this.masterData.footageCategories, item => {
        return item.value == mediaProduct.category || item.text == mediaProduct.category;
      });
      if (!temp) {
        mediaProduct.footageCategories.push({
          text: mediaProduct.category,
          value: mediaProduct.category
        })
      }
    }
  }

  getMediaProducts() {
    this.allowShowFootage = false;
    this.allowShow = false;
    mApp.blockPage();
    this.mediaProductService.getMediaProducts((this.paging.currentPage * this.paging.pageSize) + 1 - this.paging.pageSize, this.paging.pageSize, this.keywords)
      .then((result: any) => {
        mApp.unblockPage();
        this.mediaProducts = result.data.list;
        var listMediaProductId = this.mediaProducts.map(item => {
          return item.mediaProductId;
        });
        this.sharedService.emitListFootageIds(listMediaProductId);
        this.availableMediaProducts = this.mediaProducts.length ? true : false;
        this.allowShow = !this.mediaProducts.length ? true : false;
        this.paging.total = result.data.pageInfo.total;
        this.paging.count = result.data.pageInfo.totalDisplayRecords;
        this.mediaProducts.forEach(footage => {
          this.getFootageCategories(footage);
          footage.editMode = false;
          if(footage.category == null){
            footage.category = '';
          }
          if(footage.description == null){
            footage.description = '';
          }
          footage.categoryOld = footage.category;
          if(footage.description){
            footage.descriptionCharacters = footage.description.replace(/\s/g, "");
          }
          if (footage.keywords == null || footage.keywords == '') {
            footage.keywordsArray = [];
          } else {
            var keywordsArray = footage.keywords;
            keywordsArray = keywordsArray.split(",").map(String);
            var keywords = footage.keywords;
            keywords = keywords.split(',').join(', ');
            footage.keywords = keywords;

            keywordsArray = _.map(keywordsArray, (item) => {
              var obj: any = [];
              obj.value = item;
              obj.display = item;
              return obj;
            });
            footage.keywordsArray = keywordsArray;
          }
        });
        console.log(this.mediaProducts);
        if(this.infoContentPage.removeInfo){
          this.sharedService.emitInfoContentPage('');
        }
      });

    this.myBlackboxComponent.countMediaProducts();
  }
  // editMediaProduct(footage: any) {
  //   var self = this;
  //   if (footage.editorialDate){
  //     var editorialDate = moment.utc(footage.editorialDate);
  //     var year = editorialDate.get('year');
  //     var month = editorialDate.get('month');
  //     var date = editorialDate.get('date');
  //     footage.editorialDate = new Date(year, month, date);
  //   }
  //   self.sharedService.emitInfoModal('');
  //   self.sharedService.emitFootage(footage);
  //   let info = {
  //     paging: self.paging,
  //     keywords: self.keywords,
  //     removeInfo: false
  //   }
  //   self.sharedService.emitInfoWorkspacePage(info);
  //   self.router.navigate(['footage/media_products/edit']);
  // }
  editMediaProduct(mediaProductId: any) {
    this.sharedService.emitmediaProductId(mediaProductId)
    this.router.navigate(['my-blackbox/media-products/edit/'+ mediaProductId]);
  }

  onEditMode(mediaProduct) {
    if(mediaProduct.category === 'null'){
      mediaProduct.category = null;
    }
    var currentMediaProduct = this.utils.clone(mediaProduct);
    currentMediaProduct.keywordsArray = mediaProduct.keywordsArray;
    mediaProduct.editMode = true;
    mediaProduct.tempMediaProduct = currentMediaProduct;
    this.checkKeywordsNumber(mediaProduct);
    this.checkValidDesc(mediaProduct);
    console.log(mediaProduct);
  }

  offEditMode(mediaProduct) {
    if(!mediaProduct.category){
      mediaProduct.category = mediaProduct.categoryValue ? mediaProduct.categoryValue : null;
    }
    this.mediaProducts = _.map(this.mediaProducts, item => {
      if (item.mediaProductId == mediaProduct.mediaProductId) {
        item = mediaProduct.tempMediaProduct;
        item.category = mediaProduct.categoryOld;
        item.categoryValue = null;
        item.editMode = false;
      }
      return item;
    });
    console.log(mediaProduct);
  }

  saveMediaProduct(mediaProduct) {
    var id = '#' + mediaProduct.mediaProductId;
    mApp.block(id, { overlayColor: "#000000", type: "loader", state: "success", message: "Saving..." });
    if(!mediaProduct.category){
      mediaProduct.category = mediaProduct.categoryValue ? mediaProduct.categoryValue : null;
    }
    var keywordArray = mediaProduct.keywordsArray;
    keywordArray = _.pluck(keywordArray, 'value');
    keywordArray = keywordArray.toString();
    keywordArray.split(",").map(String);
    mediaProduct.keywords = keywordArray;

    var mediaProductInfo: any = {
      mediaProductId: mediaProduct.mediaProductId,
      description: mediaProduct.description,
      keywords: mediaProduct.keywords,
      category: mediaProduct.category
    };

    this.mediaProductService.updateMediaProduct(mediaProductInfo).then((result: any) => {
      result = result.json();
      if (result.success) {
        mediaProduct.categoryOld = mediaProduct.category;
        mediaProduct.categoryValue = null;
        mediaProduct.categoryValueOld = mediaProduct.categoryValue;
        mediaProduct.editMode = false;
        this.getFootageCategories(mediaProduct);
        if (this.checkValidDesc(mediaProduct) && this.checkKeywordsNumber(mediaProduct)) {
          mediaProduct.canSubmit = true;
        } else {
          mediaProduct.canSubmit = false;
        }
        mApp.unblock(id);
        this.toastr.success("Saved successfully!", "Success");
      }
    });
  }

  deleteMediaProduct(mediaProduct) {
    var id = '#' + mediaProduct.mediaProductId;
    mApp.block(id, { overlayColor: "#000000", type: "loader", state: "success", message: "Deleting..." });
    this.mediaProductService.deleteMediaProduct(mediaProduct).then((result: any) => {
      result = result.json();
      if (result.success) {
        mediaProduct.editMode = false;
        mApp.unblock(id);
        this.toastr.success("Deleted successfully!", "Success");
        this.getMediaProducts();
      }
    });
  }

  clickEdit(footage) {
    footage.isDescription = true;
    footage.isKeywords = true;
    this.checkValidDesc(footage);
    this.checkKeywordsNumber(footage);
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

  checkKeywordsNumber(footage: any) {
    footage.keywordsArray = _.reject(footage.keywordsArray, item =>{
      return item.value == '';
    })
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

  checkValidDesc(footage: any) {
    var count = 0;
    if (footage.description != undefined) {
      var validDescription = this.utils.validDescription(footage.description);
      var words = footage.description.replace(/(^\s*)|(\s*$)/gi, "");//exclude  start and end white-space
      words = words.replace(/[ ]{3,}/gi, " ");//3 or more space to 2
      words = words.replace(/\n /, "\n"); // exclude newline with a start spacing
      footage.descriptionCharacters = footage.description.replace(/\s/g, "");
      count = words.split(' ').length + words.split('\n').length - 1;
      if (count >= 5 && footage.description.length >= 15 && footage.description.length <= 200 && validDescription) {
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

  savedEdit(footage: any) {
    var self = this;
    var invalidDesc = self.checkValidDesc(footage);
    var keywordsNumber = self.checkKeywordsNumber(footage);
    if (footage.category != '' && invalidDesc && keywordsNumber) {
      footage.canSubmit = true;
    } else {
      footage.canSubmit = false;
    }
    footage.isDescription = false;
    footage.isKeywords = false;
    console.log(footage);
  }

  checkFootage(footage: any) {
    console.log(footage);
  }

  showModelSharing(footage: any) {
    this.listSharing = this.utils.clone(footage);
    this.listSharing.sharers.forEach(item => {
      if (item.sharedContent) {
        return item.disabled = item.sharedContent;
      }
      item.disabled = false;
    });
    this.hideSelectAll = _.every(this.listSharing.sharers, (item) =>{
      return item.sharedContent == true;
    })
    this.sharersModal.show();
    this.isSave = false;
    console.log(this.hideSelectAll);
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

  valueKeywords(footage): string {
    var self = this;
    var keywords = footage.keywordsArray;
    if (keywords) {
      if (keywords.length > 0) {
        keywords = _.pluck(keywords, 'value');
        keywords = keywords.toString();
        keywords = keywords.split(",").map(String);
        return keywords;
      }
    }
  }

  clearKeywords(footage: any) {
    footage.keywordsArray = [];
    footage.keywords = '';
  }

  pageChanged(page, pageSize, total?) {
    var self = this;
    self.paging.currentPage = page;
    self.allowShowFootage = false;
    self.getMediaProducts();
  }

  pageSizeChange() {
    this.pageChanged(1, this.paging.pageSize);
  }

  filterMediaProducts() {
    var self = this;
    self.paging.currentPage = 1;
    self.allowShowFootage = false;
    self.getMediaProducts();
  }

  checkListSubmit() {
    var self = this;
    self.spinnerSubmit = true;
    self.searchFootage = '';
    self.notFootagesSelected = false;
    self.listFootageSelectSubmit = [];
    self.listFootageSubmit = [];
    self.canSaveLocal = false;
    self.loadMediaProductsFilter('submit', true).then(() => {
      self.spinnerSubmit = false;
      self.checkFootagesSubmitModal.show();
    });

  }

  loadMediaProductsFilter(type: string, isRequest: boolean) {
    return new Promise((resolve, reject) => {
      var self = this;
      var blockId = "";

      if (type == 'curator') {
        blockId = "#m_blockui_curator_content";
      }

      if (type == 'submit') {
        blockId = "#m_blockui_submit_content";
      }

      if (isRequest) {
        mApp.block(blockId);
        self.mediaProductService.getMediaProducts(1, self.paging.total, self.searchFootage)
          .then((result: any) => {
            console.log(result);
            mApp.unblock(blockId);
            if (type == "curator") {
              result.list = _.filter(result.data.list, footages => {
                return footages.curationStatus == null;
              });
              self.removeFootagesSelectAssignCurator(result.list);
              resolve();
              console.log(self.listFootageAssignCurator);
            }

            if (type == "submit") {
              result.list = _.filter(result.data.list, footages => {
                return footages.canSubmit == true;
              });
              console.log(result.list);
              self.removeFootagesSelectSubmit(result.list);
              resolve();
              console.log(self.listFootageSubmit);
            }
          },
            err => {
              console.log(err);
            }
          );
      } else {
        var listFootage = self.utils.clone(self.footages);
        if (type == 'curator') {
          listFootage = _.filter(listFootage, (footage) => {
            return footage.curationStatus == null;
          });
          self.removeFootagesSelectAssignCurator(listFootage);
          resolve();
        }

        if (type == 'submit') {
          listFootage = _.filter(listFootage, (footage) => {
            return footage.canSubmit == true;
          });
          self.removeFootagesSelectSubmit(listFootage);
          resolve();
        }
      }
    });
  }

  removeFootagesSelectSubmit(listFootages: any) {
    var self = this;
    if (self.listFootageSelectSubmit.length > 0 && listFootages.length > 0) {
      self.listFootageSelectSubmit.forEach(footage => {
        listFootages.forEach(element => {
          if (element.mediaProductId == footage.mediaProductId) {
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
    self.listFootageSelectSubmit = _.reject(self.listFootageSelectSubmit, (item) => {
      return item.mediaProductId == footage.mediaProductId;
    });
    console.log(self.listFootageSelectSubmit);
    self.listFootageSubmit.forEach(element => {
      if (element.mediaProductId == footage.mediaProductId) {
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

  submitAllFootages(mediaProduct?) {
    var self = this;
    var temp = self.listFootageSelectSubmit;
    if (mediaProduct) {
      temp.push(mediaProduct);
    }
    if (self.listFootageSelectSubmit.length == 0) {
      return self.toastr.warning("Please select the media products to processing", "Warning");
    }
    self.confirmSubmitAll.show();
    $('#confirmSubmitAll').on('click', '#yesConfirmSubmitAll', (event) => {
      self.mediaProductService.submitMediaProducts(temp)
        .then((result: any) => {
          result = result.json();
          if (result.success) {
            this.confirmSubmitAll.hide();
            this.checkFootagesSubmitModal.hide();
            this.getMediaProducts();
            this.toastr.success('Submit successfully', 'Success');
            this.completeProject(temp[0]);
          }
        });
    });
  }

  completeProject(mediaProduct) {
    this.completeProjectModal.show();
    $('#completeProjectModal').off('click', '.btn-success').on('click', '.btn-success', () => {
      this.completeProjectModal.hide();
      this.projectService.completeProject(mediaProduct).then((result: any) => {
        if (result && result.status == 200) {
          this.toastr.success("Completed successfully!", "Success");
        } else {
          this.toastr.error("Sorry! please try again!", "Error");
        }
      });
    });
  }

  checkListFootage() {
    var listFootageRejected = [];
    var listFootage = [];
    listFootageRejected = _.filter(this.listFootageSelectSubmit, (footage) => {
      return footage.reviewStatus === "rejected";
    });
    listFootage = _.reject(this.listFootageSelectSubmit, (footage) => {
      return footage.reviewStatus === "rejected";
    });
    this.listFootageSelectSubmitRejected = listFootageRejected;
    this.listFootageSelectSubmit = listFootage;
  }

  clearSearchFootageSubmitClear() {
    this.searchFootage = '';
    this.loadMediaProductsFilter('submit', true);
    this.searchFootageSubmitClear.nativeElement.focus();
  }

  page(currentPage: any) {
    var self = this;
    if (self.paging.currentPage == currentPage.page) {
      return;
    }
    self.paging.currentPage = currentPage.page;
    self.getMediaProducts();
  }

  previewFootage(footage: any) {
    var self = this;
    self.videoModal.previewFootage(footage);
  }

  checkListAssignCurator() {
    var self = this;
    self.spinnerAssignCurator = true;
    self.searchFootage = '';
    self.notFootagesSelected = false;
    self.listFootageSelectAssignCurator = [];
    self.listFootageAssignCurator = [];
    self.isLoadingCurators = false;
    self.loadMediaProductsFilter('curator', true).then(() => {
      self.spinnerAssignCurator = false;
      self.checkCuratorListModal.show();
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

  removedFootageSelect(footage: any) {
    var self = this;
    self.listFootageSelectAssignCurator = _.reject(self.listFootageSelectAssignCurator, (item) => {
      return item.mediaProductId == footage.mediaProductId;
    });
    console.log(self.listFootageSelectAssignCurator);
    self.listFootageAssignCurator.forEach(element => {
      if (element.mediaProductId == footage.mediaProductId) {
        element.curatorCheck = false;
      }
    });
  }

  removeFootagesSelectAssignCurator(listFootages: any) {
    var self = this;
    if (self.listFootageSelectAssignCurator.length > 0 && listFootages.length > 0) {
      self.listFootageSelectAssignCurator.forEach(footage => {
        listFootages.forEach(element => {
          if (element.mediaProductId == footage.mediaProductId) {
            element.curatorCheck = true;
          }
        });
      });
      self.listFootageAssignCurator = listFootages;
    } else {
      self.listFootageAssignCurator = listFootages;
    }
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

  addFootageSelect(footage: any) {
    var self = this;
    footage.curatorCheck = true;
    var listFootageSelectAssignCurator = self.listFootageSelectAssignCurator;
    listFootageSelectAssignCurator.push(footage);
  }

  assignCurator() {
    var self = this;

    self.keywordSearch.text = "";
    if (self.listFootageSelectAssignCurator.length > 0) {
      self.isLoadingCurators = true;
      self.loadCurators();
      self.notFootagesSelected = false;

    } else {
      self.notFootagesSelected = true;
    }
  }

  loadCurators() {
    var self = this;
    self.uploadService.getSharers((self.pagingSharer.currentPage * self.pagingSharer.pageSize) + 1 - self.pagingSharer.pageSize, self.pagingSharer.pageSize, self.partner.curator, self.keywordSearch.text)
      .then(function (result: any) {
        console.log(result);
        if (result) {
          self.curators = result.list;
          self.pagingSharer.total = result.pageInfo.totalRecords;
          self.pagingSharer.count = result.pageInfo.totalDisplayRecords;
          self.checkCurators();
          self.isLoadingCurators = false;
          setTimeout(() => {
            self.checkCuratorListModal.hide();
            self.curatorListModal.show();
          }, 100);
        }
      });
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

  filterCurators(keyword) {
    var self = this;
    var blockId = "#m_blockui_curators_content .modal-content";
    mApp.block(blockId);
    this.selectedCurator = {};
    self.pagingSharer.currentPage = 1;
    self.pagingSharer.pageSize = self.constants.pageSharerSize[1];
    self.projectsService.getPartners((self.pagingSharer.currentPage * self.pagingSharer.pageSize) + 1 - self.pagingSharer.pageSize, self.pagingSharer.pageSize, self.partner.curator, keyword)
      .then((result: any) => {
        if (result) {
          self.curators = result.list;
          self.pagingSharer.total = result.pageInfo.totalRecords;
          self.pagingSharer.count = result.pageInfo.totalDisplayRecords;
          self.checkCurators();
          mApp.unblock(blockId);
        }
      });
  };

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

  selectCurator(curator) {
    var self = this;
    self.selectedCurator = curator;
    console.log(self.selectedCurator);
  };

  openAssignCuratorWarningModal() {
    var self = this;
    if (self.selectedCurator.id) {
      self.notCuratorSelected = false;

      if (!self.selectedCurator.collabShare) {
        return self.toastr.error("The sharing percentage is invalid.", "Error");
      } else {
        self.isValidPercentage = self.checkValidPercentageCurator(self.selectedCurator.collabShare);
      }

      if (!self.isValidPercentage) {
        return self.toastr.error("The sharing percentage of the curator has exceeded the total ownership percentage.", "Error");
      }

      self.curatorListModal.hide();
      setTimeout(() => {
        $('#warning-curator-assign').modal({ backdrop: 'static' });
        $('#warning-curator-assign').modal('show');
      }, 500);
    } else {
      self.notCuratorSelected = true;
    }
  }

  checkValidPercentageCurator = function (percentage) {
    var list = [];
    var self = this;

    self.listFootageSelectAssignCurator.forEach(footage => {
      list.push(footage.ownership);
    });
    var isValidPercentage = _.every(list, function (num) {
      return num > percentage;
    });
    return isValidPercentage;
  }

  clearSearchFootage() {
    this.searchFootage = '';
    this.loadMediaProductsFilter('curator', true);
    this.searchFootageClear.nativeElement.focus();
  }

  clearSearchCurator() {
    this.keywordSearch.text = '';
    this.filterCurators('');
    this.searchCurator.nativeElement.focus();
  }

  closeWarningCuratorAssign() {
    $('#warning-curator-assign').modal('hide');
    this.curatorListModal.show();
  }

  getSelectedCurationFootages() {
    var list = [];
    var self = this;
    self.listFootageSelectAssignCurator.forEach(footage => {
      list.push(footage.mediaProductId);
    });
    return list;
  }

  submitAssignCurator() {
    var self = this;
    var mediaProductIds = self.getSelectedCurationFootages();
    console.log(mediaProductIds);
    if (self.isValidPercentage) {
      if (mediaProductIds) {
        self.mediaProductService.assignCurator(self.selectedCurator, mediaProductIds)
          .then(function (result: any) {
            result = result.json();
            console.log(result);
            $('#warning-curator-assign').modal('hide');
            if (result && result.success) {
              self.getMediaProducts();
              self.closeSharerModal();
            } else {
              if (result && result.errMsg) {
                self.toastr.error(result.errMsg, "Error");
              }
            }
          });
      }
    }
  }

  closeSharerModal() {
    var self = this;
    self.pagingSharer.currentPage = 1;
    self.keywordSearch = {
      text: ""
    };
  }

  saveMemberViewContent() {
    var temp = {
      mediaProductId: this.listSharing.mediaProductId,
      list: this.listSharing.sharers
    }
    this.isSave = true;
    this.mediaProductService.memberViewContent(temp)
      .then((result: any) => {
        result = result.json();
        if (result.success) {
          this.isSave = false;
          this.toastr.success("Saved successfully!", "Success");
          this.sharersModal.hide();
          this.getMediaProducts();
        }
      })
  }

  selectAllSharing() {
    this.confirmSharer.show();
    $('#confirmSharer').on('click', '.btn-ok', (e) => {
      this.listSharing.sharers.forEach(item => {
        item.sharedContent = true;
      });
      this.confirmSharer.hide();
      this.saveMemberViewContent()
    })
  }
  getListKeywords(strInput): void {
    strInput = strInput.toLowerCase();
    if(strInput == ""){
      this.listKeywords = this.dataKeywords;
    }
    else{
      this.listKeywords = this.dataKeywords.filter(item => {
        if(item){
          item = item.toLowerCase();
          if(item.startsWith(strInput)){
            return item;
          }
        }
      });
    }
  }
}
