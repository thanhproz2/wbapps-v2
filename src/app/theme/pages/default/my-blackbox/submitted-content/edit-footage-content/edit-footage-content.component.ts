import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core';
import { SharedService } from 'src/app/services/shared-service';
import { Router } from '@angular/router';
import { ApiUrl } from 'src/app/utils/apiUrl';
import { Constants } from 'src/app/utils/constants';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from 'src/app/services/upload.service';
import { AccountService } from 'src/app/services/account.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ReleaseService } from 'src/app/services/release.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { Utils } from 'src/app/utils/utils';
import _ from 'underscore';
import * as Plyr from 'plyr'

declare var $: any;
@Component({
  selector: 'app-edit-footage-content',
  templateUrl: './edit-footage-content.component.html',
  styleUrls: ['./edit-footage-content.component.css']
})
export class EditFootageContentComponent implements OnInit {
  public footage: any;
  public infoSubmitContentPage: any;
  public loading: boolean;
  scrWidth: any;
  setWidth: boolean = false;
  footageCheck: any = {};
  masterData: any;
  maxDate: Date;
  canReminder: boolean = false;
  keywordsDocument: string = '';
  newDocumentId: string = '';
  selectedModelReleases: any = [];
  currentFootageReleases: any = {};
  statusValidDocumentInfo: boolean = false;
  modelReleases: any = {};
  isAttachedAll: any = {};
  propertyReleases: any = {};
  selectedPropertyReleases: any = [];
  isJustUploadedRelease: boolean = false;
  currentDocument: any = {};
  statusErrorDocumentsInfo: boolean = false;
  statusValid: boolean = false;
  documentsInfo: any = {
    age: false,
    ethnicity: false,
    gender: false,
    status: false
  };
  tempProperty: any = {};
  canSaveLocal: boolean = false;
  hidePlayFootage: boolean;
  thumbnailUrl: string;
  countModelReleases: number = 0;
  countPropertyReleases: number = 0;
  saving: boolean = false;
  maxItem: number;
  dataImage: any = [];
  is_documents = false;
  srcUrl = '';

