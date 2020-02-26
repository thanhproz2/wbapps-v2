import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CameraNewComponent } from '../../camera/camera-new/camera-new.component';
import { CameraService } from 'src/app/services/camera.service';
import * as _ from 'underscore';

declare let $: any;
declare let toastr: any;

@Component({
  selector: 'app-camera-change',
  templateUrl: './camera-change.component.html',
  styles: []
})
export class CameraChangeComponent implements OnInit {
  loading: boolean;
  selectedCameraId: any;

  @ViewChild('newCameraModal') newCameraModal: CameraNewComponent;
  @Output() currentCameraEvent = new EventEmitter<any>();
  @Input() cameras: any = [];
  @Input() currentCamera: any = {};
  @Input() footage: any = {};


  constructor(
    private cameraService: CameraService
  ) { }

  ngOnInit() {
    console.log('currentCamera', this.currentCamera);
    this.selectedCameraId = this.currentCamera?.cameraId;
  }

  show() {
    $('#changeCameraModal').modal('show');
  }

  hide() {
    $('#changeCameraModal').modal('hide');
  }

  change(selectedCameraId) {
    console.log(selectedCameraId);
    // Make a request to select the camera
    this.cameraService.selectCameraForFootage(selectedCameraId, this.footage.footageId).then(() => {
      const currentCamera = _.find(this.cameras, item => {
        return item.cameraId === selectedCameraId;
      });
      this.currentCameraEvent.emit(currentCamera);
      toastr.success('Selected successfully!');
    });
  }

  showNewCameraModal() {
    this.newCameraModal.show();
  }

  receiveCameraInfo($event) {
    debugger
    const camera = $event;
    if (camera.default) {
      this.selectedCameraId = camera.cameraId;
      this.change(this.selectedCameraId);
    }
    this.cameras.push($event);
  }

}
