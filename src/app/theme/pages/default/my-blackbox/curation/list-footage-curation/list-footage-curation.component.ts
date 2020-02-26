import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective, PopoverDirective } from 'ngx-bootstrap';
import { ApiUrl } from 'src/app/utils/apiUrl';
import { AccountService } from 'src/app/services/account.service';
import { Constants } from 'src/app/utils/constants';
import { CommonService } from 'src/app/services/common.service';
import { UploadService } from 'src/app/services/upload.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared-service';
import { ToastrService } from 'ngx-toastr';
import { MediaProductService } from 'src/app/services/media-product.service';
import { Utils } from 'src/app/utils/utils';
import { VideoModalComponent } from 'src/app/theme/partials/video-modal/video-modal.component';
import { MyBlackboxComponent } from '../../my-blackbox.component';
import _ from 'underscore';

declare var $: any;
declare var mApp: any;
declare var moment: any;
@Component({
  selector: 'app-list-footage-curation',
  templateUrl: './list-footage-curation.component.html',
  styleUrls: ['./list-footage-curation.component.css']
})
export class ListFootageCurationComponent implements OnInit {
  public errorMessage: string = '';
  public paging: any = {
    currentPage: 1,
    pageSize: this.constants.pageSize,
    total: 0,
    firstEntry: 0,
    lastEntry: 0,
    count: 0,
    pageSizeList: this.constants.pageSizeList
  };
  public pagingMediaProducts: any = {
    currentPage: 1,
    pageSize: this.constants.pageSize,
    total: 0,
    firstEntry: 0,
    lastEntry: 0,
    count: 0,
    pageSizeList: this.constants.pageSizeList
  };
  public statusFilters: any = [];
  filterStatus: string = '';
  keywords: string = '';
  public footages: any = {};
  public allowShow: boolean = false;
  public thumbnailUrl: string;
  public footage: any = {};
  public emailModel: any = {};
  listFootages: any = [];
  checkAll: boolean = false;
  reasonsText: string = '';
  reasonsStatus: boolean = false;
  tempFootage: any = [];
  filterOwner: string = '';
  filterOwners: any = [
    {
      name: 'All',
      value: ''
    }
  ];
  allowShowMediaProducts: boolean = false;
  mediaProducts: any = [];
  isMediaProducts: boolean = false;
  tempMediaProduct: any = {};
  masterData: any = {};
  isLoading: boolean = false;
  thumbnailUrlMediaProduct: string;
  total: any;
  maxItem: number;
  tempInfoCurationPage: any = {};
  isShowLink: boolean = false;
  @ViewChild('csvUploadModal') public csvUploadModal: ModalDirective;
  @ViewChild('errorMessageModal') public errorMessageModal: ModalDirective;
  @ViewChild('videoModal') public videoModal: VideoModalComponent;
  @ViewChild('popoverRefuse') popoverRefuse: PopoverDirective;
  @ViewChild('search') search: ElementRef;
  @ViewChild('refuseAllModal') public refuseAllModal: ModalDirective;
  @ViewChild('refuseModal') public refuseModal: ModalDirective;
  @ViewChild('editMediaProductsModal')
  public editMediaProductsModal: ModalDirective;
  constructor(
    private myBlackboxComponent: MyBlackboxComponent,
    private apiUrl: ApiUrl,
    private accountService: AccountService,
    private constants: Constants,
    private commonService: CommonService,
    private uploadService: UploadService,
    private router: Router,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private mediaProductService: MediaProductService,
    private utils: Utils
  ) {
    this.maxItem = this.constants.maxKeyword;
    this.statusFilters = commonService.getCurationFootageStatus();
    this.masterData.footageCategories = commonService.getFootageCategories();
  }

