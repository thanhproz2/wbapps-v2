import { Injectable } from '@angular/core';
import { ApiUrl } from '../utils/apiUrl';
import { ApiService } from './api.service';
import * as moment from 'moment';

// declare let moment: any;
@Injectable({
  providedIn: 'root'
})
export class ReleaseService {
  constructor(private apiUrl: ApiUrl, private apiService: ApiService) {}

  getUserId() {
    return localStorage.getItem('userid');
  }

  deleteRelease(release: any) {
    const self = this;
    let url = self.apiUrl.delete_release.replace(
      '{memberId}',
      self.getUserId()
    );
    url = url.replace('{documentId}', release.documentId);
    return self.apiService.httpDelete(url);
  }

  attachReleaseForFootage(list, footageId) {
    const self = this;
    const memberId = self.getUserId();
    let myUrl = self.apiUrl.attach_release_for_footage.replace(
      '{memberId}',
      memberId
    );
    const listSelectedRelease: any = {
      listSelectedRelease: list
    };
    myUrl = myUrl.replace('{footageId}', footageId);
    return self.apiService.httpPut(myUrl, listSelectedRelease);
  }

  deattachReleaseForFootage(footageId, documentId) {
    const self = this;
    const memberId = self.getUserId();
    let myUrl = self.apiUrl.deattach_release_for_footage.replace(
      '{memberId}',
      memberId
    );

    myUrl = myUrl.replace('{footageId}', footageId);
    myUrl = myUrl.replace('{documentId}', documentId);

    return self.apiService.httpGet(myUrl);
  }

  viewRelease(documentId: string) {
    const url = this.apiUrl.view_release
      .replace('{memberId}', this.getUserId())
      .replace('{documentId}', documentId);
    return this.apiService.httpGet(url);
  }

  countReleases(ownerId?: string) {
    const url = this.apiUrl.count_releases.replace(
      '{memberId}',
      this.getUserId()
    );
    const myParams = {
      ownerId: ownerId
    };
    return this.apiService.httpGet(url, myParams);
  }

  // Reviewer portal
  getReleasesByReviewer(index, limit, keywords) {
    const myParams: any = {};
    const url = this.apiUrl.get_releases_by_reviewer.replace(
      '{memberId}',
      this.getUserId()
    );

    if (limit) {
      myParams.index = index;
      myParams.limit = limit;
    }

    if (keywords) {
      myParams.keywords = keywords.trim();
    }

    return this.apiService.httpGet(url, myParams);
  }

  getMoreReleasesByReviewer(numberGetMore, numberCurrentRelease) {
    const myParams: any = {};
    const url = this.apiUrl.get_more_releases_by_reviewer.replace(
      '{memberId}',
      this.getUserId()
    );

    if (numberGetMore) {
      myParams.numberGetMore = numberGetMore;
    }

    if (numberCurrentRelease) {
      myParams.numberCurrentRelease = numberCurrentRelease;
    }

    return this.apiService.httpGet(url, myParams);
  }

  countStatusRelease(date) {
    const url = this.apiUrl.count_status_release.replace(
      '{memberId}',
      this.getUserId()
    );
    const myParams: any = {};
    if (date) {
      myParams.fromDate = moment(date)
        .startOf('day')
        .format();
      console.log(myParams.fromDate);
      myParams.fromDate = moment(myParams.fromDate)
        .utc()
        .format();
      myParams.toDate = moment(date)
        .endOf('day')
        .format();
      console.log(myParams.toDate);

      myParams.toDate = moment(myParams.toDate)
        .utc()
        .format();
    }

    return this.apiService.httpGet(url, myParams);
  }

  approveRelease(release) {
    const url = this.apiUrl.approve_release
      .replace('{memberId}', this.getUserId())
      .replace('{documentId}', release.documentId);
    const data = {
      status: 'approved',
      reviewBy: release.reviewBy,
      reviewStatus: release.reviewStatus,
      reviewedAt: release.reviewedAt
    };

    return this.apiService.httpPut(url, data);
  }

  rejectRelease(release, notSendMail?) {
    const url = this.apiUrl.reject_release
      .replace('{memberId}', this.getUserId())
      .replace('{documentId}', release.documentId);
    const data: any = {
      status: 'rejected',
      reviewBy: release.reviewBy,
      reviewStatus: release.reviewStatus,
      reviewedAt: release.reviewedAt,
      rejectedReason: release.rejectedReason
    };

    if (notSendMail) {
      data.notSendMail = notSendMail;
    }

    return this.apiService.httpPut(url, data);
  }
  attachReleaseForMediaProduct(list, mediaProductId){
    var self = this;
    var memberId = self.getUserId();
    var myUrl = self.apiUrl.attach_release_for_media_product.replace('{memberId}', memberId);
    var listSelectedRelease: any = {
      listSelectedRelease: list
    }
    myUrl = myUrl.replace('{mediaProductId}', mediaProductId);
    return self.apiService.httpPut(myUrl,listSelectedRelease);
  }

  deattachReleaseForMediaProduct(mediaProductId, documentId) {
    var self = this;
    var memberId = self.getUserId();
    var myUrl = self.apiUrl.deattach_release_for_media_product.replace('{memberId}', memberId);
    
    myUrl = myUrl.replace('{footageId}', mediaProductId);
    myUrl = myUrl.replace('{documentId}', documentId);
    
    return self.apiService.httpGet(myUrl);
  }
}
