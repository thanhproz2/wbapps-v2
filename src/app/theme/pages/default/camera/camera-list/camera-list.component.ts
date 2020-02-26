import { Component, OnInit, ViewChild } from '@angular/core';
import { CameraService } from 'src/app/services/camera.service';
import { CameraNewComponent } from '../camera-new/camera-new.component';
import { Utils } from 'src/app/utils/utils';
import { CameraEditComponent } from '../camera-edit/camera-edit.component';
import { CommonService } from 'src/app/services/common.service';
import * as _ from 'underscore';

declare let toastr: any;
declare let $: any;

@Component({
  selector: 'app-camera-list',
  templateUrl: './camera-list.component.html',
  styles: []
})
export class CameraListComponent implements OnInit {
  cameras: any = [];
  currentCamera: any = {};
  selectedCameraId: number;
  cameraTypes: any = [];
  cameraInfo: any = {};
  selectedCameraType: any = {};
  loading: boolean;

  @ViewChild('editCameraModal') editCameraModal: CameraEditComponent;
  @ViewChild('newCameraModal') newCameraModal: CameraNewComponent;
  constructor(
    private cameraService: CameraService,
    private commonService: CommonService,
    private utils: Utils
  ) {
    this.cameraTypes = this.commonService.getCameraTypes();
  }

  ngOnInit() {
    this.loadCameras();
    this.cameraService.onDaultUpdated$.subscribe(data => {
      console.log('CameraListComponent.onDaultUpdated', data);
      this.selectedCameraId = data.cameraId;
    });
  }

  loadCameras() {
    this.cameraService.getMemberCameras().then(result => {
      this.cameras = result.data;
      const tmp = _.find(this.cameras, item => {
        return item.default;
      });
      this.selectedCameraId = tmp && tmp.cameraId ? tmp.cameraId : null;
    });
  }

  edit(item) {
    const camera = this.utils.clone(item);
    this.currentCamera = camera;
    this.editCameraModal.show();
  }

  remove(item) {
    console.log('remove', item);
    this.cameraService.deleteMemberCamera(item.cameraId).then(() => {
      if (item.default) {
        this.cameras = _.reject(this.cameras, i => {
          return i.cameraId === item.cameraId;
        });
        this.selectedCameraId = this.cameras.length
          ? this.cameras[0].cameraId
          : null;
        if (this.selectedCameraId) {
          this.change(this.selectedCameraId);
        }
      }
      setTimeout(() => {
        this.loadCameras();
      }, 500);
      toastr.success('Removed successfully!');
    });
  }

  show() {
    this.cameraInfo.cameraType = '';
    this.cameraInfo.cameraBrand = '';
    this.cameraInfo.cameraBrandOther = '';
    $('#newCameraTypeModal').modal('show');
  }

  change(selectedCameraId) {
    console.log(selectedCameraId);
    // Make a request to select the camera
    this.cameraService.selectDefautMemberCamera(selectedCameraId).then(() => {
      const currentCamera = _.find(this.cameras, item => {
        return item.cameraId === selectedCameraId;
      });
      this.cameraService.setDefault(currentCamera);
      toastr.success('Selected successfully!');
    });
  }

  createCamera() {
    this.loading = true;
    const info = {
      memberId: localStorage.getItem('userid'),
      cameraType: this.cameraInfo.cameraType,
      cameraBrand: this.cameraInfo.cameraBrand,
      cameraBrandOther:
        this.cameraInfo.cameraBrand === 'Other (specify)'
          ? this.cameraInfo.cameraBrandOther
          : '',
      default: true
    };
    this.cameraService.createMemberCamera(info).then((result: any) => {
      this.loading = false;
      result = result.json();
      console.log(result);
      if (result.success) {
        this.cameras.push(result.data);
        if (result.data.default) {
          this.selectedCameraId = result.data.cameraId;
          this.change(this.selectedCameraId);
        }
        toastr.success('Created successfully!');
        $('#newCameraTypeModal').modal('hide');
      } else {
        toastr.error(result.message ? result.message : '', 'Error');
      }
    });
  }

  onSelectCameraType(cameraType) {
    console.log('cameraType', cameraType);
    this.selectedCameraType = _.find(this.cameraTypes, item => {
      return item.type === cameraType;
    });
    if (!this.selectedCameraType) {
      this.selectedCameraType = {};
    }
    console.log('onSelectCameraType', this.selectedCameraType);
  }
}
