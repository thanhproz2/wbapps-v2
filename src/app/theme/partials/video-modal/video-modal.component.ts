import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ApiUrl } from '../../../utils/apiUrl';
import { Constants } from '../../../utils/constants';
import * as Plyr from 'plyr';

declare var plyr: any;
declare var $: any;
@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.component.html',
  styles: []
})
export class VideoModalComponent implements OnInit {
  srcUrl = '';
  @ViewChild('videoModal') videoModal: ModalDirective;
  @ViewChild('videoModalReviewer') videoModalReviewer: ModalDirective;
  constructor(private apiUrl: ApiUrl, private constants: Constants) {}

  ngOnInit() {
    var self = this;
    // self.initializeVideoModal();
  }

  showChildModal(): void {
    this.videoModal.show();
  }

  hideChildModal(): void {
    var video: any = document.getElementById('videoControl');
    video.pause();
    this.videoModal.hide();
  }

  initializeVideoModal() {
    var video: any = document.getElementById('videoControl');
    video.pause();
    video.currentTime = 0;
    while (video.firstChild) {
      video.removeChild(video.firstChild);
    }
  }

  previewFootage(footage: any) {
    const self = this;
    const memberId = localStorage.getItem('userid');
    let url;

    if (footage.footageId) {
      const footageId = footage.footageId;
      url = self.apiUrl.get_footage_video
        .replace('{footageId}', footageId)
        .replace('{memberId}', memberId);
    } else {
      const mediaProductId = footage.mediaProductId;
      url = self.apiUrl.get_media_products_video
        .replace('{mediaProductId}', mediaProductId)
        .replace('{memberId}', memberId);
    }

    self.srcUrl = url;
    $('#playerModal').modal('show');
    const player = new Plyr('#videoControl', self.constants.videoControlsOptions);
    player.restart();
    player.play();
  }

  previewFootagePanel(footage: any) {
    var self = this;
    $('source').remove();
    var footageId = footage.footageId;
    var memberId = localStorage.getItem('userid');
    var url = self.apiUrl.get_footage_video
      .replace('{footageId}', footageId)
      .replace('{memberId}', memberId);
    var source = document.createElement('source');
    source.setAttribute('src', url);

    var video: any = document.getElementById('videoControl');
    video.appendChild(source);

    video.load();
    plyr.setup('video', self.constants.videoControlsOptionsPanel);
    self.showChildModal();
    video.play();
  }

  previewFootageReviewer(footage: any, speed?: number) {
    const self = this;
    let url = '';
    $('source').remove();

    const memberId = localStorage.getItem('userid');

    if (footage.footageId) {
      const footageId = footage.footageId;
      url = self.apiUrl.get_footage_video
        .replace('{footageId}', footageId)
        .replace('{memberId}', memberId);
    } else {
      const mediaProductId = footage.mediaProductId;
      url = self.apiUrl.get_media_products_video
        .replace('{mediaProductId}', mediaProductId)
        .replace('{memberId}', memberId);
    }

    const source = document.createElement('source');
    source.setAttribute('src', url);

    const video: any = document.getElementById('videoControlReviewer');

    video.appendChild(source);

    video.load();
    plyr.setup('.video', self.constants.videoControlsOptions);
    if (speed) {
      video.playbackRate = speed;
    }
    this.videoModalReviewer.show();
    video.play();
  }
}
