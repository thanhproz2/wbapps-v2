import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { CameraService } from 'src/app/services/camera.service';
import * as _ from 'underscore';

declare let $: any;
declare let toastr: any;

@Component({
  selector: 'app-camera-edit',
  templateUrl: './camera-edit.component.html',
  styles: []
})
export class CameraEditComponent implements OnInit {
  selectedCameraType: any = {};
  cameraTypes: any = [];
  loading: boolean;

  @Input() currentCamera: any;
  @Output() onUpdateSuccess = new EventEmitter<any>();

  constructor(
    private commonService: CommonService,
    private cameraService: CameraService
  ) {
    this.cameraTypes = this.commonService.getCameraTypes();
  }

  ngOnInit() {}

  show() {
    setTimeout(() => {
      console.log(this.currentCamera);
      this.onSelectCameraType(this.currentCamera.cameraType);
      $('#modelId').modal('show');
    }, 100);
  }

  hide() {
    console.log(this.currentCamera);
    $('#modelId').modal('hide');
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

  saveUpdate() {
    this.loading = true;
    const info = {
      memberId: localStorage.getItem('userid'),
      cameraId: this.currentCamera.cameraId,
      cameraType: this.currentCamera.cameraType,
      cameraBrand: this.currentCamera.cameraBrand,
      cameraBrandOther:
        this.currentCamera.cameraBrand === 'Other (specify)'
          ? this.currentCamera.cameraBrandOther
          : ''
    };
    this.cameraService
      .updateMemberCamera(info.cameraId, info)
      .then((result: any) => {
        this.loading = false;
        result = result.json();
        console.log(result);
        if (result.success) {
          this.onUpdateSuccess.emit();
          toastr.success('Updated successfully!');
          this.hide();
        } else {
          toastr.error(result.message ? result.message : '', 'Error');
        }
      });
  }
}
