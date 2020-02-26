import { Injectable } from '@angular/core';
import { ApiUrl } from '../utils/apiUrl';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MediaReviewerService {

  constructor(
    private apiUrl: ApiUrl,
    private apiService: ApiService
  ) { }

  getUserId() {
    return localStorage.getItem('userid');
  }

  getInReviewMediaProducts(index, limit, keywords) {
    const myUrl = this.apiUrl.in_review_media.replace('{memberId}', this.getUserId());
    const myParams: any = {
      index: index,
      limit: limit
    };

    if (keywords) {
      myParams.keywords = keywords;
    }

    return this.apiService._httpGet(myUrl, myParams);
  }

  getMoreMediaProductByBatch(batchValue) {
    const myUrl = this.apiUrl.get_more_media.replace('{memberId}', this.getUserId());
    const myParams: any = {
      batchValue: batchValue
    };

    return this.apiService._httpGet(myUrl, myParams);
  }

  approveMediaProduct(mediaProductId) {
    const myUrl = this.apiUrl.reviewer_approve_media.replace('{memberId}', this.getUserId()).replace('{mediaProductId}', mediaProductId);
    return this.apiService._httpPut(myUrl, {});
  }

  rejectMediaProduct(mediaProductId, body) {
    const myUrl = this.apiUrl.reviewer_reject_media.replace('{memberId}', this.getUserId()).replace('{mediaProductId}', mediaProductId);
    return this.apiService._httpPut(myUrl, body);
  }
}
