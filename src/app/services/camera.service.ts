import { Injectable } from '@angular/core';
import { ApiUrl } from '../utils/apiUrl';
import { ApiService } from './api.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  onDaultUpdated$ = new Subject<any>();

  constructor(
    private apiUrl: ApiUrl,
    private apiService: ApiService,
  ) { }

  setDefault(camera) {
    this.onDaultUpdated$.next(camera);
  }

  getMemberId() {
    return localStorage.getItem('userid');
  }

  createMemberCamera(cameraInfo) {
    const myUrl = this.apiUrl.member_cameras.replace('{memberId}', this.getMemberId());
    return this.apiService.httpPost(myUrl, cameraInfo);
  }

  getMemberCameras(memberId?) {
    const myUrl = this.apiUrl.member_cameras.replace('{memberId}', this.getMemberId());
    if (!memberId) {
      memberId = this.getMemberId();
    }
    const params = {
      byMemberId: memberId
    };
    return this.apiService.httpGet(myUrl, params);
  }

  getDefaultCamera() {
    const myUrl = this.apiUrl.default_camera.replace('{memberId}', this.getMemberId());
    return this.apiService.httpGet(myUrl);
  }

  selectCameraForFootage(cameraId, footageId) {
    const myUrl = this.apiUrl.details_camera.replace('{memberId}', this.getMemberId()).replace('{cameraId}', cameraId);
    const body = {
      footageId: footageId
    };
    return this.apiService.httpPost(myUrl, body);
  }

  updateMemberCamera(cameraId, body) {
    const myUrl = this.apiUrl.details_camera.replace('{memberId}', this.getMemberId()).replace('{cameraId}', cameraId);
    return this.apiService.httpPut(myUrl, body);
  }

  deleteMemberCamera(cameraId) {
    const myUrl = this.apiUrl.details_camera.replace('{memberId}', this.getMemberId()).replace('{cameraId}', cameraId);
    return this.apiService.httpDelete(myUrl);
  }

  selectDefautMemberCamera(cameraId) {
    const myUrl = this.apiUrl.default_camera.replace('{memberId}', this.getMemberId());
    return this.apiService.httpPost(myUrl, { cameraId: cameraId });
  }

}