  ngOnInit() {
    var self = this;
    if (localStorage.getItem('isCurator') !== 'true') {
      return self.router.navigate(['']);
    }
    self.sharedService.infoCurationPage$.subscribe(info => {
      if (info != '') {
        self.paging = info.paging;
        self.pagingMediaProducts = info.pagingMediaProducts;
        self.filterStatus = info.filterStatus;
        self.keywords = info.keywords;
        self.filterOwner = info.filterOwner;
        self.tempInfoCurationPage = self.utils.clone(info);
      }
    });

    self.total = self.myBlackboxComponent.total;
    var memberId = localStorage.getItem('userid');
    self.thumbnailUrl = self.apiUrl.thumbnail.replace('{memberId}', memberId);
    self.thumbnailUrlMediaProduct = self.apiUrl.thumbnail_media_products.replace(
      '{memberId}',
      memberId
    );
    self.initializeCsvUploadModal();
    self.getCurationOwners();
    self.loadFootages();
    self.getCurationMediaProducts();
  }

  showHelpModal() {
    $('#help-footage-curation-modal').modal('show');
  }

  initializeCsvUploadModal() {
    var self = this;
    var $fCsv = $('#fCsvc');
    var id = '#full';
    var url = self.apiUrl.upload_csv_curator.replace(
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
              'The uploaded csv file is invalid format, please use the latest template by download it from the link';
            errorMessageModal.show();
            $fCsv.fileinput('destroy');
            return false;
          } else {
            self.isShowLink = false;
          }

          if (errorMessage) {
            errorMessageModal.show();
            self.errorMessage = errorMessage;
          }

          self.loadFootages();
        }
      });
  }

  showCSVUpload() {
    var self = this;
    self.initializeCsvUploadModal();
    self.csvUploadModal.show();
  }

  page(currentPage: any) {
    var self = this;
    if (self.paging.currentPage == currentPage.page) {
      return;
    }
    self.paging.currentPage = currentPage.page;
    self.loadFootages();
  }

  pageSizeChange() {
    this.paging.currentPage = 1;
    this.loadFootages();
    this.pagingMediaProducts.currentPage = 1;
    this.getCurationMediaProducts();
  }

  pageMediaProductsChanged(currentPage: any) {
    var self = this;
    if (self.pagingMediaProducts.currentPage == currentPage.page) {
      return;
    }

    self.pagingMediaProducts.currentPage = currentPage.page;
    self.getCurationMediaProducts();
  }

  filterFootages() {
    this.paging.currentPage = 1;
    this.pagingMediaProducts.currentPage = 1;
    this.loadFootages();
    this.getCurationMediaProducts();
  }

  loadFootages() {
    var self = this;
    mApp.blockPage();
    self.allowShow = false;
    self.uploadService
      .getCurationFootages(
        self.paging.currentPage * self.paging.pageSize +
          1 -
          self.paging.pageSize,
        self.paging.pageSize,
        self.keywords,
        self.filterStatus,
        self.filterOwner
      )
      .then((result: any) => {
        mApp.unblockPage();
        if (!result) {
          return false;
        }
        if (self.paging.currentPage > 1 && result.list.length == 0) {
          self.paging.currentPage -= 1;
          return self.loadFootages();
        }
        self.footages = result.list;
        var listFootageIds = self.footages.map(item => {
          return item.footageId;
        });
        self.sharedService.emitListFootageIds(listFootageIds);
        self.allowShow = !self.footages.length ? true : false;
        self.paging.total = result.pageInfo.totalRecords;
        self.paging.count = result.pageInfo.totalDisplayRecords;
        self.myBlackboxComponent.countFootages();
        if (self.tempInfoCurationPage.removeData) {
          self.sharedService.emitInfoCurationPage('');
        }
        console.log(self.footages);
      });
  }

  getCurationMediaProducts() {
    this.allowShowMediaProducts = false;
    this.mediaProductService
      .getCurationMediaProducts(
        this.pagingMediaProducts.currentPage * this.paging.pageSize +
          1 -
          this.paging.pageSize,
        this.paging.pageSize,
        this.keywords,
        this.filterStatus,
        this.filterOwner
      )
      .then((result: any) => {
        this.mediaProducts = result.data.list;
        this.allowShowMediaProducts = !this.mediaProducts.length ? true : false;
        this.pagingMediaProducts.total = result.data.pageInfo.totalRecords;
        this.pagingMediaProducts.count =
          result.data.pageInfo.totalDisplayRecords;
        console.log(this.mediaProducts);
      });
    this.myBlackboxComponent.countMediaProducts();
  }

  previewFootage(footage: any) {
    var self = this;
    if (footage.canPreview) {
      self.videoModal.previewFootage(footage);
    }
  }

  sendMail(footage) {
    var self = this;
    var id = '#refuse-modal';
    var info = [];
    info.push(footage);
    mApp.block(id);
    if (!self.isMediaProducts) {
      console.log(info);
      self.uploadService
        .refusedByCuration(info, self.reasonsText)
        .then((result: any) => {
          result = result.json();
          if (result.success) {
            mApp.unblock(id);
            self.toastr.success('Refused successfully!', 'Success');
            self.loadFootages();
            self.hideRefuseModal();
          } else {
            self.toastr.error(result.error, 'Error');
            self.loadFootages();
          }
        });
    } else {
      console.log(info, self.reasonsText);
      self.mediaProductService
        .refuseCurationMediaProducts(info, self.reasonsText)
        .then((result: any) => {
          result = result.json();
          if (result.success) {
            mApp.unblock(id);
            self.toastr.success('Refused successfully!', 'Success');
            self.getCurationMediaProducts();
            self.hideRefuseModal();
          } else {
            self.toastr.error(result.error, 'Error');
            self.getCurationMediaProducts();
          }
        });
    }
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
    self.sharedService.emitInfoModal('');
    self.sharedService.emitFootageCuration(footage);
    let infoPage = {
      paging: self.paging,
      filterStatus: self.filterStatus,
      keywords: self.keywords,
      filterOwner: self.filterOwner,
      pagingMediaProducts: self.pagingMediaProducts,
      removeData: false
    };
    self.sharedService.emitInfoCurationPage(infoPage);
    self.router.navigate(['my-blackbox/curation/edit']);
  }

  downloadCSVTemplate() {
    var self = this;
    window.open(
      self.apiUrl.download_template.replace('{type}', '2'),
      'Download CSV template'
    );
  }

  clearSearch() {
    this.keywords = '';
    this.filterFootages();
    this.search.nativeElement.focus();
  }

  showRefuseAllModal() {
    var self = this;
    self.listFootages = self.footages;
    self.reasonsText = '';
    self.reasonsStatus = false;
    self.listFootages.forEach(footage => {
      footage.refuseStatus = false;
    });
    self.refuseAllModal.show();
  }

  showRefuseModal(footage: any) {
    var self = this;
    self.reasonsText = '';
    self.reasonsStatus = false;
    self.tempFootage = footage;
    if (footage.footageId) {
      self.isMediaProducts = false;
    } else {
      self.isMediaProducts = true;
    }
    self.refuseModal.show();
  }

  hideRefuseAllModal() {
    var self = this;
    self.listFootages = [];
    self.reasonsText = '';
    self.reasonsStatus = false;
    self.refuseAllModal.hide();
  }

  hideRefuseModal() {
    var self = this;
    self.isMediaProducts = false;
    self.reasonsText = '';
    self.reasonsStatus = false;
    self.refuseModal.hide();
  }

  checkRefuseStatusAll() {
    var self = this;
    self.listFootages.forEach(footage => {
      footage.refuseStatus = self.checkAll;
    });
  }

  submitRefuseAllModal() {
    var self = this;
    var list = [];
    var id = '#refuseAllModal';
    self.listFootages.forEach(footage => {
      if (footage.refuseStatus) {
        list.push(footage);
      }
    });
    if (list.length == 0) {
      return self.toastr.error('Please select footage refuse.', 'Error');
    }
    mApp.block(id);
    self.uploadService
      .refusedByCuration(list, self.reasonsText)
      .then((result: any) => {
        result = result.json();
        if (result.success) {
          mApp.unblock(id);
          self.toastr.success('Refused successfully!!', 'Success');
          self.hideRefuseAllModal();
          self.loadFootages();
        } else {
          self.toastr.error(result.error, 'Error');
          self.loadFootages();
        }
      });
  }

  getCurationOwners() {
    this.uploadService.getCurationOwners().then((result: any) => {
      this.filterOwners = this.filterOwners.concat(result.data);
    });
  }

  checkMaxSize() {
    // if(this.allowShow && this.allowShowMediaProducts){
    //   return 5;
    // }
    return 5;
  }

  editMediaProducts(data: any) {
    var temp: any = {};
    this.isLoading = false;
    temp = this.utils.clone(data);
    this.getFootageCategories(temp);
    if (temp.keywords == null || temp.keywords == '') {
      temp.keywordsArray = [];
    } else {
      var keywordsArray = temp.keywords;
      keywordsArray = keywordsArray.split(',').map(String);
      var keywords = temp.keywords;
      keywords = keywords.split(',').join(', ');
      temp.keywords = keywords;

      keywordsArray = _.map(keywordsArray, item => {
        var obj: any = {};
        obj.value = item;
        obj.display = item;
        return obj;
      });
      temp.keywordsArray = keywordsArray;
    }
    this.tempMediaProduct = temp;
    this.editMediaProductsModal.show();
    console.log(this.tempMediaProduct);
  }

  getFootageCategories(mediaProduct) {
    mediaProduct.footageCategories = this.commonService.getFootageCategories();
    mediaProduct.footageCategories[0].value = null;
    if (mediaProduct.category) {
      var temp = _.find(this.masterData.footageCategories, item => {
        return (
          item.value == mediaProduct.category ||
          item.text == mediaProduct.category
        );
      });
      if (!temp) {
        mediaProduct.footageCategories.push({
          text: mediaProduct.category,
          value: mediaProduct.category
        });
      }
    }
  }

  checkValidDesc(mediaProduct: any) {
    var count = 0;
    if (mediaProduct.description != undefined) {
      var validDescription = this.utils.validDescription(
        mediaProduct.description
      );
      var words = mediaProduct.description.replace(/(^\s*)|(\s*$)/gi, ''); //exclude  start and end white-space
      words = words.replace(/[ ]{3,}/gi, ' '); //3 or more space to 2
      words = words.replace(/\n /, '\n'); // exclude newline with a start spacing
      mediaProduct.descriptionCharacters = mediaProduct.description.replace(
        /\s/g,
        ''
      );
      count = words.split(' ').length + words.split('\n').length - 1;
      mediaProduct.description = words;
      if (
        count >= 5 &&
        mediaProduct.description.length >= 15 &&
        mediaProduct.description.length <= 200 &&
        validDescription
      ) {
        mediaProduct.invalidDesc = false;
        return true;
      } else {
        mediaProduct.invalidDesc = true;
        return false;
      }
    } else {
      mediaProduct.invalidDesc = true;
      return false;
    }
  }

  copyKeywords() {
    let value = this.valueKeywords();
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

  valueKeywords(): string {
    var self = this;
    var keywords = self.tempMediaProduct.keywordsArray;
    if (keywords) {
      if (keywords.length > 0) {
        keywords = _.pluck(keywords, 'value');
        keywords = keywords.toString();
        keywords = keywords.split(',').map(String);
        return keywords;
      }
    }
  }

  clearKeywords(mediaProduct: any) {
    mediaProduct.keywordsArray = [];
    mediaProduct.keywords = '';
  }

  checkKeywordsNumber(mediaProduct: any) {
    if (
      mediaProduct.keywordsArray.length > 7 &&
      mediaProduct.keywordsArray.length < 50
    ) {
      mediaProduct.invalidKeywords = false;
      return true;
    }
    mediaProduct.invalidKeywords = true;
    return false;
  }

  saveEditMediaProduct() {
    var keywordArray = this.tempMediaProduct.keywordsArray;
    keywordArray = _.pluck(keywordArray, 'value');
    keywordArray = keywordArray.toString();
    keywordArray.split(',').map(String);
    this.tempMediaProduct.keywords = keywordArray;
    console.log(this.tempMediaProduct);
    this.isLoading = true;
    this.tempMediaProduct.curationStatus = 'completed';
    if (
      !this.tempMediaProduct.category ||
      this.tempMediaProduct.category == 'null'
    ) {
      this.tempMediaProduct.category = this.tempMediaProduct.categoryValue
        ? this.tempMediaProduct.categoryValue
        : null;
    }
    this.mediaProductService
      .updateMediaProduct(this.tempMediaProduct)
      .then((result: any) => {
        result = result.json();
        if (result.success) {
          this.isLoading = false;
          this.getCurationMediaProducts();
          this.toastr.success('Saved successfully!', 'Success');
          this.editMediaProductsModal.hide();
        }
      });
  }
}
