import { Injectable } from '@angular/core';
import { ApiUrl } from '../utils/apiUrl';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

declare var moment: any;
@Injectable({
  providedIn: 'root'
})
export class MediaProductService {

  constructor(
    private apiUrl: ApiUrl, private apiService: ApiService) { }
  

  getUserId() {
    return localStorage.getItem('userid');
  }

  getMediaProducts(index: any, limit: any, keywords?: any) {
    var myUrl = this.apiUrl.get_media_products.replace('{memberId}', this.getUserId());
    var myParams: any = {};
    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }
    if (keywords) {
      myParams.keywords = keywords.trim();
    } 
    return this.apiService.httpGet(myUrl, myParams);
  }

  updateMediaProduct(mediaProduct) {
    var myUrl = this.apiUrl.update_media_product.replace('{memberId}', this.getUserId()).replace('{mediaProductId}', mediaProduct.mediaProductId);

    return this.apiService.httpPut(myUrl, mediaProduct);
  }

  deleteMediaProduct(mediaProduct) {
    var myUrl = this.apiUrl.update_media_product.replace('{memberId}', this.getUserId()).replace('{mediaProductId}', mediaProduct.mediaProductId);

    return this.apiService.httpDelete(myUrl);
  }

  countMediaProducts() {
    var myUrl = this.apiUrl.count_media_products.replace('{memberId}', this.getUserId());

    return this.apiService.httpGet(myUrl);
  }

  refuseCurationMediaProducts(list: any, message: string){
    var self = this;
    var myUrl = self.apiUrl.refuse_curation_media_products.replace('{memberId}', self.getUserId());
    var myParams = {
      message: message,
      mediaProducts: list
    }
    return self.apiService.httpPut(myUrl, myParams);
  }

  assignCurator(curator, mediaProductIds) {
    var self = this;
    var myUrl = self.apiUrl.assign_curator.replace('{memberId}', self.getUserId());
    var data = {
      collabMemberId: curator.id,
      collabShare: curator.collabShare,
      mediaProductIds: mediaProductIds
    }
    return self.apiService.httpPost(myUrl, data)
  }

  getCurationMediaProducts(index: any, limit: any, keywords?: any, filterStatus?: string, filterOwner?: string) {
    var myUrl = this.apiUrl.get_curation_media_products.replace('{memberId}', this.getUserId());
    var myParams: any = {};
    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }

    if (filterStatus) {
      myParams.filterStatus = filterStatus;
    }

    if (filterOwner) {
      myParams.filterOwner = filterOwner;
    }

    if (keywords) {
      myParams.keywords = keywords.trim();
    } 
    return this.apiService.httpGet(myUrl, myParams);
  }

  submitMediaProducts(mediaProducts) {
    var self = this;
    var req: any = {};
    var list = [];
    for (var i in mediaProducts) {
      list.push(mediaProducts[i].mediaProductId);
    }
    req.memberId = self.getUserId();
    req.mediaProductIds = list;
    var myUrl = self.apiUrl.submit_media_products.replace('{memberId}', self.getUserId());

    return self.apiService.httpPost(myUrl, req);
  }

  getSubmittedMediaProducts(index: any, limit: any, keywords?: any) {
    var myUrl = this.apiUrl.get_submitted_media_products.replace('{memberId}', this.getUserId());
    var myParams: any = {};

    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }

    if (keywords) {
      myParams.keywords = keywords;
    } 

    return this.apiService.httpGet(myUrl, myParams);
  }

  createComment(info: any, post: boolean){
    var myUrl = this.apiUrl.create_comment.replace('{memberId}', this.getUserId()).replace('{mediaProductId}', info.mediaProductId);
    var myParams: any = {
      content: info.content,
      currentTime: info.currentTime,
      postedTime: null,
      drawingData: info.drawingData
    };
    if(post){
      var postedTime = moment().format("YYYY-MM-DD HH:mm:ss");
      myParams.postedTime = postedTime;
    }
    var temp = {
      myParams : myParams
    }
    return this.apiService.httpPost(myUrl, temp);
  }

  getComment(info: any, keywords?:any){
    var myUrl = this.apiUrl.create_comment.replace('{memberId}', this.getUserId()).replace('{mediaProductId}', info.mediaProductId);
    var myParams: any = {};
    if (keywords) {
      myParams.keywords = keywords.trim();
    } 
    return this.apiService.httpGet(myUrl, myParams);
  }
  
  memberViewContent(info: any){
    var myUrl = this.apiUrl.member_view_content.replace('{memberId}', this.getUserId()).replace('{mediaProductId}', info.mediaProductId);
    var data = {
      list: info.list
    }
    return this.apiService.httpPost(myUrl, data);
  }

  editComment(info: any, edit: boolean, post: boolean){
    var myUrl = this.apiUrl.create_comment.replace('{memberId}', this.getUserId()).replace('{mediaProductId}', info.mediaProductId);
    var myParams: any = {
      content: info.content,
      currentTime: info.currentTime,
      postedTime: null,
      commentId: info.commentId,
      drawingData: info.drawingData
    }; 
    if(post){
      if(info.postedTime){
        var postedTime = moment(info.postedTime).format("YYYY-MM-DD HH:mm:ss");
      } else {
        var postedTime = moment().format("YYYY-MM-DD HH:mm:ss");
      }
      myParams.postedTime = postedTime;
    }
    var temp = {
      myParams : myParams
    }
    return this.apiService.httpPost(myUrl, temp);
  }

  deleteComment(info: any){
    var myUrl = this.apiUrl.create_comment.replace('{memberId}', this.getUserId()).replace('{mediaProductId}', info.mediaProductId);

    return this.apiService.httpDelete(myUrl, info);
  }
  getMediaProduct(mediaProductId: any) {
    var myUrl = this.apiUrl.get_media_product.replace('{mediaProductId}', mediaProductId);
    return this.apiService.httpGet(myUrl);
  }
  createThumbnailMediaProduct(mediaProduct: any) {
    var myUrl = this.apiUrl.create_thumbnail_media_product.replace('{memberId}', this.getUserId()).replace('{mediaProductId}', mediaProduct.mediaProductId);
    return this.apiService.httpPost(myUrl, mediaProduct);
  }
  getUserApproval(mediaProductId: any) {
    var myUrl = this.apiUrl.get_user_approval.replace('{memberId}', this.getUserId()).replace('{mediaProductId}', mediaProductId);
    return this.apiService.httpGet(myUrl);
  }
  approvalMediaProduct(mediaProduct: any) {
    var myUrl = this.apiUrl.approval_media_product.replace('{memberId}', this.getUserId()).replace('{mediaProductId}', mediaProduct.mediaProductId);
    return this.apiService.httpPost(myUrl, mediaProduct);
  }
  removeLastUpdateFileMediaProduct(mediaProduct, type) {
    var myUrl = this.apiUrl.remove_file_media_product.replace('{memberId}', this.getUserId()).replace('{mediaProductId}', mediaProduct.mediaProductId)
    .replace('{type}', type);

    return this.apiService.httpPut(myUrl, mediaProduct);
  }
  removeCustomImage(mediaProduct: any, type: string) {
    var myUrl = this.apiUrl.remove_custom_image.replace('{memberId}', this.getUserId()).replace('{mediaProductId}', mediaProduct.mediaProductId)
    .replace('{type}', type);

    return this.apiService.httpPut(myUrl, mediaProduct);
  }
  getkeywordAutoComplete(): Observable<any> {
    var _jsonURL = '../../assets/auto-complete/keywords.json';
    return this.apiService.get(_jsonURL);
  }
}
