import { Injectable } from '@angular/core';
import { ApiUrl } from '../utils/apiUrl';
import { ApiService } from './api.service';

declare var moment;
@Injectable({
  providedIn: 'root'
})
export class ReviewerService {
  constructor(private apiUrl: ApiUrl, private apiService: ApiService) {}

  getUserId() {
    return localStorage.getItem('userid');
  }

  getAllContentFootages(
    index,
    limit,
    numberGetmoreFootages?: number,
    keywords?: string,
    statusFilter?: string
  ) {
    const myUrl = this.apiUrl.get_all_content_footages.replace(
      '{memberId}',
      this.getUserId()
    );
    const myParams: any = {};

    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }

    if (keywords) {
      myParams.keywords = keywords.trim();
    }

    if (numberGetmoreFootages) {
      myParams.numberGetmoreFootages = numberGetmoreFootages;
    }

    if (statusFilter) {
      myParams.statusFilter = statusFilter;
    }

    return this.apiService.httpGet(myUrl, myParams);
  }

  getDeferralFootages(index, limit, keywords) {
    const myParams: any = {};
    const myUrl = this.apiUrl.get_deferral_footages.replace(
      '{memberId}',
      this.getUserId()
    );

    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }

    if (keywords) {
      myParams.keywords = keywords.trim();
    }

    return this.apiService.httpGet(myUrl, myParams);
  }

  getRejectedFootages(
    index,
    limit,
    keywords,
    filterByAgencies,
    filterByReviewer,
    date
  ) {
    const myParams: any = {};
    const myUrl = this.apiUrl.get_rejected_footages.replace(
      '{memberId}',
      this.getUserId()
    );

    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }

    if (keywords) {
      myParams.keywords = keywords.trim();
    }

    if (filterByAgencies) {
      myParams.filterByAgencies = filterByAgencies;
    }

    if (filterByReviewer) {
      myParams.filterByReviewer = filterByReviewer;
    }

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

    return this.apiService.httpGet(myUrl, myParams);
  }

  getApprovedFootages(
    index,
    limit,
    keywords,
    filterByReviewer,
    date
  ) {
    const myParams: any = {};
    const myUrl = this.apiUrl.get_approved_footages.replace(
      '{memberId}',
      this.getUserId()
    );

    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }

    if (keywords) {
      myParams.keywords = keywords.trim();
    }

    if (filterByReviewer) {
      myParams.filterByReviewer = filterByReviewer;
    }

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

    return this.apiService.httpGet(myUrl, myParams);
  }

  updateDeferralContent(deferralContent, footage) {
    const myUrl = this.apiUrl.update_deferral_content
      .replace('{memberId}', this.getUserId())
      .replace('{footageId}', footage.footageId);
    const data = {
      deferralContent: deferralContent
    };

    return this.apiService.httpPut(myUrl, data);
  }

  ignoreRejectedFootage(footage) {
    const myUrl = this.apiUrl.ignore_rejected_footage
      .replace('{memberId}', this.getUserId())
      .replace('{footageId}', footage.footageId);

    return this.apiService.httpPut(myUrl, footage);
  }

  downloadOriginalFootage(footage) {
    const myUrl = this.apiUrl.get_original_footage_video
      .replace('{memberId}', this.getUserId())
      .replace('{footageId}', footage.footageId);

    return this.apiService.httpGet(myUrl);
  }

  reviewerApproveFootage(footage: any) {
    const memberId = this.getUserId();
    let myUrl = this.apiUrl.reviewer_approve_footage.replace(
      '{memberId}',
      memberId
    );
    myUrl = myUrl.replace('{footageId}', footage.footageId);

    for (const i in footage) {
      if (footage[i] == null) {
        delete footage[i];
      }
    }
    return this.apiService.httpPut(myUrl, footage);
  }

  reviewerRejectFootage(info) {
    const memberId = this.getUserId();
    let myUrl = this.apiUrl.reviewer_reject_footage.replace(
      '{memberId}',
      memberId
    );
    myUrl = myUrl.replace('{footageId}', info.footageId);

    return this.apiService.httpPut(myUrl, info);
  }

  rejectReleaseFootage(documentId, footageId) {
    const memberId = this.getUserId();
    let myUrl = this.apiUrl.reject_release_footage.replace(
      '{memberId}',
      memberId
    );
    myUrl = myUrl.replace('{documentId}', documentId);
    myUrl = myUrl.replace('{footageId}', footageId);

    return this.apiService.httpPut(myUrl, { status: 'rejected' });
  }

  reviewerDeferFootage(info) {
    const memberId = this.getUserId();
    let myUrl = this.apiUrl.reviewer_defer_footage.replace(
      '{memberId}',
      memberId
    );
    myUrl = myUrl.replace('{footageId}', info.footageId);

    return this.apiService.httpPut(myUrl, info);
  }

  reviewerNeedDownloadFootage(info) {
    const memberId = this.getUserId();
    let myUrl = this.apiUrl.reviewer_need_dowload_footage.replace(
      '{memberId}',
      memberId
    );
    myUrl = myUrl.replace('{footageId}', info.footageId);

    return this.apiService.httpPut(myUrl, info);
  }

  countStatusFootage(fromDate, toDate) {
    const myParams: any = {};
    const url = this.apiUrl.count_status_footage.replace(
      '{memberId}',
      this.getUserId()
    );
    if (fromDate) {
      myParams.fromDate = moment(fromDate)
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss');
    }

    if (toDate) {
      myParams.toDate = moment(toDate)
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss');
    }

    return this.apiService.httpGet(url, myParams);
  }

  countDeferredFootages() {
    const myUrl = this.apiUrl.count_deferred_footage.replace(
      '{memberId}',
      this.getUserId()
    );

    return this.apiService.httpGet(myUrl);
  }

  getCountAllFootageReviewTab(fromDate, toDate, isStuckedFootageReviewer) {
    const myParams = {
      isStuckedFootageReviewer: isStuckedFootageReviewer,
      fromDate: fromDate,
      toDate: toDate
    };
    const myUrl = this.apiUrl.get_count_all_footage_review_tab.replace(
      '{memberId}',
      this.getUserId()
    );

    return this.apiService.httpGet(myUrl, myParams);
  }

  approveAll(info) {
    const myUrl = this.apiUrl.get_all_content_footages.replace(
      '{memberId}',
      this.getUserId()
    );
    const body = {
      footageIds: info
    };
    return this.apiService.httpPut(myUrl, body);
  }

  getMembersByRejectionRate(fromDate, toDate, rejectionPercentage, reviewBy) {
    const myUrl = this.apiUrl.export_members_has_high_rejected_rate.replace(
      '{memberId}',
      this.getUserId()
    );
    const myParams: any = {
      fromDate: moment(fromDate)
        .startOf('days')
        .format('YYYY-MM-DD HH:mm:ss'),
      toDate: moment(toDate)
        .endOf('days')
        .format('YYYY-MM-DD HH:mm:ss'),
      rejectionPercentage: rejectionPercentage
    };

    if (reviewBy) {
      myParams.reviewBy = reviewBy;
    }
    return this.apiService.httpGet(myUrl, myParams);
  }

  getReviewers() {
    const myUrl = this.apiUrl.get_reviewers.replace(
      '{memberId}',
      this.getUserId()
    );

    return this.apiService.httpGet(myUrl);
  }
}
