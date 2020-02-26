import { Component, OnInit } from '@angular/core';
import * as Plyr from 'plyr';
import { ApiUrl } from 'src/app/utils/apiUrl';
import { Constants } from 'src/app/utils/constants';

declare let $: any;

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styles: []
})
export class PlayerComponent implements OnInit {
  srcUrl: '';

  constructor(private apiUrl: ApiUrl, private constants: Constants) {}

  ngOnInit(): void {}

  play(footage) {
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
}
