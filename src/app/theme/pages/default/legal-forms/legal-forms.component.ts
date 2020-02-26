import { Component, OnInit } from '@angular/core';
import { ApiUrl } from 'src/app/utils/apiUrl';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared-service';

declare var $: any;
declare var mApp: any;

@Component({
  selector: 'app-legal-forms',
  templateUrl: './legal-forms.component.html',
  styles: []
})
export class LegalFormsComponent implements OnInit {
  modal: string = '';
  constructor(
    private apiUrl: ApiUrl,
    private location: Location,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    mApp.unblockPage();
    this.sharedService.infoModal$.subscribe(modalName => {
      if (modalName != '') {
        $('body').removeClass('modal-open');
        $('bs-modal-backdrop').removeClass('modal-backdrop fade in show');
        this.modal = modalName;
        console.log(this.modal);
      }
    });
  }

  download(value: number) {
    window.open(this.apiUrl.download_template.replace('{type}', value));
  }

  return() {
    if (this.modal != '') {
      var modal = JSON.parse(this.modal);
      modal.check = true;
      this.sharedService.emitInfoModal(JSON.stringify(modal));
    }
    this.location.back();
  }
}
