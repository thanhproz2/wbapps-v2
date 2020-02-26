import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared-service';
import { MyStudioService } from 'src/app/services/my-studio.service';
import * as _ from 'underscore';

declare let mApp: any;

@Component({
  selector: 'app-my-studio',
  templateUrl: './my-studio.component.html',
  styleUrls: ['./my-studio.component.css']
})
export class MyStudioComponent implements OnInit, DoCheck {
  href: string;
  projects: any = [];
  selectProjectModel: string;
  selectedProject: any = {};
  public queryParams: any = null;
  constructor(
    private router: Router,
    private myStudioService: MyStudioService,
    private sharedService: SharedService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    mApp.blockPage();
    var self = this;
    this.route.queryParams.subscribe(function(params) {
      if (params['projectId']) {
        self.queryParams = params;
      }
    });
    this.myStudioService.getProjects().then((result: any) => {
      console.log(result);
      mApp.unblockPage();
      self.projects = result.data;
      self.sharedService.setCurrentProjects(self.projects);

      if (self.projects.length) {
        if (self.queryParams) {
          console.log('this.queryParams', self.queryParams);
          self.selectProjectModel = self.queryParams.projectId;
          self.selectProject(self.queryParams.projectId);
        } else {
          this.selectProjectModel = this.projects[0].projectId;
          this.projects[0].isOwner = this.isOwner(this.projects[0]);
          console.log('MystudioProjects Init select project', this.projects[0]);
          this.sharedService.setCurrentSelectedProject(this.projects[0]);
        }
      }
    });

    this.sharedService.getCurrentProjects().subscribe(data => {
      this.projects = data;
    });

    this.sharedService.getCurrentSelectedProject().subscribe(data => {
      this.selectedProject = data;
    });
  }

  isOwner(project) {
    return localStorage.getItem('userid') === project.memberId;
  }

  ngDoCheck(): void {
    this.href = this.router.url;
    var tempArrayUrl = this.href.split('/');
    this.href = tempArrayUrl[2];
  }

  getProjects() {
    mApp.blockPage();
    this.myStudioService.getProjects().then((result: any) => {
      console.log(result);
      mApp.unblockPage();
      this.projects = result.data;
    });
  }

  selectProject(projectId) {
    console.log('Select project: ', projectId);
    this.selectedProject = _.find(this.projects, item => {
      return item.projectId == projectId;
    });

    this.selectedProject.isOwner = this.isOwner(this.selectedProject);
    this.sharedService.setCurrentSelectedProject(this.selectedProject);
  }

  createStudioProject() {
    console.log('create project clicked...');
    mApp.blockPage();
    var modal = {
      id: 'studio-project',
      check: true
    };
    this.sharedService.emitInfoModal(JSON.stringify(modal));
    this.router.navigate(['/my-blackbox/my-collaboration']);
  }
}
