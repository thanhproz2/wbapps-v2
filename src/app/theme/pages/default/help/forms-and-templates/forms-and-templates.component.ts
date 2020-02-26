import { Component, OnInit } from '@angular/core';
import { ApiUrl } from 'src/app/utils/apiUrl';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-forms-and-templates',
  templateUrl: './forms-and-templates.component.html',
  styles: []
})
export class FormsAndTemplatesComponent implements OnInit {
  downloadTemplates: any = [];
  constructor(private apiUrl: ApiUrl, private commonService: CommonService) {
    this.downloadTemplates = this.commonService.downloadTemplates();
  }

  ngOnInit(): void {}

  download(value: number) {
    window.open(this.apiUrl.download_template.replace('{type}', value));
  }
}
