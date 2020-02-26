import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { CameraService } from 'src/app/services/camera.service';
import { Subject } from 'rxjs';
import * as _ from 'underscore';

declare let $: any;
declare let toastr: any;

@Component({
  selector: 'app-camera-new',
  templateUrl: './camera-new.component.html',
  styles: []
})
export class CameraNewComponent implements OnInit {
  cameraInfo: any = {
    cameraType: '',
    cameraBrand: '',
    cameraBrandOther: ''
  };
  cameraTypes: any = [];
  selectedCameraType: any = {};
  loading: boolean;
  defaultCamera = new Subject();

  @Output() cameraInfoEvent = new EventEmitter<any>();
  @Input() memberId: string;

  constructor(
    private commonService: CommonService,
    private cameraService: CameraService
  ) {
    this.cameraTypes = this.commonService.getCameraTypes();
  }

  ngOnInit() {}

  show() {
    this.cameraInfo.cameraType = '';
    this.cameraInfo.cameraBrand = '';
    this.cameraInfo.cameraBrandOther = '';
    $('#newCameraModal').modal('show');
  }

  hide() {
    $('#newCameraModal').modal('hide');
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

  createCamera() {
    this.loading = true;
    const info = {
      memberId: this.memberId ? this.memberId : localStorage.getItem('userid'),
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
        this.cameraInfoEvent.emit(result.data);
        if (result.data.default) {
          this.cameraService.setDefault(result.data);
        }
        toastr.success('Created successfully!');
        this.hide();
      } else {
        toastr.error(result.message ? result.message : '', 'Error');
      }
    });
  }
}
