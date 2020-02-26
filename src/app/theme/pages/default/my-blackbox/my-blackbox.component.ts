import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { UploadService } from 'src/app/services/upload.service';
import { MediaProductService } from 'src/app/services/media-product.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { ScriptLoaderService } from 'src/app/services/script-loader.service';
import { Helpers } from 'src/app/helpers';

declare let mApp: any;

@Component({
  selector: 'app-my-blackbox',
  templateUrl: './my-blackbox.component.html',
  styles: []
})
export class MyBlackboxComponent implements OnInit {
  href = '';
  activated = true;
  masterData: any;
  contentTotal: number;
  collaborationTotal: number;
  marketplaceTotal: number;
  total: any = {
    workspace: 0,
    curation: 0,
    submittedContent: 0,
    collaboration: 0,
    marketplace: 0,
    countCollaborativeContentProjets: 0,
    mediaProducts: 0
  };
  curator = false;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private uploadService: UploadService,
    private mediaProductService: MediaProductService,
    private script: ScriptLoaderService,
    private projectService: ProjectsService
  ) {
    this.masterData = {
      genre: this.commonService.getGenre()
    };
  }

  ngOnInit(): void {
    const self = this;
    mApp.unblockPage();
    self.curator = self.isCurator();
    self.countFootages();
    self.countProjects();
    self.countMediaProducts();
    this.script.loadScripts('body', [
      'assets/default/libs/fileinput.js',
      'assets/default/libs/theme.min.js'
    ], true).then(() => {
      Helpers.setLoading(false);
    });
  }

  isCurator() {
    if (localStorage.getItem('isCurator') === 'true') {
      return true;
    }
    return false;
  }

  countFootages() {
    const self = this;
    self.uploadService.countWorkSpaceFootages().then((result: any) => {
      self.total.workspace = result.countContributeFootages;
      self.total.curation = result.countCurationFootages;
      self.total.submittedContent = result.countContentFootages;
    });
  }

  countProjects() {
    const self = this;
    self.projectService.countProjects().then((result: any) => {
      self.total.collaboration = result.countCollaborationProjects;
      self.total.marketplace = result.countMarketplaceProjects;
      self.total.countCollaborativeContentProjets =
        result.countCollaborativeContentProjets;
    });
  }

  countMediaProducts() {
    this.mediaProductService.countMediaProducts().then((result: any) => {
      if (result.success) {
        this.total.mediaProducts = result.data.mediaProducts;
      }
    });
  }
}
