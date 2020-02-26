import { Injectable } from '@angular/core';
import { ApiUrl } from '../utils/apiUrl';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private apiUrl: ApiUrl, private _apiService: ApiService, private _httpClient: HttpClient) { }

  getUserId() {
    var memberId = localStorage.getItem('userid');
    return memberId;
  }
  getFootages(index: any, limit: any, keywords?: any, filterStatus?: any) {
    var self = this;
    var myParams: any = {};
    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }
    if (keywords) {
      myParams.keywords = keywords.trim();
    }
    if (filterStatus) {
      myParams.filterStatus = filterStatus;
    }
    var memberId = localStorage.getItem('userid');
    var url = self.apiUrl.get_contribute_footages.replace('{memberId}', memberId)
    return self._apiService.httpGet(url, myParams);

  }

  getFootageDocuments(footageId: string, modelCheck: boolean, propertyCheck: boolean, item?: any) {
    var memberId = localStorage.getItem('userid');
    var self = this;
    var myParams = {
      modelCheck: modelCheck,
      propertyCheck: propertyCheck,
    };


    var myUrl = self.apiUrl.get_member_footage_documents.replace('{memberId}', memberId);
    myUrl = myUrl.replace('{footageId}', footageId);
    return self._apiService.httpGet(myUrl, myParams);
  }

  deleteFootages(footages: any) {
    var self = this;
    var memberId = localStorage.getItem('userid');
    var list = [];
    list.push({
      footageId: footages.footageId
    });

    var myUrl = self.apiUrl.delete_footages.replace('{memberId}', memberId);
    return self._apiService.httpDelete(myUrl, list);
  }

  getSharers(index, limit, role, filter, memberAttribute?: any) {
    var self = this;
    var myUrl = self.apiUrl.get_members_by_role.replace('{role}', role).replace("{userId}", self.getUserId());
    var myParams: any = {
      index: index,
      limit: limit,
      filter: filter,
      notMemberId: self.getUserId(),
      memberAttribute: memberAttribute
    };

    return self._apiService.httpGet(myUrl, myParams);
  }

  updateFootage(footage: any) {
    var self = this;
    var memberId = self.getUserId();
    var myUrl = self.apiUrl.update_footage.replace('{memberId}', memberId);
    myUrl = myUrl.replace('{footageId}', footage.footageId);
    footage.noteToOwner = null;
    for (var i in footage) {
      if (footage[i] == null) {
        delete footage[i];
      }
    }
    if (footage.editorialDate === "Invalid date") {
      footage.editorialDate = null;
    } else {
      if (footage.editorialDate) {
        footage.editorialDate = moment(footage.editorialDate).format("YYYY-MM-DD");
      }
    }
    return self._apiService.httpPut(myUrl, footage);
  }

  getDocuments(memberId: string, modelCheck: any, propertyCheck: any, keywords: any, footageId: string, getFootage: any, ownerId?: string) {
    var myParams: any = {};
    var self = this;
    myParams.modelCheck = modelCheck;
    myParams.propertyCheck = propertyCheck;
    if (keywords) {
      myParams.keywords = keywords.trim();
    }
    if (footageId) {
      myParams.footageId = footageId;
    }
    if (getFootage) {
      myParams.getFootage = getFootage;
    }
    if (ownerId){
      myParams.ownerId = ownerId;
    }

    var url = self.apiUrl.get_member_documents.replace('{memberId}', memberId).replace('{ownerId}', ownerId);
    return self._apiService.httpGet(url, myParams);
  }

  updateDocumentInfo(document) {
    var self = this;
    var myUrl = self.apiUrl.update_document.replace('{memberId}', self.getUserId())
      .replace('{documentId}', document.documentId);
    var data = {
      ethnicity: document.ethnicity,
      age: document.age,
      gender: document.gender
    }
    return self._apiService.httpPost(myUrl, data);
  }

  uploadBatchFootages(batchId, footagesInfo, footage, isConfirm?) {
    var self = this;
    var myUrl = self.apiUrl.update_batch_footages;
    myUrl = myUrl.replace('{memberId}', self.getUserId());
    myUrl = myUrl.replace('{batchId}', batchId);

    for (var i in footagesInfo) {
      if (footagesInfo[i] == null) {
        footagesInfo[i] = '';
      }
    }
    var data: any = {
      info: footagesInfo,
      footage: footage
    }

    if (isConfirm === true || isConfirm === false) {
      data.isConfirm = isConfirm
    }

    return self._apiService.httpPut(myUrl, data);
  }


  assignCurator(curator, footageIds) {
    var self = this;
    var myUrl = self.apiUrl.assign_footage_curator.replace('{memberId}', self.getUserId());
    var data = {
      collabMemberId: curator.id,
      collabShare: curator.collabShare,
      footageIds: footageIds
    }
    return self._apiService.httpPost(myUrl, data)
  }


  createBatch(batchName, footageIds, isConfirm?) {
    var self = this;
    var myUrl = self.apiUrl.create_batch.replace('{memberId}', self.getUserId());
    var data: any = {
      batchName: batchName,
      footageIds: footageIds
    };

    if (isConfirm) {
      data.isConfirm = isConfirm;
    }

    return self._apiService.httpPost(myUrl, data);
  }

  submitFootages(footages) {
    var self = this;
    var list = [];
    for (var i in footages) {
      list.push({
        footageId: footages[i].footageId,
        memberId: footages[i].memberId,
        uploadedBy: footages[i].uploadedBy
      });
    }
    var myUrl = self.apiUrl.submit_footages.replace('{memberId}', self.getUserId());

    return self._apiService.httpPut(myUrl, list);
  }

  getContentFootages(index: number, limit: number, keywords: any, contentFilter: any, filterStatus: any) {
    var self = this;
    var url = self.apiUrl.get_content_footages.replace('{memberId}', self.getUserId())
    var myParams: any = {};
    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }
    if (keywords) {
      myParams.keywords = keywords.trim();
    }
    if (filterStatus) {
      myParams.filterStatus = filterStatus;
    }
    if (contentFilter) {
      myParams.contentFilter = contentFilter;
    }

    return self._apiService.httpGet(url, myParams);
  }

  approveFootage(file: any) {
    var self = this;
    var myUrl = self.apiUrl.approve_footage.replace('{memberId}', self.getUserId());
    myUrl = myUrl.replace('{footageId}', file.footageId);
    var myParams: any = {};
    if (file.projectId) {
      myParams.projectId = file.projectId;
    }
    if (file.uploadedBy) {
      myParams.uploadedBy = file.uploadedBy;
    }
    return self._apiService.httpGet(myUrl, myParams);
  }

  completeProject(projectId: string) {
    var self = this;
    var myUrl = self.apiUrl.complete_project.replace('{memberId}', self.getUserId()).replace('{projectId}', projectId);
    return self._apiService.httpPost(myUrl, {});
  }

  rejectFootage(file: any) {
    var self = this;
    var myUrl = self.apiUrl.reject_footage.replace('{memberId}', self.getUserId());
    myUrl = myUrl.replace('{footageId}', file.footageId);
    return self._apiService.httpGet(myUrl);
  }

  getCurationFootages(index: number, limit: number, keywords: string, filterStatus: string, filterOwner: string) {
    var self = this;
    var url = self.apiUrl.get_curation_footages.replace('{memberId}', self.getUserId())
    var myParams: any = {};
    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }
    if (keywords) {
      myParams.keywords = keywords.trim();
    }
    if (filterStatus) {
      myParams.filterStatus = filterStatus;
    }

    if (filterOwner) {
      myParams.filterOwner = filterOwner;
    }

    return self._apiService.httpGet(url, myParams);
  }

  refusedByCuration(list: any, message: string) {
    var self = this;
    var myUrl = self.apiUrl.refused_by_curation.replace('{memberId}', self.getUserId());
    var myParams = {
      message: message,
      footages: list
    }
    return self._apiService.httpPut(myUrl, myParams);
  }

  updateCuratorFootage(footageId, keyword_list, description, editorial, editorialCity, editorialState, editorialCountry, editorialDate, editorialText, category, noteToOwner, releases, applyKeywordsToBatch, applyDescriptionToBatch, applyEditorialToBatch, applyCategoryToBatch, applyNoteToOwnerToBatch, applyReleases) {
    var self = this;
    var myUrl = self.apiUrl.curator_update_footage.replace('{memberId}', self.getUserId()).replace('{footageId}', footageId);
    var data: any = {
      keyword_list: keyword_list,
      description: description ? description : "",
      editorial: editorial,
      editorialCity: editorialCity,
      editorialState: editorialState,
      editorialCountry: editorialCountry,
      editorialDate: moment(editorialDate).format("YYYY-MM-DD"),
      editorialText: editorialText,
      category: category,
      noteToOwner: noteToOwner,
      releases: releases,
      applyKeywordsToBatch: applyKeywordsToBatch,
      applyDescriptionToBatch: applyDescriptionToBatch,
      applyEditorialToBatch: applyEditorialToBatch,
      applyCategoryToBatch: applyCategoryToBatch,
      applyNoteToOwnerToBatch: applyNoteToOwnerToBatch,
      applyReleases: applyReleases
    }

    return self._apiService.httpPost(myUrl, data);
  }

  countWorkSpaceFootages() {
    var self = this;
    var myUrl = self.apiUrl.count_in_tab.replace('{memberId}', self.getUserId());
    return self._apiService.httpGet(myUrl);
  }

  editedContentFootage(footage) {
    var self = this;
    var myUrl = self.apiUrl.edited_content_footage.replace('{memberId}', self.getUserId()).replace('{footageId}', footage.footageId);
    return self._apiService.httpPut(myUrl, footage);
  }

  changeSharer(info) {
    var self = this;
    var myUrl = self.apiUrl.change_sharer.replace('{memberId}', self.getUserId()).replace('{footageId}', info.footageId);
    return self._apiService.httpPut(myUrl, info);
  }

  getCurationOwners() {
    var self = this;
    var myUrl = self.apiUrl.get_curation_owners.replace('{memberId}', self.getUserId());
    return self._apiService.httpGet(myUrl);
  }

  getListBatchName(type) {
    var self = this;
    var myParams = {
      type: type
    };
    var myUrl = self.apiUrl.get_list_batch_name.replace('{memberId}', self.getUserId());
    return self._apiService.httpGet(myUrl, myParams);
  }
  
  searchFootages(index, limit, keywordSearch) {
    var myParams: any = {};
    var myUrl = this.apiUrl.reviewer_search_footage.replace('{memberId}', this.getUserId());
    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }
    myParams.keywordSearch = keywordSearch.trim();
    
    return this._apiService.httpGet(myUrl, myParams);
  }

  checkUploadProject(){
    var myUrl = this.apiUrl.count_upload_project.replace('{memberId}', this.getUserId());

    return this._apiService.httpGet(myUrl);
  }
  getMediaProductDocuments(memberId: string, modelCheck: any, propertyCheck: any, keywords: any) {
    var myParams: any = {};
    var self = this;
    myParams.modelCheck = modelCheck;
    myParams.propertyCheck = propertyCheck;
    if (keywords) {
      myParams.keywords = keywords.trim();
    }
    // if (mediaProductId) {
    //   myParams.mediaProductId = mediaProductId;
    // }
    // if (getFootage) {
    //   myParams.getFootage = getFootage;
    // }
    // if (ownerId){
    //   myParams.ownerId = ownerId;
    // }

    var url = self.apiUrl.get_media_product_documents.replace('{memberId}', memberId);
    return self._apiService.httpGet(url, myParams);
  }
  getFootage(footageId: string) {
    var url = this.apiUrl.get_footage.replace('{memberId}', this.getUserId()).replace('{footageId}', footageId);
    return this._apiService.httpGet(url);

  }
}
