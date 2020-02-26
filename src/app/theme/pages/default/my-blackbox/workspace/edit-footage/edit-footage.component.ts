import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core';
import { SharedService } from '../../../../../../services/shared-service';
import { Router } from '@angular/router';
import { ApiUrl } from 'src/app/utils/apiUrl';
import { Constants } from 'src/app/utils/constants';
import { CommonService } from 'src/app/services/common.service';
import { AccountService } from 'src/app/services/account.service';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from 'src/app/services/upload.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ProjectsService } from '../../../../../../services/projects.service';
import { ReleaseService } from 'src/app/services/release.service';
import { CameraService } from 'src/app/services/camera.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { Utils } from 'src/app/utils/utils';
import * as keywordData from '../../../../../../../assets/auto-complete/keywords.json';
import { CameraChangeComponent } from '../../../camera/camera-change/camera-change.component';
import * as _ from 'underscore';
import * as Plyr from 'plyr';

declare var $: any;
declare var moment: any;
declare var mApp: any;
@Component({
  selector: 'app-edit-footage',
  templateUrl: './edit-footage.component.html',
  styleUrls: ['./edit-footage.component.css']
})
export class EditFootageComponent implements OnInit {
  public footage: any;
  public maxDate: Date;
  public footageCheck: any = {};
  public masterData: any;
  public infoWorkspacePage: any;
  public is_editorial = false;
  public is_description = false;
  public is_keywords = false;
  public is_camera_info = false;
  public is_documents = false;
  public is_categories = false;
  public is_sharers = false;
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
  };
  public totalPercent: number = 0;
  public memberAttributeList: any = [];
  public memberAttribute: string = 'email';
  public keywordSearch = {
    text: ''
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
  scrWidth: any;
  setWidth: boolean = false;
  statusValid: boolean = false;
  public avatarUrlB: string = this.apiUrl.get_avatar.replace(
    '{defaultType}',
    'B'
  );
  newDocumentId: string = '';
  canSaveLocal: boolean = false;
  tempProperty: any = {};
  contentSubmitConfirm: string = '';
  canReminder: boolean = false;
  isJustUploadedRelease: boolean = false;
  public loading: boolean = false;
  thumbnailUrl: string;
  hidePlayFootage: boolean;
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
  confirmationDesc: string;
  cameras: any = [];
  isUseApplyToBatchOption: boolean;
  public currentItem: number = 0;
  public listFootageIds: any = [];
  public isNext: boolean = false;
  public listKeywords: any = [];
  public dataKeywords: any = [];
  srcUrl = '';

  @ViewChild('changeModelDocument') public changeModelDocument: ModalDirective;
  @ViewChild('changeCameraModal') changeCameraModal: CameraChangeComponent;
  @ViewChild('confirmRelease') confirmRelease: ModalDirective;
  @ViewChild('justUploadedRelease') justUploadedRelease: ModalDirective;
  @ViewChild('updateModelRelease') updateModelRelease: ModalDirective;
  @ViewChild('sharersModal') sharersModal: ModalDirective;
  @ViewChild('notifyNewRelease') public notifyNewRelease: ModalDirective;
  @ViewChild('propertyDocument') public propertyDocument: ModalDirective;
  @ViewChild('modelDocument') public modelDocument: ModalDirective;
  @ViewChild('resubmitFootageModal')
  public resubmitFootageModal: ModalDirective;
  @ViewChild('confirmModal') confirmModal: ModalDirective;
  @ViewChild('viewReleaseModal') viewReleaseModal: ModalDirective;
  @ViewChild('searchModelDocuments') searchModelDocuments: ElementRef;
  @ViewChild('searchPropertyDocuments') searchPropertyDocuments: ElementRef;
  @ViewChild('searchSharers') searchSharers: ElementRef;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.scrWidth = window.innerWidth;
    if (this.scrWidth < 768) {
      this.setWidth = true;
    } else {
      this.setWidth = false;
    }
  }
  constructor(
    private sharedService: SharedService,
    private router: Router,
    private apiUrl: ApiUrl,
    private constants: Constants,
    private commonService: CommonService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private uploadService: UploadService,
    private projectsService: ProjectsService,
    private cameraServie: CameraService,
    private releaseService: ReleaseService,
    private authenticateService: AuthenticateService,
    private utils: Utils
  ) {
    this.maxDate = new Date();
    this.maxItem = this.constants.maxKeyword;
    this.masterData = {
      countries: commonService.getCountries(),
      modelEthnicities: commonService.getModelEthnicities(),
      modelAges: commonService.getModelAges(),
      modelGenders: commonService.getModelGenders(),
      footageCategories: commonService.getFootageCategories()
    };
    this.memberAttributeList = commonService.getMemberSearchAttributes();
  }
  async ngOnInit() {
    var self = this;
    self.sharedService.listFootageIds$.subscribe(footageIds => {
      self.listFootageIds = footageIds;
    });
    self.sharedService.footage$.subscribe(footage => {
      self.footage = footage;
      self.loadCameras();
    });
    self.sharedService.infoWorkspacePage$.subscribe(info => {
      self.infoWorkspacePage = info;
    });
    // self.sharedService.position$.subscribe(position => {
    //   self.position = position;
    // });
    if (self.footage == '') {
      return self.router.navigate(['my-blackbox/workspace']);
    } else {
      if (self.footage.description) {
        self.footage.descriptionCharacters = self.footage.description.replace(
          /\s/g,
          ''
        );
      }
      if (self.footage.category == null) {
        self.footage.category = '';
      }
      if (!self.footage.editorial) {
        self.footage.editorialCity = '';
        self.footage.editorialCountry = '';
        self.footage.editorialState = '';
        self.footage.editorialText = '';
      }
      self.footage.sharers.forEach(item => {
        item.collabShareOld = item.collabShare;
      });
      self.statusValid = self.checkValidDocumentInfo(
        self.footage.documents.modelDocuments
      );
      await self.initializeDocumentUpload('');
      self.getScreenSize();
      self.hidePlayFootage = true;
      var memberId = localStorage.getItem('userid');
      self.thumbnailUrl = self.apiUrl.thumbnail.replace('{memberId}', memberId);
      self.checkValidDesc(self.footage);
      self.checkKeywordsNumber(self.footage);
      await self.sharedService.infoModal$.subscribe(modalName => {
        if (modalName != '') {
          var modal = JSON.parse(modalName);
          console.log(modal);
          if (modal.id == 'modelDocument' && modal.check) {
            self.getDataModel(self.footage.documents.modelDocuments);
          }
          if (modal.id == 'propertyDocument' && modal.check) {
            self.showNotifyNewReleaseModal(
              self.footage.documents.propertyDocuments
            );
          }
        }
      });
      console.log(self.footage);
    }
    var keywords: any = keywordData;
    this.dataKeywords = keywords.default;
  }

  loadCameras() {
    this.cameraServie
      .getMemberCameras(this.footage.memberId)
      .then((result: any) => {
        this.cameras = result.data;
      });
  }

  openChangeCameraModal() {
    this.changeCameraModal.show();
  }

  recieveCurrentCamera($event) {
    console.log('recieveCurrentCamera', $event);
    this.footage.Camera = $event;
  }

  previewFootage(footage: any) {
    const self = this;
    var footageId = footage.footageId;
    var memberId = localStorage.getItem('userid');
    var url = self.apiUrl.get_footage_video
      .replace('{footageId}', footageId)
      .replace('{memberId}', memberId);

    self.srcUrl = url;
    console.log('previewFootage', self.srcUrl)
    const player = new Plyr('#videoControlEdit', self.constants.videoControlsOptions);
    player.restart();
    player.play();
    this.hidePlayFootage = false;
  }

  checkValidEditorial() {
    var self = this;
    self.footage.editorialDate = new Date();
    if (!self.footage.editorial) {
      self.footage.editorialCity = '';
      self.footage.editorialCountry = '';
      self.footage.editorialState = '';
      self.footage.editorialText = '';
      // self.form.editForm.city.$invalid = false;
      // self.form.editForm.country.$invalid = false;
      // self.form.editForm.date.$invalid = false;
    }
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

  valueKeywords(): string {
    var self = this;
    var keywords = self.footage.keywordsArray;
    if (keywords) {
      if (keywords.length > 0) {
        keywords = _.pluck(keywords, 'value');
        keywords = keywords.toString();
        keywords = keywords.split(',').map(String);
        return keywords;
      }
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

  clearKeywords(footage: any) {
    footage.keywordsArray = [];
    footage.keywords = '';
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

  cancelEditFootage() {
    var self = this;
    self.infoWorkspacePage.removeData = true;
    self.sharedService.emitInfoWorkspacePage(self.infoWorkspacePage);
    self.router.navigate(['my-blackbox/workspace']);
  }

  getDataModel(models: any) {
    var self = this;
    self.canReminder = false;
    self.keywordsDocument = '';
    self.newDocumentId = '';
    self.selectedModelReleases = [];
    self.isJustUploadedRelease = false;
    self.currentFootageReleases = JSON.parse(JSON.stringify(models));
    self.statusValidDocumentInfo = false;
    self.loadDocuments(true, false, self.footage.footageId);
    self.initializeDocumentUpload(self.footage.footageId);
    self.modelDocument.show();
  }

  initializeDocumentUpload(footageId: any) {
    var self = this;
    var url = self.apiUrl.upload_footage_document.replace(
      '{memberId}',
      self.accountService.getUserId()
    );
    if (
      self.footage.projectId &&
      self.footage.memberId !== self.accountService.getUserId()
    ) {
      url += '?ownerId=' + self.footage.memberId;
    }
    var $fModel = $('#fModel');
    // if ($fModel.fileinput) {
    //   $fModel.fileinput('destroy');
    // }
    $fModel.fileinput(
      $.extend(self.constants.defaultFileInputSettings, {
        uploadUrl: url.replace('{documentType}', 'M'),
        uploadAsync: true,
        showPreview: false,
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
        showPreview: false,
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
          self.isJustUploadedRelease = true;
          console.log(data.response);
          self.newDocumentId = data.response.documentId;
          self.loadDocuments(true, false, footageId, true);
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
          self.isJustUploadedRelease = true;
          self.newDocumentId = data.response.documentId;
          self.loadDocuments(false, true, footageId, true);
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

  loadDocuments(modelCheck, propertyCheck, footageId, getFootage?) {
    var self = this;
    var memberId = localStorage.getItem('userid');
    var keyword = self.keywordsDocument;
    if (modelCheck == true) {
      self.uploadService
        .getDocuments(
          memberId,
          true,
          false,
          keyword,
          footageId,
          false,
          self.footage.memberId
        )
        .then((result: any) => {
          if (!result) {
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
              self.modelReleases = _.map(self.modelReleases, item => {
                if (item.documentId == self.newDocumentId) {
                  item.selectedCheck = true;
                  selectedList.push(item);
                }
                return item;
              });
              self.newDocumentId = '';
            }

            _.each(selectedList, item => {
              var checkExistSelectedRelease = _.some(
                self.selectedModelReleases,
                i => {
                  return item.documentId == i.documentId;
                }
              );
              if (!checkExistSelectedRelease) {
                self.selectedModelReleases.push(item);
              }
            });

            _.each(self.selectedModelReleases, item => {
              self.modelReleases = _.map(self.modelReleases, modelRelease => {
                if (modelRelease.documentId == item.documentId) {
                  modelRelease.selectedCheck = true;
                }
                return modelRelease;
              });
            });

            self.isAttachedAll = _.every(self.modelReleases, item => {
              return item.selectedCheck == true;
            });
          }
        });
    }

    if (propertyCheck == true) {
      self.uploadService
        .getDocuments(
          memberId,
          false,
          true,
          keyword,
          footageId,
          false,
          self.footage.memberId
        )
        .then((result: any) => {
          if (!result) {
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
              self.propertyReleases = _.map(self.propertyReleases, item => {
                if (item.documentId == self.newDocumentId) {
                  item.selectedCheck = true;
                  selectedList.push(item);
                }
                return item;
              });
              self.newDocumentId = '';
            }

            _.each(selectedList, item => {
              var checkExistSelectedRelease = _.some(
                self.selectedPropertyReleases,
                i => {
                  return item.documentId == i.documentId;
                }
              );
              if (!checkExistSelectedRelease) {
                self.selectedPropertyReleases.push(item);
              }
            });

            _.each(self.selectedPropertyReleases, item => {
              self.propertyReleases = _.map(
                self.propertyReleases,
                propertyRelease => {
                  if (propertyRelease.documentId == item.documentId) {
                    propertyRelease.selectedCheck = true;
                  }
                  return propertyRelease;
                }
              );
            });

            self.isAttachedAll = _.every(self.propertyReleases, item => {
              return item.selectedCheck == true;
            });
          }
        });
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
    self.isAttachedAll = _.every(self.modelReleases, item => {
      return item.selectedCheck == true;
    });
  }

  removeModelRelease = release => {
    var self = this;
    self.deattachReleaseForFootage(release, true, false).then(() => {
      release.selectedCheck = false;
      self.selectedModelReleases = _.reject(
        self.selectedModelReleases,
        item => {
          return item.documentId == release.documentId;
        }
      );
      self.currentFootageReleases = _.reject(
        self.currentFootageReleases,
        item => {
          return item.documentId == release.documentId;
        }
      );
      self.modelReleases = _.map(self.modelReleases, item => {
        if (item.documentId == release.documentId) {
          item.selectedCheck = false;
        }
        return item;
      });
      self.isAttachedAll = _.every(self.modelReleases, item => {
        return item.selectedCheck == true;
      });
    });
  };

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
    self.isAttachedAll = _.every(self.propertyReleases, item => {
      return item.selectedCheck == true;
    });
  }

  removePropertyRelease = release => {
    var self = this;
    self.deattachReleaseForFootage(release, false, true).then(() => {
      release.selectedCheck = false;
      self.selectedPropertyReleases = _.reject(
        self.selectedPropertyReleases,
        item => {
          return item.documentId == release.documentId;
        }
      );
      self.currentFootageReleases = _.reject(
        self.currentFootageReleases,
        item => {
          return item.documentId == release.documentId;
        }
      );
      self.propertyReleases = _.map(self.propertyReleases, item => {
        if (item.documentId == release.documentId) {
          item.selectedCheck = false;
        }
        return item;
      });
      self.isAttachedAll = _.every(self.propertyReleases, item => {
        return item.selectedCheck == true;
      });
    });
  };

  deattachReleaseForFootage = (release, modelCheck, propertyCheck) => {
    return new Promise((resolve, reject) => {
      this.releaseService
        .deattachReleaseForFootage(this.footage.footageId, release.documentId)
        .then((result: any) => {
          if (result) {
            if (modelCheck) {
              this.modelReleases = _.map(this.modelReleases, item => {
                if (item.documentId == release.documentId) {
                  item.canDelete = result.canDelete;
                }

                return item;
              });
            }

            if (propertyCheck) {
              this.propertyReleases = _.map(this.propertyReleases, item => {
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
  };

  saveDocumentFootage(modelCheck: boolean, propertyCheck: boolean) {
    var self = this;
    if (modelCheck) {
      if (self.canReminder) {
        return self.toastr.warning(
          'Please click upload button to upload your release.',
          'Warning'
        );
      }
      var listSelectedRelease = self.footage.documents.propertyDocuments.concat(
        self.selectedModelReleases
      );
    }
    if (propertyCheck) {
      if (self.canReminder) {
        return self.toastr.warning(
          'Please click upload button to upload your release.',
          'Warning'
        );
      }
      var listSelectedRelease = self.footage.documents.modelDocuments.concat(
        self.selectedPropertyReleases
      );
    }
    self.isJustUploadedRelease = false;
    this.saving = true;
    self.releaseService
      .attachReleaseForFootage(listSelectedRelease, self.footage.footageId)
      .then((result: any) => {
        if (!result) {
          return self.toastr.error('Error');
        } else {
          this.saving = false;
          self.toastr.success('Attached successfully!', 'Success');

          if (modelCheck) {
            self.footage.documents.modelDocuments = self.selectedModelReleases;
            self.modelDocument.hide();
            var statusValid = self.checkValidDocumentInfo(
              self.selectedModelReleases
            );
            self.statusValidDocumentInfo = false;
            if (statusValid == false) {
              self.updateModelRelease.show();
            }
            self.statusValid = statusValid;
          }

          if (propertyCheck) {
            self.footage.documents.propertyDocuments =
              self.selectedPropertyReleases;
            self.propertyDocument.hide();
          }
        }
      });
    console.log(listSelectedRelease);
  }

  checkValidDocumentInfo(documents: any) {
    console.log(documents);
    var status = true;
    documents.forEach(element => {
      if (element.valid == false) {
        status = false;
      }
    });
    return status;
  }

  showNotifyNewReleaseModal(property: any) {
    var self = this;
    self.tempProperty = {};
    self.canSaveLocal = false;
    self.canReminder = false;
    self.isJustUploadedRelease = false;
    var user: any = JSON.parse(
      localStorage.getItem(self.accountService.getUserId())
    );
    if (user && user.readNotifyMessage) {
      self.getDataProperty(property);
    } else {
      self.notifyNewRelease.show();
      self.tempProperty = property;
    }
  }

  getDataProperty(property: any) {
    console.log(property);
    var self = this;
    self.notifyNewRelease.hide();
    self.newDocumentId = '';
    self.keywordsDocument = '';
    if (self.canSaveLocal) {
      var userLocal: any = {};
      var currentUserLocal: any = JSON.parse(
        localStorage.getItem(self.accountService.getUserId())
      );
      if (currentUserLocal) {
        userLocal = currentUserLocal;
      }
      userLocal.readNotifyMessage = true;
      self.authenticateService.saveByUser(JSON.stringify(userLocal));
    }
    self.selectedPropertyReleases = [];
    self.currentFootageReleases = JSON.parse(JSON.stringify(property));
    self.loadDocuments(false, true, self.footage.footageId);
    self.initializeDocumentUpload(self.footage.footageId);
    self.propertyDocument.show();
  }

  filterModelDocuments() {
    var self = this;
    self.loadDocuments(true, false, self.footage.footageId);
  }

  filterPropertyDocuments() {
    var self = this;
    self.loadDocuments(false, true, self.footage.footageId);
  }

  updateDocumentInfo(model: any) {
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
    var document = _.find(self.selectedModelReleases, item => {
      if (item.valid == false) {
        return item;
      }
    });
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
      self.uploadService.updateDocumentInfo(document).then(
        (result: any) => {
          console.log(result);
          if (result && result.status == 204) {
            this.saving = false;
            self.toastr.success('Edited release successfully!', 'Success');
            self.selectedModelReleases.forEach(item => {
              if (item.documentId == document.documentId) {
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
            self.statusValid = self.checkValidDocumentInfo(
              self.selectedModelReleases
            );
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

  canChangeSharer() {
    var self = this;
    if (self.footage.projectId || !self.footage.sharers) {
      return false;
    }
    return true;
  }

  getDataSharing(sharers: any) {
    var self = this;
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
            console.log(result);
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
            if (self.footage.curators.length > 0) {
              self.currentCurators = JSON.parse(
                JSON.stringify(self.footage.curators)
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
            self.currentSharers = currentSharers;
            self.sharers = newSharers;
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  canAssignSharer(footage: any) {
    if (footage.projectId || footage.sharers.length) {
      return false;
    }
    return true;
  }

  checkNegativeValue(item: any) {
    var self = this;
    item.change = true;
    item.loading = false;
    if (item.collabShare == item.collabShareOld) {
      item.change = false;
    }
    if (item.collabShare < 1 || item.collabShare > 99 || !item.collabShare) {
      self.toastr.warning(
        'The percentage for each sharer must be at least 1% and no more than 99%.',
        'Warning'
      );
    }
  }

  cancelCollabShare(item: any) {
    item.change = false;
    item.collabShare = item.collabShareOld;
  }

  saveCollabShare(item: any) {
    var total = 0;
    var temp = [];
    this.footage.curators.forEach(member => {
      total += member.collabShare;
    });
    this.footage.sharers.forEach(member => {
      if (item.id == member.id) {
        temp.push(member);
        return (total += member.collabShare);
      }
      total += member.collabShareOld;
      let m = this.utils.clone(member);
      m.collabShare = m.collabShareOld;
      temp.push(m);
    });
    if (total < 1 || total > 99) {
      return this.toastr.error(
        'The total percentage must be at least 1% and no more than 99%.',
        'Error'
      );
    }
    var info = {
      footageId: this.footage.footageId,
      sharers: temp
    };
    item.loading = true;
    this.uploadService.changeSharer(info).then((result: any) => {
      this.savingSharers = false;
      var result = result.json();
      if (result.success) {
        item.loading = false;
        this.footage.sharers.forEach(member => {
          if (member.id == item.id) {
            member.collabShareOld = member.collabShare;
            member.change = false;
            member.loading = false;
          }
        });
        this.toastr.success('Saved successfully!', 'Success');
      }
    });
  }

  checkSave(footage: any) {
    if (
      footage.category == '' &&
      footage.description == '' &&
      footage.keywords == ''
    ) {
      return true;
    }
    return false;
  }

  editFootageSubmit(type: string, next?: boolean) {
    var self = this;
    self.isNext = next;
    var totalPercent = 0;
    var invalidDesc = self.checkValidDesc(self.footage, true);
    var keywordsNumber = self.checkKeywordsNumber(self.footage);
    self.canSaveLocal = false;
    self.contentSubmitConfirm = '';
    if ((!invalidDesc || !keywordsNumber) && type != 'save') {
      console.log(invalidDesc, keywordsNumber);
      return false;
    }

    self.footage.sharers.forEach(element => {
      totalPercent += element.collabShare;
    });
    self.footage.curators.forEach(element => {
      totalPercent += element.collabShare;
    });
    if ((totalPercent > 99 || totalPercent < 1) && !(totalPercent == 0)) {
      return self.toastr.error(
        'The total percentage must be at least 1% and no more than 99%.',
        'Error'
      );
    }

    console.log(self.footageCheck);
    self.isUseApplyToBatchOption = false;
    for (const i in self.footageCheck) {
      if (self.footageCheck[i]) {
        self.isUseApplyToBatchOption = true;
        break;
      }
    }
    console.log(self.isUseApplyToBatchOption);
    if (self.footage.batchName && self.isUseApplyToBatchOption) {
      self.confirmationDesc = `Other clips in the batch '${self.footage.batchName}' will have the same data as the selected apply-to-batch field(s), do you want to proceed?`;
      $('#confirmationModal').modal('show');
      $('#confirmationModal')
        .off('click', '.btn-success')
        .on('click', '.btn-success', () => {
          $('#confirmationModal').modal('hide');
          let statusValid = self.checkValidDocumentInfo(
            self.footage.documents.modelDocuments
          );
          if (type === 'submit' && statusValid) {
            if (self.footage.maxTimes) {
              return;
            }
            const user: any = JSON.parse(
              localStorage.getItem(self.accountService.getUserId())
            );

            if (self.footage.reviewStatus === 'rejected') {
              return self.resubmitFootageModal.show();
            }

            if (user && user.notShowSubmitConfirm) {
              self.saveOrSubmitFootage(false, true, next);
            } else {
              $('#submit-footages-confirm-modal').modal({
                backdrop: 'static',
                keyboard: false
              });
              $('#submit-footages-confirm-modal').modal('show');
            }
          }
          if (type === 'save') {
            self.footage.submission = false;
            self.saveOrSubmitFootage(true, false, next);
          }
        });
    } else {
      let statusValid = self.checkValidDocumentInfo(
        self.footage.documents.modelDocuments
      );
      if (type === 'submit' && statusValid) {
        if (self.footage.maxTimes) {
          return;
        }
        const user: any = JSON.parse(
          localStorage.getItem(self.accountService.getUserId())
        );

        if (self.footage.reviewStatus === 'rejected') {
          return self.resubmitFootageModal.show();
        }

        if (user && user.notShowSubmitConfirm) {
          self.saveOrSubmitFootage(false, true, next);
        } else {
          $('#submit-footages-confirm-modal').modal({
            backdrop: 'static',
            keyboard: false
          });
          $('#submit-footages-confirm-modal').modal('show');
        }
      }
      if (type === 'save') {
        self.footage.submission = false;
        self.saveOrSubmitFootage(true, false, next);
      }
    }
  }

  saveOrSubmitFootage(isSave: boolean, isSubmit: boolean, next?: boolean) {
    $('#submit-footages-confirm-modal').modal('hide');
    var self = this;
    var check = false;
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
    if (isSubmit) {
      self.footage.submission = true;
      self.footage.approvalStatus = 'pending';
    }
    if (self.footage.curators.length) {
      self.footage.sharers.concat(self.footage.curators);
    }

    var keywordArray = self.footage.keywordsArray;
    keywordArray = _.pluck(keywordArray, 'value');
    self.footage.keywords = keywordArray.join(',');
    // if(isSave){
    //   var checkSave = self.checkSave(self.footage);
    //   if(checkSave){
    //     return;
    //   }
    // }
    self.footage.keyword_list = keywordArray;
    self.footage.modelDocuments = self.footage.documents.modelDocuments;
    self.footage.propertyDocuments = self.footage.documents.propertyDocuments;
    self.footage.cameraId = self.footage.Camera?.cameraId;

    if (self.footage.batchId != null) {
      var batchId = self.footage.batchId;
      var footage = {
        memberId: self.footage.memberId,
        curationStatus: self.footage.curationStatus,
        projectId: self.footage.projectId,
        footageId: self.footage.footageId
      };
      var footagesInfo: any = {};
      console.log(self.footageCheck);
      for (var i in self.footageCheck) {
        if (self.footageCheck[i]) {
          if (i == 'editorial') {
            footagesInfo[i] = self.footage[i];
            footagesInfo.editorialText = self.footage.editorialText;
            footagesInfo.editorialCity = self.footage.editorialCity;
            footagesInfo.editorialState = self.footage.editorialState;
            footagesInfo.editorialCountry = self.footage.editorialCountry;
            footagesInfo.editorialDate = moment(
              self.footage.editorialDate
            ).format('YYYY-MM-DD');
          } else if (i == 'sharers') {
            footagesInfo.sharers = self.footage.sharers;
            footagesInfo.sharersCheck = true;
          } else if (i == 'documents') {
            footagesInfo.documentsCheck = true;
            var documents = [];
            footagesInfo.modelDocuments = self.footage.documents.modelDocuments;
            footagesInfo.propertyDocuments =
              self.footage.documents.propertyDocuments;
          } else if (i === 'cameraInfo') {
            footagesInfo.cameraId = self.footage.Camera?.cameraId;
          } else {
            footagesInfo[i] = self.footage[i];
          }
          check = true;
        }
      }
    }

    self.footage.modelDocuments = self.footage.documents.modelDocuments;
    self.footage.propertyDocuments = self.footage.documents.propertyDocuments;
    if (check) {
      self.loading = true;
      return self.uploadService
        .uploadBatchFootages(batchId, footagesInfo, footage)
        .then((result: any) => {
          self.loading = false;
          console.log(result);
          if (result && result.status == 200) {
            result = result.json();
            self.isIgnoreFootage = result.data.isIgnoreFootage;
            if (result.message) {
              self.responseMessage = result.message;
              self.showConfirmApplyToBatchModal(
                batchId,
                footagesInfo,
                footage,
                isSubmit
              );
              return;
            }
          }

          if (result && result.status == 204) {
            return self.handleResponse(isSubmit, isSave, next);
          }
        });
    }
    self.loading = true;
    return self.handleResponse(isSubmit, isSave, next);
  }

  handleResponse(isSubmit, isSave?, next?: boolean) {
    var self = this;
    self.uploadService.updateFootage(self.footage).then((result: any) => {
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
          this.toastr.success(
            'The uploaded file(s) is available in "SUBMITTED CONTENT" for further processing.',
            'Success'
          );
        } else {
          this.toastr.success(
            'Data has been successfully saved. The next step is to submit.',
            'Success'
          );
        }
        if (next || self.isNext) {
          if (isSubmit) {
            self.listFootageIds = self.listFootageIds.filter(footageId => {
              if (footageId != self.footage.footageId) {
                return footageId;
              }
            });
          }
          self.getFootage();
        }
        // else{
        //   this.cancelEditFootage();
        // }
      }

      if (result && result.status == 204) {
        if (isSubmit) {
          this.toastr.success(
            'The uploaded file(s) is available in "SUBMITTED CONTENT" for further processing.',
            'Success'
          );
        } else {
          this.toastr.success(
            'Data has been successfully saved. The next step is to submit.',
            'Success'
          );
        }
        if (next || self.isNext) {
          if (isSubmit) {
            self.listFootageIds = self.listFootageIds.filter(footageId => {
              if (footageId != self.footage.footageId) {
                return footageId;
              }
            });
          }
          self.getFootage();
        }
        // else{
        //   this.cancelEditFootage();
        // }
      }
    });
  }

  showConfirmApplyToBatchModal(batchId, footagesInfo, footage, isSubmit) {
    this.confirmModal.show();
    $('#confirmModal')
      .off('click', '.btn-success')
      .on('click', '.btn-success', () => {
        this.confirmModal.hide();
        this.loading = true;
        this.uploadService
          .uploadBatchFootages(batchId, footagesInfo, footage, true)
          .then((result: any) => {
            this.loading = false;
            if (result && result.status == 204) {
              this.handleResponse(isSubmit);
            }
          });
      });

    $('#confirmModal')
      .off('click', '.btn-danger')
      .on('click', '.btn-danger', () => {
        this.confirmModal.hide();
        this.loading = true;
        this.uploadService
          .uploadBatchFootages(batchId, footagesInfo, footage, false)
          .then((result: any) => {
            this.loading = false;
            if (result && result.status == 204) {
              if (!this.isIgnoreFootage) {
                this.handleResponse(isSubmit);
              } else {
                this.cancelEditFootage();
              }
            }
          });
      });
  }

  keepSharers(sharers, selectedSharers, total, count, pageSize) {
    var self = this;
    var originalLength = sharers.length;
    if (selectedSharers && selectedSharers.length) {
      _.each(self.selectedSharer, function(sharer) {
        sharers = _.reject(sharers, function(item) {
          return sharer.id == item.id && sharer.collabType == item.collabShare;
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

  removedCurrentSharer(sharer: any) {
    var self = this;
    var listSharer = self.sharers;
    listSharer.push(sharer);
    self.currentSharers = _.reject(self.currentSharers, item => {
      return item.id == sharer.id && sharer.collabType == item.collabType;
    });
  }

  addCurrentSharer(sharer: any) {
    var self = this;
    var currentSharers = self.currentSharers;
    currentSharers.push(sharer);
    self.sharers = _.reject(self.sharers, item => {
      return item.id == sharer.id && item.collabType == sharer.collabType;
    });
  }

  pageSharerChanged(currentPage: any) {
    if (this.pagingSharer.currentPage === currentPage.page) {
      return;
    }
    this.pagingSharer.currentPage = currentPage.page;
    this.loadSharers();
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
        null,
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

  saveChangesSharing() {
    var self = this;

    self.sharersModal.hide();
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
        footageId: self.footage.footageId,
        sharers: self.currentSharers
      };
      self.savingSharers = true;
      self.uploadService.changeSharer(info).then((result: any) => {
        self.savingSharers = false;
        var result = result.json();
        self.footage.sharers = self.currentSharers;
        if (result.success) {
          self.toastr.success('Saved successfully!', 'Success');
          self.sharersModal.hide();
        }
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

  hideChildModal(): void {
    var self = this;
    self.changeModelDocument.hide();
    if (!self.statusValidDocumentInfo) {
      self.modelDocument.show();
    }
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

  deleteRelease(release: any, model: boolean, property: boolean) {
    var self = this;
    console.log(release);
    self.releaseService.deleteRelease(release).then((result: any) => {
      console.log(result);
      if (result.status == 400) {
        return self.toastr.error('Error');
      } else {
        if (model) {
          self.footage.documents.modelDocuments = _.reject(
            self.footage.documents.modelDocuments,
            item => {
              return item.documentId == release.documentId;
            }
          );
          self.modelReleases = _.reject(self.modelReleases, item => {
            return item.documentId == release.documentId;
          });
          self.countModelReleases -= 1;
        }

        if (property) {
          self.footage.documents.propertyDocuments = _.reject(
            self.footage.documents.propertyDocuments,
            item => {
              return item.documentId == release.documentId;
            }
          );
          self.propertyReleases = _.reject(self.propertyReleases, item => {
            return item.documentId == release.documentId;
          });
          self.countPropertyReleases -= 1;
        }

        self.toastr.success('Deleted successfully!', 'Success');
      }
    });
  }

  closeReleaseModal() {
    var self = this;
    if (self.canReminder) {
      return self.confirmRelease.show();
    } else {
      if (
        self.isJustUploadedRelease &&
        (self.selectedModelReleases.length ||
          self.selectedPropertyReleases.length)
      ) {
        return self.justUploadedRelease.show();
      }
    }
    self.propertyDocument.hide();
    self.modelDocument.hide();
    // if(){

    // }
  }

  yesJustUploadedRelease() {
    var self = this;
    self.justUploadedRelease.hide();
    self.propertyDocument.hide();
    self.modelDocument.hide();
  }

  closeConfirmRelease() {
    var self = this;
    self.confirmRelease.hide();
    self.canReminder = false;
    self.currentFootageReleases = [];
    self.isJustUploadedRelease = false;
    self.propertyDocument.hide();
    self.modelDocument.hide();
  }

  clearSearchModelDocuments() {
    this.keywordsDocument = '';
    this.filterModelDocuments();
    this.searchModelDocuments.nativeElement.focus();
  }

  clearSearchPropertyDocuments() {
    this.keywordsDocument = '';
    this.filterPropertyDocuments();
    this.searchPropertyDocuments.nativeElement.focus();
  }

  clearSearchSharers() {
    this.keywordSearch.text = '';
    this.filterSharers('');
    this.searchSharers.nativeElement.focus();
  }

  countReleases(memberId?) {
    var self = this;

    self.releaseService.countReleases(memberId).then((result: any) => {
      console.log(result);

      if (result) {
        self.countModelReleases = result.countModelReleases;
        self.countPropertyReleases = result.countPropertyReleases;
      }
    });
  }

  routerLegalForms(id: string) {
    var modal = {
      id: id,
      check: false
    };
    this.sharedService.emitInfoModal(JSON.stringify(modal));
    this.router.navigate(['/legal-forms']);
  }
  getFootage(): void {
    var self = this;
    var currentFootageId = self.footage.footageId;
    var nextFootageId = self.listFootageIds[self.currentItem];
    if (currentFootageId == nextFootageId) {
      if (self.currentItem < self.listFootageIds.length - 1) {
        self.currentItem++;
      } else {
        self.currentItem = 0;
      }
      nextFootageId = self.listFootageIds[self.currentItem];
    }
    if (nextFootageId) {
      self.uploadService.getFootage(nextFootageId).then(function(result: any) {
        if (result.success) {
          self.clearKeywords(self.footage);
          self.footage = result.data;
          if (self.footage.category == null) {
            self.footage.category = '';
          }
          if (self.footage.description == null) {
            self.footage.description = '';
          }
          if (self.footage.description) {
            self.footage.descriptionCharacters = self.footage.description.replace(
              /\s/g,
              ''
            );
          }
          if (self.footage.keywords == null || self.footage.keywords == '') {
            self.footage.keywordsArray = [];
          } else {
            var keywordsArray = self.footage.keywords;
            keywordsArray = keywordsArray.split(',').map(String);
            var keywords = self.footage.keywords;
            keywords = keywords.split(',').join(', ');
            self.footage.keywords = keywords;
            keywordsArray = _.map(keywordsArray, item => {
              var obj: any = {};
              obj.value = item;
              obj.display = item;
              return obj;
            });
            self.footage.keywordsArray = keywordsArray;
          }
          if (!self.footage.editorial) {
            self.footage.editorialCity = '';
            self.footage.editorialCountry = '';
            self.footage.editorialState = '';
            self.footage.editorialText = '';
          }
          self.footage.sharers.forEach(item => {
            item.collabShareOld = item.collabShare;
          });
          self.statusValid = self.checkValidDocumentInfo(
            self.footage.documents.modelDocuments
          );
          self.initializeDocumentUpload('');
          self.getScreenSize();
          self.hidePlayFootage = true;
          var memberId = localStorage.getItem('userid');
          self.thumbnailUrl = self.apiUrl.thumbnail.replace(
            '{memberId}',
            memberId
          );
          self.checkValidDesc(self.footage);
          self.checkKeywordsNumber(self.footage);
          self.sharedService.infoModal$.subscribe(modalName => {
            if (modalName != '') {
              var modal = JSON.parse(modalName);
              console.log(modal);
              if (modal.id == 'modelDocument' && modal.check) {
                self.getDataModel(self.footage.documents.modelDocuments);
              }
              if (modal.id == 'propertyDocument' && modal.check) {
                self.showNotifyNewReleaseModal(
                  self.footage.documents.propertyDocuments
                );
              }
            }
          });
          console.log('Next footage', self.footage);
        }
      });
    } else {
      this.cancelEditFootage();
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
}