  @ViewChild('changeModelDocument') public changeModelDocument: ModalDirective;
  @ViewChild('updateModelRelease') updateModelRelease: ModalDirective;
  @ViewChild('confirmRelease') confirmRelease: ModalDirective;
  @ViewChild('justUploadedRelease') justUploadedRelease: ModalDirective;
  @ViewChild('modelDocument') modelDocument: ModalDirective;
  @ViewChild('propertyDocument') propertyDocument: ModalDirective;
  @ViewChild('notifyNewRelease') notifyNewRelease: ModalDirective;
  @ViewChild('viewReleaseModal') viewReleaseModal: ModalDirective;
  @ViewChild('searchModelDocuments') searchModelDocuments: ElementRef;
  @ViewChild('searchPropertyDocuments') searchPropertyDocuments: ElementRef;
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
    private toastr: ToastrService,
    private uploadService: UploadService,
    private accountService: AccountService,
    private releaseService: ReleaseService,
    private authenticateService: AuthenticateService,
    private utils: Utils
  ) {
    this.maxDate = new Date();
    this.maxItem = this.constants.maxKeyword;
    this.getScreenSize();
    this.masterData = {
      countries: commonService.getCountries(),
      modelEthnicities: commonService.getModelEthnicities(),
      modelAges: commonService.getModelAges(),
      modelGenders: commonService.getModelGenders(),
      footageCategories: commonService.getFootageCategories()
    };
  }

  async ngOnInit() {
    var self = this;
    self.sharedService.footageContent$.subscribe(footage => {
      self.footage = footage;
    });
    self.sharedService.infoSubmitContentPage$.subscribe(info => {
      self.infoSubmitContentPage = info;
    });
    if (self.footage == '') {
      self.router.navigate(['my-blackbox/submitted-content']);
    } else {
      if (self.footage.category == null) {
        self.footage.category = '';
      }
      if (!self.footage.editorial) {
        self.footage.editorialCity = '';
        self.footage.editorialCountry = '';
        self.footage.editorialState = '';
        self.footage.editorialText = '';
      }
      if (self.footage.keywords == '') {
        self.footage.keywordsArray = [];
      } else {
        var keywordsArray = self.footage.keywords;
        keywordsArray = keywordsArray.split(',').map(String);
        keywordsArray = _.map(keywordsArray, item => {
          var obj: any = {};
          obj.value = item;
          obj.display = item;
          return obj;
        });
        self.footage.keywordsArray = keywordsArray;
      }
      await self.initializeDocumentUpload('');
      self.hidePlayFootage = true;
      var memberId = localStorage.getItem('userid');
      self.thumbnailUrl = self.apiUrl.thumbnail.replace('{memberId}', memberId);
      self.getFootageDocuments();
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
      // self.statusValid = self.checkValidDocumentInfo(self.footage.documents.modelDocuments);
    }
  }
  getFootageDocuments() {
    var self = this;
    self.uploadService
      .getFootageDocuments(self.footage.footageId, true, false)
      .then((req: any) => {
        self.footage.documents.modelDocuments = req.list;
        self.statusValid = self.checkValidDocumentInfo(
          self.footage.documents.modelDocuments
        );
      });
    self.uploadService
      .getFootageDocuments(self.footage.footageId, false, true)
      .then((req: any) => {
        self.footage.documents.propertyDocuments = req.list;
      });
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
    self.infoSubmitContentPage.removeInfo = true;
    self.sharedService.emitInfoSubmitContentPage(self.infoSubmitContentPage);
    self.router.navigate(['my-blackbox/submitted-content']);
  }

  checkValidEditorial() {
    var self = this;
    self.footage.editorialDate = new Date();
    if (!self.footage.editorial) {
      self.footage.editorialCity = '';
      self.footage.editorialCountry = '';
      self.footage.editorialState = '';
      self.footage.editorialText = '';
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
      count = words.split(' ').length + words.split('\n').length - 1;
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
  save(footage: any) {
    var self = this;
    var invalidDesc = self.checkValidDesc(self.footage, true);
    var keywordsNumber = self.checkKeywordsNumber(self.footage);
    if (!invalidDesc || !keywordsNumber || footage.maxTimes) {
      console.log(
        'invalidDesc: ',
        invalidDesc,
        'keywordsNumber: ',
        keywordsNumber,
        'maxTimes: ',
        footage.maxTimes
      );
      return;
    }
    if (footage.editorial == null) {
      footage.editorial = false;
    }
    var keywordArray = footage.keywordsArray;
    keywordArray = _.pluck(keywordArray, 'value');
    footage.keyword_list = keywordArray;
    footage.keywords = keywordArray.join(',');
    this.loading = true;
    self.uploadService.editedContentFootage(footage).then((result: any) => {
      console.log(result);
      this.loading = false;
      if (result && result.ok) {
        self.toastr.success('Data has been successfully saved.', 'Success');
        self.cancelEditFootage();
      }
    });
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

  loadDocuments(modelCheck, propertyCheck, footageId, getFootage?) {
    var self = this;
    var memberId = localStorage.getItem('userid');
    var keyword = self.keywordsDocument;
    if (modelCheck == true) {
      self.uploadService
        .getDocuments(memberId, true, false, keyword, footageId, false)
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
        .getDocuments(memberId, false, true, keyword, footageId, false)
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

    self.countReleases();
  }

  initializeDocumentUpload(footageId: any) {
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

  filterModelDocuments() {
    var self = this;
    self.loadDocuments(true, false, self.footage.footageId);
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

  yesJustUploadedRelease() {
    var self = this;
    self.justUploadedRelease.hide();
    self.propertyDocument.hide();
    self.modelDocument.hide();
  }

  filterPropertyDocuments() {
    var self = this;
    self.loadDocuments(false, true, self.footage.footageId);
  }

  hideChildModal(): void {
    var self = this;
    self.changeModelDocument.hide();
    if (!self.statusValidDocumentInfo) {
      self.modelDocument.show();
    }
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

  routerLegalForms(id: string) {
    var modal = {
      id: id,
      check: false
    };
    this.sharedService.emitInfoModal(JSON.stringify(modal));
    this.router.navigate(['/legal-forms']);
  }
}
