import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from '../../../../../../services/shared-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrl } from 'src/app/utils/apiUrl';
import { Constants } from 'src/app/utils/constants';
import { CommonService } from 'src/app/services/common.service';
import { AccountService } from 'src/app/services/account.service';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from 'src/app/services/upload.service';
import { ModalDirective, BsDatepickerConfig } from 'ngx-bootstrap';
import { ProjectsService } from '../../../../../../services/projects.service';
import { ReleaseService } from 'src/app/services/release.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { Utils } from 'src/app/utils/utils';
import { MediaProductService } from 'src/app/services/media-product.service';
import * as keywordData from '../../../../../../../assets/auto-complete/keywords.json';
import * as _ from 'underscore';

declare var plyr: any;
declare var $: any;
declare var moment: any;
declare var mApp: any;
@Component({
  selector: 'app-edit-media-product',
  templateUrl: './edit-media-product.component.html',
  styleUrls: ['./edit-media-product.component.css']
})
export class EditMediaProductComponent implements OnInit {
  public bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'MM-DD-YYYY',
    containerClass: 'theme-default'
  };
  public footage: any = null;
  public maxDate: Date;
  public footageCheck: any = {};
  public masterData: any;
  public is_description = false;
  public is_keywords = false;
  public is_documents = false;
  public is_categories = false;
  public position: number;
  keywordsDocument: any;
  modelReleases: any = [];
  propertyReleases: any = [];
  selectedModelReleases: any = [];
  selectedPropertyReleases: any = [];
  isAttachedAll: boolean = false;
  currentFootageReleases: any = [];
  listDocumentProperty: any = [];
  statusValidDocumentInfo: boolean = false;
  public currentDocument: any = {};
  public statusErrorDocumentsInfo: boolean = false;
  public documentsInfo: any = {
    age: false,
    ethnicity: false,
    gender: false,
    status: false
  }
  public totalPercent: number = 0;
  public keywordSearch = {
    text: ""
  };
  public pagingSharer = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    count: 0
  };
  public partner = {
    sharer: 'sharer',
    curator: 'curator'
  };
  public sharers: any = [];
  public selectedSharer: any = [];
  public currentSharers: any = [];
  public allowShowListSharers: boolean = false;
  scrWidth:any;
  setWidth: boolean = false;
  statusValid: boolean = false;
  public avatarUrlB: string = this.apiUrl.get_avatar.replace('{defaultType}', "B");
  newDocumentId: string = "";
  canSaveLocal: boolean = false;
  tempProperty: any = {};
  contentSubmitConfirm: string = '';
  canReminder: boolean = false;
  isJustUploadedRelease: boolean = false;
  public loading: boolean = false;
  thumbnailUrl: string;
  public hidePlayFootage: boolean = true;
  countModelReleases: number = 0;
  countPropertyReleases: number = 0;
  totalPercentStatus: boolean = false;
  isSubmit: boolean = false;
  test: boolean = false;
  currentCurators: any = [];
  savingSharers: boolean = false;
  saving: boolean = false;
  maxItem: number;
  responseMessage: string;
  dataImage: any = [];
  isIgnoreFootage: boolean;
  public mediaProductId: any = null;
  public memberId: string = '';
  public recordingDate: any = null;
  public callToActionUrl: string;
  public endScreenUrl: string;
  public titleImport: string = '';
  public customThumbnailUrl: string;
  public currentItem: number = 0;
  public listFootageIds: any = [];
  public isNext: boolean = false;
  public keyword: string = 'name';
  public listKeywords: any = [];
  public dataKeywords: any = [];
  @ViewChild('changeModelDocument') public changeModelDocument : ModalDirective;
  @ViewChild('confirmRelease') confirmRelease: ModalDirective;
  @ViewChild('justUploadedRelease') justUploadedRelease : ModalDirective;
  @ViewChild('updateModelRelease') updateModelRelease : ModalDirective;
  @ViewChild('notifyNewRelease') public notifyNewRelease : ModalDirective;
  @ViewChild('propertyDocument') public propertyDocument : ModalDirective;
  @ViewChild('modelDocument') public modelDocument : ModalDirective;
  @ViewChild('resubmitFootageModal') public resubmitFootageModal: ModalDirective;
  @ViewChild("confirmModal") confirmModal: ModalDirective;
  @ViewChild("viewReleaseModal") viewReleaseModal: ModalDirective;
  @ViewChild('searchModelDocuments') searchModelDocuments: ElementRef;
  @ViewChild('searchPropertyDocuments') searchPropertyDocuments: ElementRef;
  @ViewChild('searchSharers') searchSharers: ElementRef;
  @ViewChild('modalImportThumbnail') public modalImportThumbnail : ModalDirective;
  @ViewChild('modalImportCallToAction') public modalImportCallToAction : ModalDirective;
  @ViewChild('modalImportEndscreen') public modalImportEndscreen : ModalDirective;
  @ViewChild('modalRemoveCallToAction') public modalRemoveCallToAction : ModalDirective;
  @ViewChild('modalRemoveEndScreen') public modalRemoveEndScreen : ModalDirective;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.scrWidth = window.innerWidth;
    if (this.scrWidth < 768) {
      this.setWidth = true;
    } else {
      this.setWidth = false;
    }
  }
  constructor(private sharedService: SharedService, private router: Router, private apiUrl: ApiUrl, private constants: Constants, private commonService: CommonService,
    private accountService: AccountService, private toastr: ToastrService, private uploadService: UploadService, private projectsService: ProjectsService,
    private releaseService: ReleaseService, private authenticateService: AuthenticateService, private utils: Utils,
    private mediaProductService: MediaProductService, private route: ActivatedRoute) {
      // this.sharedService.mediaProductId$.subscribe(mediaProductId => {
      //   this.mediaProductId = mediaProductId;
      //   if(this.mediaProductId == null){
      //     return this.router.navigate(['footage/media_products/']);
      //   }
      // });
      this.route.params.subscribe(params => {
        this.mediaProductId = params['id'];
        if(this.mediaProductId == null){
          return this.router.navigate(['footage/media_products/']);
        }
      });
      this.maxDate = new Date();
      this.maxItem = this.constants.maxKeyword;
      this.masterData = {
        countries: commonService.getCountries(),
        modelEthnicities: commonService.getModelEthnicities(),
        modelAges: commonService.getModelAges(),
        modelGenders: commonService.getModelGenders(),
        footageCategories: commonService.getFootageCategories(),
      };
  }
  ngOnInit() {
    var self = this;
    this.memberId = localStorage.getItem('userid');
    self.thumbnailUrl = self.apiUrl.thumbnail_media_products.replace('{memberId}', this.memberId);
    self.sharedService.listFootageIds$.subscribe(footageIds => {
      self.listFootageIds = footageIds;
    });
    self.getMediaProduct();
  }
  getMediaProduct(): void {
    var self = this;
    this.mediaProductService.getMediaProduct(this.mediaProductId).then(function(result){
      if(result.success && result.data){
        console.log('getMediaProduct', result.data);
        self.footage = result.data;
        if(self.footage.description){
          self.footage.descriptionCharacters = self.footage.description.replace(/\s/g, "");
        }
        if (self.footage.category == null) {
          self.footage.category = '';
        }
        if(self.footage.description == null){
          self.footage.description = '';
        }
        if(self.footage.recordingDate){
          self.recordingDate = new Date(self.footage.recordingDate);
        }
        self.customThumbnailUrl = self.apiUrl.get_custom_image.replace('{memberId}', self.memberId);
        self.callToActionUrl = self.apiUrl.get_custom_image.replace('{memberId}', self.memberId);
        self.endScreenUrl = self.apiUrl.get_custom_image.replace('{memberId}', self.memberId);
        self.setThumbnail();
        self.setCallToAction();
        self.setEndScreen();
        self.setKeywordsForMediaProduct();
        self.initializeVideoModal();
        self.initializeDocumentUpload('');
        self.getScreenSize();
        self.hidePlayFootage = true;
        self.checkValidDesc(self.footage);
        self.checkKeywordsNumber(self.footage);
        console.log(self.footage);
        var keywords: any = keywordData;
        self.dataKeywords = keywords.default;
      }
    });
  }
  setKeywordsForMediaProduct(): void {
    if (this.footage.keywords == null || this.footage.keywords == '') {
      this.footage.keywordsArray = [];
    } else {
      var keywordsArray = this.footage.keywords;
      keywordsArray = keywordsArray.split(",").map(String);
      var keywords = this.footage.keywords;
      keywords = keywords.split(',').join(', ');
      this.footage.keywords = keywords;

      keywordsArray = _.map(keywordsArray, (item) => {
        var obj: any = [];
        obj.value = item;
        obj.display = item;
        return obj;
      });
      this.footage.keywordsArray = keywordsArray;
    }
  }
  initializeVideoModal() {
    var video: any = document.getElementById('videoControl');
    video.pause();
    video.currentTime = 0;
    while (video.firstChild) {
      video.removeChild(video.firstChild);
    }
  }

  previewFootage(footage: any){
    var self = this;
    $("source").remove();
    var mediaProductId = footage.mediaProductId;
    var memberId = localStorage.getItem('userid');
    var url = self.apiUrl.get_media_products_video.replace('{mediaProductId}', mediaProductId).replace("{memberId}", memberId);
    var source = document.createElement('source');
    source.setAttribute('src', url);

    var video: any = document.getElementById('videoControl');
    video.appendChild(source);

    video.load();
    plyr.setup('video', self.constants.videoControlsOptions);
    video.play();
    this.hidePlayFootage = false;
  }

  checkValidDesc(footage: any, isClean?: boolean) { 
    var count = 0;
    if (footage.description != undefined) {
      var validDescription = this.utils.validDescription(footage.description);
      console.log(footage.description)
      var words = footage.description.replace(/(^\s*)|(\s*$)/gi, "");//exclude  start and end white-space
      words = words.replace(/[ ]{3,}/gi, " ");//3 or more space to 2
      words = words.replace(/\n /, "\n"); // exclude newline with a start spacing
      footage.descriptionCharacters = footage.description.replace(/\s/g, "");
      count = words.split(' ').length + words.split('\n').length - 1;
      if (isClean) {
        footage.description = words;
      }
      let tempWords = words.replace(/\n/gi, ' ');
      var wordArray = tempWords.split(' ');
      var items = _.difference(wordArray, this.constants.ignoreDescriptionWords);
      var tempArray = _.chain(items).countBy().value();
      var valueArray = [];
      tempArray = _.mapObject(tempArray, (val, key) => {
        var sub = {
            word: key,
            times: val
        }
    
        valueArray.push(sub);
        return val
      })
      var maxTimes =  _.chain(valueArray)
          .map(item => { return item })
          .find(item => { return item.times > this.constants.maxRepeatTimes })
          .value();
      console.log("maxTimes", maxTimes)
      footage.maxTimes = maxTimes;
      if (count >= 5 && words.length >= 15 && words.length <= 200 && validDescription) {
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

  valueKeywords(): string {
    var self = this;
    var keywords = self.footage.keywordsArray;
    if (keywords) {
      if (keywords.length > 0) {
        keywords = _.pluck(keywords, 'value');
        keywords = keywords.toString();
        keywords = keywords.split(",").map(String);
        return keywords;
      }
    }
  }

  copyKeywords(){
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

  clearKeywords(footage: any){
    footage.keywordsArray = [];
    footage.keywords = '';
  }

  checkKeywordsNumber(footage: any){ 
    footage.keywordsArray = _.reject(footage.keywordsArray, item =>{
      return item.value == '';
    })
    footage.keywordsArray = _.uniq(footage.keywordsArray, item => {
      return item.value.toLowerCase();
    });
    if(footage.keywordsArray.length > 7 && footage.keywordsArray.length < 50){ 
      footage.invalidKeywords = false;
      return true;
    }
    footage.invalidKeywords = true;
    return false;
  }

  cancelEditFootage(){
    this.router.navigate(['my-blackbox/media-products']);
  }

  getDataModel(models: any){
    var self = this;
    self.canReminder = false;
    self.keywordsDocument = '';
    self.newDocumentId = '';
    self.selectedModelReleases = [];
    self.isJustUploadedRelease = false;
    self.currentFootageReleases = JSON.parse(JSON.stringify(models));
    self.statusValidDocumentInfo = false;
    self.loadDocuments(true, false);
    self.initializeDocumentUpload(self.footage.mediaProductId);
    self.modelDocument.show();
  }

  initializeDocumentUpload(mediaProductId: any) {
    var self = this;
    var url = self.apiUrl.upload_footage_document.replace('{memberId}', self.accountService.getUserId());
    if (self.footage.projectId && self.footage.memberId !== self.accountService.getUserId()) {
      url += '?ownerId='+self.footage.memberId;
    }
    var $fModel = $("#fModel");
    $fModel.fileinput($.extend(self.constants.defaultFileInputSettings, {
      uploadUrl: url.replace('{documentType}', 'M'),
      uploadAsync: true,
      showPreview: false,
      allowedFileExtensions: ["pdf", "jpeg", "jpg", "png"],
      ajaxSettings: {
        headers: {
          Token: self.accountService.getToken()
        }
      }
    }));
    $fModel.fileinput('clear');

    var $fProperty = $("#fProperty");
    if ($fProperty.fileinput) {
      $fProperty.fileinput('destroy');
    }
    $fProperty.fileinput($.extend(self.constants.defaultFileInputSettings, {
      uploadUrl: url.replace('{documentType}', 'P'),
      showPreview: false,
      allowedFileExtensions: ["pdf", "jpeg", "jpg", "png"],
      ajaxSettings: {
        headers: {
          Token: self.accountService.getToken()
        }
      }
    }));
    $fProperty.fileinput('clear');
    var toastr = self.toastr;

    $fModel.off('fileuploaded').on('fileuploaded', function (event, data, previewId, index) {
      self.canReminder = false;
      if (data.response.message) {
        toastr.error(data.response.message, 'Error');
      } else {
        self.isJustUploadedRelease = true;
        console.log(data.response);
        self.newDocumentId = data.response.documentId;
        self.loadDocuments(true, false);
        self.updateDocumentInfo(data.response);

      }
    })

    $fModel.off('filebatchuploadcomplete').on('filebatchuploadcomplete', function (event, files, extra) {
      $fModel.fileinput('clear');
    });
    $('#fModel').off('fileloaded').on('fileloaded', (event, file, previewId, index, reader) => {
      self.canReminder = true;
    });

    $('#fModel').off('fileclear').on('fileclear', (event, file, previewId, index, reader) => {
      self.canReminder = false;
    });

    $('#fModel').off('fileremoved').on('fileremoved', function (event, id, index) {
      self.canReminder = false;
    });

    $fProperty.off('fileuploaded').on('fileuploaded', function (event, data, previewId, index) {
      self.canReminder = false;
      if (data.response.message) {
        toastr.error(data.response.message, 'Error');
      } else {
        self.isJustUploadedRelease = true;
        self.newDocumentId = data.response.documentId;
        self.loadDocuments(false, true);
      }
    });

    $fProperty.off('filebatchuploadcomplete').on('filebatchuploadcomplete', function (event, files, extra) {
      $fProperty.fileinput('clear');
    });

    $fProperty.change(function () {
      self.canReminder = true;
      if (self.newDocumentId != "") {
        self.canReminder = false;
      }
    });

    $fModel.change(function () {
      self.canReminder = true;
      if (self.newDocumentId != "") {
        self.canReminder = false;
      }
    });

    $('#fProperty').off('filebatchuploadcomplete').on('filebatchuploadcomplete', function (event, files, extra) {
      $fProperty.fileinput('clear');
    })

    $('#fProperty').off('fileloaded').on('fileloaded', (event, file, previewId, index, reader) => {
      self.canReminder = true;
    });

    $('#fProperty').off('fileclear').on('fileclear', (event, file, previewId, index, reader) => {
      self.canReminder = false;
    });

    $('#fProperty').off('fileremoved').on('fileremoved', function (event, id, index) {
      self.canReminder = false;
    });

  }

  loadDocuments(modelCheck, propertyCheck) {
    var self = this;
    var keyword = self.keywordsDocument;
    if (modelCheck == true) {
      self.uploadService.getMediaProductDocuments(this.memberId, true, false, keyword).then((result: any) =>{
          if(!result){
            return false;
          } else {
            console.log(result);
            self.modelReleases = result.list;
            var selectedList = [];
            var currentModelReleases = self.currentFootageReleases;
            if (currentModelReleases && currentModelReleases.length) {
              selectedList = currentModelReleases;
              selectedList = _.map(selectedList, item => {
                item.selectedCheck = true;
                return item;
              });
            }
            
            // Auto check the new document just uploaded
            if (self.newDocumentId) {
              self.modelReleases = _.map(self.modelReleases, (item) => {
                if (item.documentId == self.newDocumentId) {
                  item.selectedCheck = true;
                  selectedList.push(item);
                }
                return item;
              });
              self.newDocumentId = "";
            }

            _.each(selectedList, (item) => {
              var checkExistSelectedRelease = _.some(self.selectedModelReleases, (i) => {
                return item.documentId == i.documentId;
              })
              if (!checkExistSelectedRelease) {
                self.selectedModelReleases.push(item);
              }
            });

            _.each(self.selectedModelReleases, item => {
              self.modelReleases = _.map(self.modelReleases, (modelRelease) => {
                if (modelRelease.documentId == item.documentId) {
                  modelRelease.selectedCheck = true;
                }
                return modelRelease;
              });
            });
            
            self.isAttachedAll = _.every(self.modelReleases, (item) => {
                return item.selectedCheck == true;
            });
          }
        })
    }

    if (propertyCheck == true) {
      self.uploadService.getMediaProductDocuments(this.memberId, false, true, keyword).then((result: any) =>{
          if(!result){
            return false;
          } else {
            console.log(result);
            self.propertyReleases = result.list;
            var selectedList = [];
            var currentPropertyReleases = self.currentFootageReleases;
            if (currentPropertyReleases && currentPropertyReleases.length) {
              selectedList = currentPropertyReleases;
              selectedList = _.map(selectedList, item => {
                item.selectedCheck = true;
                return item;
              });
            }
            
            // Auto check the new document just uploaded
            if (self.newDocumentId) {
              self.propertyReleases = _.map(self.propertyReleases, (item) => {
                if (item.documentId == self.newDocumentId) {
                  item.selectedCheck = true;
                  selectedList.push(item);
                }
                return item;
              });
              self.newDocumentId = "";
            }

            _.each(selectedList, (item) => {
              var checkExistSelectedRelease = _.some(self.selectedPropertyReleases, (i) => {
                return item.documentId == i.documentId;
              })
              if (!checkExistSelectedRelease) {
                self.selectedPropertyReleases.push(item);
              }
            });

            _.each(self.selectedPropertyReleases, item => {
              self.propertyReleases = _.map(self.propertyReleases, (propertyRelease) => {
                if (propertyRelease.documentId == item.documentId) {
                  propertyRelease.selectedCheck = true;
                }
                return propertyRelease;
              });
            });
            
            self.isAttachedAll = _.every(self.propertyReleases, (item) => {
                return item.selectedCheck == true;
            });
          }
        })
    }

    self.countReleases(self.footage.memberId);
  }

  addModelRelease(release) {
    var self = this;
    release.selectedCheck = true;
    self.selectedModelReleases.push(release);
    self.modelReleases = _.map(self.modelReleases, item => {
      if (item.documentId == release.documentId) {
        item.selectedCheck = true;
      }
      return item;
    });
    self.isAttachedAll = _.every(self.modelReleases, (item) => {
      return item.selectedCheck == true;
    });
  }

  removeModelRelease = (release) => {
    var self = this;
    self.deattachReleaseForMediaProduct(release, true, false).then(() => {
      release.selectedCheck = false;
      self.selectedModelReleases = _.reject(self.selectedModelReleases, item => {
        return item.documentId == release.documentId;
      });
      self.currentFootageReleases = _.reject(self.currentFootageReleases, item => {
        return item.documentId == release.documentId;
      });
      self.modelReleases = _.map(self.modelReleases, item => {
        if (item.documentId == release.documentId) {
          item.selectedCheck = false;
        }
        return item;
      });
      self.isAttachedAll = _.every(self.modelReleases, (item) => {
        return item.selectedCheck == true;
      });
    });
  }

  addPropertyRelease(release) {
    var self = this;
    release.selectedCheck = true;
    self.selectedPropertyReleases.push(release);
    self.propertyReleases = _.map(self.propertyReleases, item => {
      if (item.documentId == release.documentId) {
        item.selectedCheck = true;
      }
      return item;
    });
    self.isAttachedAll = _.every(self.propertyReleases, (item) => {
      return item.selectedCheck == true;
    });
  }

  removePropertyRelease = (release) => {
    var self = this;
    self.deattachReleaseForMediaProduct(release, false, true).then(() => {
      release.selectedCheck = false;
      self.selectedPropertyReleases = _.reject(self.selectedPropertyReleases, item => {
        return item.documentId == release.documentId;
      });
      self.currentFootageReleases = _.reject(self.currentFootageReleases, item => {
        return item.documentId == release.documentId;
      });
      self.propertyReleases = _.map(self.propertyReleases, item => {
        if (item.documentId == release.documentId) {
          item.selectedCheck = false;
        }
        return item;
      });
      self.isAttachedAll = _.every(self.propertyReleases, (item) => {
        return item.selectedCheck == true;
      });
    });
  }

  deattachReleaseForMediaProduct = (release, modelCheck, propertyCheck) => {
    return new Promise((resolve, reject) => {
      this.releaseService.deattachReleaseForMediaProduct(this.footage.footageId, release.documentId).then((result: any) => {
        if (result) {
          if (modelCheck) {
            this.modelReleases = _.map(this.modelReleases, (item) => {
              if (item.documentId == release.documentId) {
                item.canDelete = result.canDelete;
              }

              return item;
            });
          }

          if (propertyCheck) {
            this.propertyReleases = _.map(this.propertyReleases, (item) => {
              if (item.documentId == release.documentId) {
                item.canDelete = result.canDelete;
              }

              return item;
            });
          }

          resolve();
        }
      });
    });
  }

  saveDocument(modelCheck: boolean, propertyCheck: boolean) {
    var self = this;
    if (modelCheck) {
      if (self.canReminder) {
        return self.toastr.warning("Please click upload button to upload your release.", "Warning");
      }
      var listSelectedRelease = self.footage.documents.propertyDocuments.concat(self.selectedModelReleases);
    }
    if (propertyCheck) {
      if (self.canReminder) {
        return self.toastr.warning("Please click upload button to upload your release.", "Warning");
      }
      var listSelectedRelease = self.footage.documents.modelDocuments.concat(self.selectedPropertyReleases);
    }
    self.isJustUploadedRelease = false;
    this.saving = true;
    self.releaseService.attachReleaseForMediaProduct(listSelectedRelease, self.footage.mediaProductId)
      .then((result: any) => {
        if (!result) {
          return self.toastr.error("Error");
        } else {
          this.saving = false;
          self.toastr.success("Attached successfully!", "Success");

          if (modelCheck) {
            self.footage.documents.modelDocuments = self.selectedModelReleases;
            self.modelDocument.hide();
            var statusValid = self.checkValidDocumentInfo(self.selectedModelReleases);
            self.statusValidDocumentInfo = false;
            if (statusValid == false) {
              self.updateModelRelease.show();
            }
            self.statusValid = statusValid;
          }

          if (propertyCheck) {
            self.footage.documents.propertyDocuments = self.selectedPropertyReleases;
            self.propertyDocument.hide();
          }
        }
      })
    console.log(listSelectedRelease);
  }

  checkValidDocumentInfo(documents: any){
    // console.log(documents);
    var status = true;
    documents.forEach(element => {
      if(element.valid == false){
        status = false;
      }
    });
    return status;
  }

  showNotifyNewReleaseModal(property: any){
    var self = this;
    self.tempProperty = {};
    self.canSaveLocal = false;
    self.canReminder = false;
    self.isJustUploadedRelease = false;
    var user: any = JSON.parse(localStorage.getItem(self.accountService.getUserId()));
    if (user && user.readNotifyMessage) {
      self.getDataProperty(property);
    } else {
      self.notifyNewRelease.show();
      self.tempProperty = property;
    }
  }

  getDataProperty(property: any){
    console.log(property);
    var self = this;
    self.notifyNewRelease.hide();
    self.newDocumentId = '';
    self.keywordsDocument = '';
    if(self.canSaveLocal){
      var userLocal: any = {};
      var currentUserLocal: any = JSON.parse(localStorage.getItem(self.accountService.getUserId()));
      if (currentUserLocal) {
        userLocal = currentUserLocal;
      }
      userLocal.readNotifyMessage = true;
      self.authenticateService.saveByUser(JSON.stringify(userLocal));
    }
    self.selectedPropertyReleases = [];
    self.currentFootageReleases = JSON.parse(JSON.stringify(property));
    self.loadDocuments(false, true);
    self.initializeDocumentUpload(self.footage.mediaProductId);
    self.propertyDocument.show();
  }

  filterModelDocuments() {
    var self = this;
    self.loadDocuments(true, false);
  }

  filterPropertyDocuments() {
    var self = this;
    self.loadDocuments(false, true);
  }

  updateDocumentInfo(model: any){
    var self = this;
    self.currentDocument = model;
    console.log(self.currentDocument);
    self.modelDocument.hide();
    self.statusErrorDocumentsInfo = false;
    self.changeModelDocument.show();
  }

  cancelDocumentInfo() {
    var self = this;
    self.changeModelDocument.hide();
    if (!self.statusValidDocumentInfo) {
      self.modelDocument.show();
    }
  }

  updateDocumentsInfo() {
    var self = this;
    self.statusValidDocumentInfo = true;
    self.updateModelRelease.hide();
    var document = _.find(self.selectedModelReleases, (item) => {
      if (item.valid == false) {
        return item;
      }
    })
    if (document) {
      self.updateDocumentInfo(document);
    }
  }

  saveDocumentInfo(document: any) {
    var self = this;
    self.checkDocumentInfo(document);
    if (self.documentsInfo.status == false) {
      self.statusErrorDocumentsInfo = true;
    } else {
      this.saving = true;
      self.uploadService.updateDocumentInfo(document)
        .then((result: any) => {
          console.log(result);
          if (result && result.status == 204) {
            this.saving = false;
            self.toastr.success('Edited release successfully!', 'Success');
            self.selectedModelReleases.forEach(item => {
              if(item.documentId == document.documentId){
                item.age = document.age;
                item.ethnicity = document.ethnicity;
                item.gender = document.gender;
                item.valid = true;
                item.selectedCheck = true;
              }
            });
            self.changeModelDocument.hide();
            if (!self.statusValidDocumentInfo) {
              self.modelDocument.show();
            } else {
              self.updateDocumentsInfo();
            }
            self.statusValid = self.checkValidDocumentInfo(self.selectedModelReleases);
          }
        }, (err) => {
          console.log(err);
        })
    }
  }

  checkDocumentInfo(document: any){
    var self = this;
    self.documentsInfo.age = false;
    self.documentsInfo.ethnicity = false;
    self.documentsInfo.gender = false;
    self.documentsInfo.all = false;
    if(document.age != null  && document.age != ""){
      self.documentsInfo.age = true;
    }
    if(document.ethnicity != null  && document.ethnicity != ""){
      self.documentsInfo.ethnicity = true;
    }
    if(document.gender != null  && document.gender != ""){
      self.documentsInfo.gender = true;
    }
    if (self.documentsInfo.age == true && self.documentsInfo.ethnicity == true && self.documentsInfo.gender == true){
      self.documentsInfo.status = true;
    }
  }

  checkSave(footage: any){
    var disable = true;
    if(footage.title == '' || footage.title == null){
      disable = false;
    }
    if(footage.description == '' || footage.description == null){
      disable = false;
    }
    if(footage.keywords == '' || footage.keywords == null){
      disable = false;
    }
    if(footage.category == '' || footage.category == null){
      disable = false;
    }
    return disable;
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
  saveMediaProduct(mediaProduct, next? : boolean) {
    var id = '#' + mediaProduct.mediaProductId;
    mApp.block(id, { overlayColor: "#000000", type: "loader", state: "success", message: "Saving..." });
    var keywordArray = mediaProduct.keywordsArray;
    keywordArray = _.pluck(keywordArray, 'value');
    keywordArray = keywordArray.toString();
    keywordArray.split(",").map(String);
    mediaProduct.keywords = keywordArray;
    mediaProduct.recordingDate = this.recordingDate;
    this.mediaProductService.updateMediaProduct(mediaProduct).then((result: any) => {
      result = result.json();
      if (result.success) {
        if(next){
          this.getNextMediaProduct();
        }
        else{
          this.getFootageCategories(mediaProduct);
        }
        mApp.unblock(id);
        this.toastr.success("Saved successfully!", "Success");
      }
    });
  }

  handleResponse(isSubmit, isSave?) {
    var self = this;
    self.uploadService.updateFootage(self.footage).then((result: any) =>{
      console.log(result);
      self.loading = false;

      if (result.status == 200) {
        var data = result.json();

        if (!data.success) {
          return self.toastr.error(data.message, 'Error');
        }

        if (data.warningMessage) {
          self.toastr.warning(data.warningMessage, 'Warning');
        }

        if (isSubmit) {
          this.toastr.success("The uploaded file(s) is available in \"SUBMITTED CONTENT\" for further processing.","Success");
        } else {
          this.toastr.success("Data has been successfully saved. The next step is to submit.","Success");
        }
        this.cancelEditFootage();
      }

      if (result && result.status == 204) {
        if (isSubmit) {
          this.toastr.success("The uploaded file(s) is available in \"SUBMITTED CONTENT\" for further processing.","Success");
        } else {
          this.toastr.success("Data has been successfully saved. The next step is to submit.","Success");
        }
        this.cancelEditFootage();
      }
    });
  }

  hideChildModal(): void {
    var self = this;
    self.changeModelDocument.hide();
    if (!self.statusValidDocumentInfo) {
      self.modelDocument.show();
    }
  }
  
  viewRelease(release){
    var self = this;
    var url = this.apiUrl.get_release.replace('{memberId}', this.accountService.getUserId()).replace('{documentId}', release.documentId);
    console.log(url)
    if ((release.modelAgreementLocation && release.modelAgreementLocation.indexOf('.pdf') > 0) || (release.propertyAgreementLocation && release.propertyAgreementLocation.indexOf('.pdf') > 0)) {
      return window.open(url);
    }
    self.dataImage = [url]
    self.viewReleaseModal.show();
  }

  showRejectedReasonOfRelease(release) {
    var self = this;
    var rejectedReason = "";
    if (release.rejectedReason) {
      var rejectedReasons = JSON.parse(release.rejectedReason);
      _.each(rejectedReasons, (item) => {
        rejectedReason += item.content + "<br>";
        rejectedReason += "<br>"
      });
      self.toastr.info(rejectedReason, 'Rejected reasons', { enableHtml: true  });
    }
  }

  deleteRelease(release: any, model: boolean, property: boolean) {
    var self = this;
    console.log(release);
    self.releaseService.deleteRelease(release)
      .then((result: any) => {
        console.log(result);
        if (result.status == 400) {
          return self.toastr.error("Error");
        } else {
          
          if (model) {
            self.footage.documents.modelDocuments = _.reject(self.footage.documents.modelDocuments, item =>{
              return item.documentId == release.documentId;
            });
            self.modelReleases = _.reject(self.modelReleases, item => {
              return item.documentId == release.documentId;
            });
            self.countModelReleases -= 1;
          }

          if (property) {
            self.footage.documents.propertyDocuments = _.reject(self.footage.documents.propertyDocuments, item => {
              return item.documentId == release.documentId;
            });
            self.propertyReleases = _.reject(self.propertyReleases, item => {
              return item.documentId == release.documentId;
            });
            self.countPropertyReleases -= 1;
          }

          self.toastr.success('Deleted successfully!', "Success");
        }
      })
  }

  closeReleaseModal(){
    var self = this;
    if(self.canReminder){
      return self.confirmRelease.show();
    } else {
      if(self.isJustUploadedRelease && (self.selectedModelReleases.length || self.selectedPropertyReleases.length)){
        return self.justUploadedRelease.show();
      }
    }
    self.propertyDocument.hide();
    self.modelDocument.hide();
    // if(){
      
    // }
  }

  yesJustUploadedRelease(){
    var self = this;
    self.justUploadedRelease.hide();
    self.propertyDocument.hide();
    self.modelDocument.hide();
  }

  closeConfirmRelease(){
    var self = this;
    self.confirmRelease.hide();
    self.canReminder = false;
    self.currentFootageReleases = [];
    self.isJustUploadedRelease = false;
    self.propertyDocument.hide();
    self.modelDocument.hide();
  }

  clearSearchModelDocuments(){
    this.keywordsDocument = '';
    this.filterModelDocuments();
    this.searchModelDocuments.nativeElement.focus();
  }
  
  clearSearchPropertyDocuments(){
    this.keywordsDocument = '';
    this.filterPropertyDocuments();
    this.searchPropertyDocuments.nativeElement.focus();
  }

  countReleases(memberId?) {
    var self = this;

    self.releaseService.countReleases(memberId).then((result: any) => {
      console.log(result)

      if (result) {
        self.countModelReleases = result.countModelReleases;
        self.countPropertyReleases = result.countPropertyReleases;
      }
      
    });
  }

  routerLegalForms(id: string){
    var modal = {
      id: id,
      check: false
    }
    this.sharedService.emitInfoModal(JSON.stringify(modal));
    this.router.navigate(['/legal-forms']);
  }
  changeRecordingDate(): void {

  }
  getThumbnail(): string {
    return this.thumbnailUrl + this.mediaProductId;
  }
  setCallToAction(): void {
    var callToAction = <HTMLImageElement>document.getElementById("callToAction");
    var self = this;
    var date = moment().format('MM-DD-YYYY-hh-mm-ss');
    callToAction.src = self.callToActionUrl + 'callToAction/' + self.mediaProductId + '/' + date;
  }
  setEndScreen(): void {
    var endScreen = <HTMLImageElement>document.getElementById("endScreen");
    var self = this;
    var date = moment().format('MM-DD-YYYY-hh-mm-ss');
    endScreen.src = self.endScreenUrl + 'endScreen/' + self.mediaProductId + '/' + date;
  }
  setThumbnail(): void{
    var customThumbnail = <HTMLImageElement>document.getElementById("customThumbnail");
    var self = this;
    // customThumbnail.src = '';
    // customThumbnail.setAttribute('src', '');
    var date = moment().format('MM-DD-YYYY-hh-mm-ss');
    customThumbnail.src = self.customThumbnailUrl + 'customThumbnail/' + self.mediaProductId + '/' + date;
    // setTimeout(function(){
    //   customThumbnail.src = self.customThumbnailUrl + 'customThumbnail/' + self.mediaProductId;
    // }, 2000);
    // self.customThumbnailUrl = self.customThumbnailUrl + 'customThumbnail/' + self.mediaProductId;
  }
  createThumbnail(): void {
    var self = this;
    var video: any = document.getElementById('videoControl');
    var currentTime = video.currentTime;
    console.log('currentTime', currentTime);
    this.footage.currentTime = currentTime;
    var info = {
      mediaProductId: this.footage.mediaProductId,
      currentTime: currentTime.toString()
    }
    mApp.block();
    this.mediaProductService.createThumbnailMediaProduct(info).then((result: any) => {
      result = result.json();
      if (result.success) {
        setTimeout(function(){
          self.setThumbnail();
          mApp.unblock();
        },2000);
      }
    });
  }
  importThumbnail(){
    this.titleImport = "Import Thumbnail";
    this.initializeImportThumbnail();
    this.modalImportThumbnail.show();
  }
  importCallToAction(){
    this.titleImport = "Import Call To Action Image";
    this.initializeImportCallToAction();
    this.modalImportCallToAction.show();
  }
  importEndScreen(){
    this.titleImport = "Import End Screen Image";
    this.initializeImportEndScreen();
    this.modalImportEndscreen.show();
  }
  initializeImportThumbnail() {
    var self = this;
    var url = self.apiUrl.import_thumbnail_media_product.replace('{memberId}', self.accountService.getUserId())
    .replace('{mediaProductId}', this.footage.mediaProductId);
    var $importThumbnail = $("#importThumbnail");
    $importThumbnail.fileinput($.extend(self.constants.defaultFileInputSettings, {
      uploadUrl: url,
      uploadAsync: true,
      showPreview: false,
      allowedFileExtensions: ["pdf", "jpeg", "jpg", "png"],
      ajaxSettings: {
        headers: {
          Token: self.accountService.getToken()
        }
      }
    }));
    $importThumbnail.fileinput('clear');
    var toastr = self.toastr;
    $importThumbnail.off('fileuploaded').on('fileuploaded', function (event, data, previewId, index) {
      self.canReminder = false;
      if (data.response.message) {
        toastr.error(data.response.message, 'Error');
      } else {
        self.modalImportThumbnail.hide();
        toastr.success('Import thumbnail for media product success.');
        self.setThumbnail();
      }
    })

    $importThumbnail.off('filebatchuploadcomplete').on('filebatchuploadcomplete', function (event, files, extra) {
      $importThumbnail.fileinput('clear');
    });
    $('#importThumbnail').off('fileloaded').on('fileloaded', (event, file, previewId, index, reader) => {
    });

    $('#importThumbnail').off('fileclear').on('fileclear', (event, file, previewId, index, reader) => {
    });

    $('#importThumbnail').off('fileremoved').on('fileremoved', function (event, id, index) {
    });
  }
  initializeImportCallToAction() {
    var self = this;
    var url = self.apiUrl.import_call_to_action_media_product.replace('{memberId}', self.accountService.getUserId())
    .replace('{mediaProductId}', this.footage.mediaProductId);
    var $importCallToAction = $("#importCallToAction");
    $importCallToAction.fileinput($.extend(self.constants.defaultFileInputSettings, {
      uploadUrl: url,
      uploadAsync: true,
      showPreview: false,
      allowedFileExtensions: ["pdf", "jpeg", "jpg", "png"],
      ajaxSettings: {
        headers: {
          Token: self.accountService.getToken()
        }
      }
    }));
    $importCallToAction.fileinput('clear');
    var toastr = self.toastr;

    $importCallToAction.off('fileuploaded').on('fileuploaded', function (event, data, previewId, index) {
      self.canReminder = false;
      if (data.response.message) {
        toastr.error(data.response.message, 'Error');
      } else {
        self.footage.callToAction = data.response.callToAction;
        self.modalImportCallToAction.hide();
        toastr.success('Import call to acction for media product success.');
        self.setCallToAction();
      }
    })

    $importCallToAction.off('filebatchuploadcomplete').on('filebatchuploadcomplete', function (event, files, extra) {
      $importCallToAction.fileinput('clear');
    });
    $('#importCallToAction').off('fileloaded').on('fileloaded', (event, file, previewId, index, reader) => {
    });

    $('#importCallToAction').off('fileclear').on('fileclear', (event, file, previewId, index, reader) => {
    });

    $('#importCallToAction').off('fileremoved').on('fileremoved', function (event, id, index) {
    });
  }
  initializeImportEndScreen() {
    var self = this;
    var url = self.apiUrl.import_end_screen_media_product.replace('{memberId}', self.accountService.getUserId())
    .replace('{mediaProductId}', this.footage.mediaProductId);
    var $importEndScreen = $("#importEndScreen");
    $importEndScreen.fileinput($.extend(self.constants.defaultFileInputSettings, {
      uploadUrl: url,
      uploadAsync: true,
      showPreview: false,
      allowedFileExtensions: ["pdf", "jpeg", "jpg", "png"],
      ajaxSettings: {
        headers: {
          Token: self.accountService.getToken()
        }
      }
    }));
    $importEndScreen.fileinput('clear');
    var toastr = self.toastr;
    $importEndScreen.off('fileuploaded').on('fileuploaded', function (event, data, previewId, index) {
      self.canReminder = false;
      if (data.response.message) {
        toastr.error(data.response.message, 'Error');
      } else {
        self.footage.endScreen = data.response.endScreen;
        self.modalImportEndscreen.hide();
        toastr.success('Import endscreen for media product success.');
        self.setEndScreen();
      }
    });
    $importEndScreen.off('filebatchuploadcomplete').on('filebatchuploadcomplete', function (event, files, extra) {
      $importEndScreen.fileinput('clear');
    });
    $('#importEndScreen').off('fileloaded').on('fileloaded', (event, file, previewId, index, reader) => {
    });

    $('#importEndScreen').off('fileclear').on('fileclear', (event, file, previewId, index, reader) => {
    });

    $('#importEndScreen').off('fileremoved').on('fileremoved', function (event, id, index) {
    });
  }
  deleteCallToAction(): void {
    var self = this;
    this.footage.callToAction = null;
    this.modalRemoveCallToAction.show();
    $('#modalRemoveCallToAction').on('click', '.btn-ok', (e) => {
      self.mediaProductService.removeCustomImage(self.footage, 'callToAction').then(function(result: any){
        result = result.json();
        if (result.success) {
          self.toastr.success("Delete call to action successfully!", "Success");
          self.setCallToAction();
          self.modalRemoveCallToAction.hide();
        }
      });
    });
  }
  deleteEndScreen(): void {
    var self = this;
    this.footage.endScreen = null;
    this.modalRemoveEndScreen.show();
    $('#modalRemoveEndScreen').on('click', '.btn-ok', (e) => {
      self.mediaProductService.removeCustomImage(self.footage, 'endScreen').then(function(result: any){
        result = result.json();
        if (result.success) {
          self.toastr.success("Delete end screen successfully!", "Success");
          self.setEndScreen();
          self.modalRemoveEndScreen.hide();
        }
      });
    });
  }
  closeModalImportThumbnail(): void {
    this.modalImportThumbnail.hide();
  }
  closeModalImportCallToAction(): void {
    this.modalImportCallToAction.hide();
  }
  closeModalImportEndScreen(): void {
    this.modalImportEndscreen.hide();
  }
  getNextMediaProduct(): void {
    var self = this;
    var currentMediaProductId = self.footage.mediaProductId;
    var nextMediaProductId = self.listFootageIds[self.currentItem];
    if(currentMediaProductId == nextMediaProductId){
      if(self.currentItem < self.listFootageIds.length-1){
        self.currentItem++;
      }
      else{
        self.currentItem = 0;
      }
      nextMediaProductId = self.listFootageIds[self.currentItem];
    }
    this.mediaProductService.getMediaProduct(nextMediaProductId).then(function(result){
      if(result.success && result.data){
        self.footage = result.data;
        if (self.footage.category == null) {
          self.footage.category = '';
        }
        if(self.footage.recordingDate){
          self.recordingDate = new Date(self.footage.recordingDate);
        }
        self.customThumbnailUrl = self.apiUrl.get_custom_image.replace('{memberId}', self.memberId);
        self.callToActionUrl = self.apiUrl.get_custom_image.replace('{memberId}', self.memberId);
        self.endScreenUrl = self.apiUrl.get_custom_image.replace('{memberId}', self.memberId);
        self.setThumbnail();
        self.setCallToAction();
        self.setEndScreen();
        self.setKeywordsForMediaProduct();
        self.initializeVideoModal();
        self.initializeDocumentUpload('');
        self.getScreenSize();
        self.hidePlayFootage = true;
        self.checkValidDesc(self.footage);
        self.checkKeywordsNumber(self.footage);
      }
    });
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
