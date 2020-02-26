import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BsDatepickerConfig, ModalDirective } from 'ngx-bootstrap';
import { Constants } from 'src/app/utils/constants';
import { CommonService } from 'src/app/services/common.service';
import { AccountService } from 'src/app/services/account.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { ApiUrl } from 'src/app/utils/apiUrl';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/services/shared-service';
import { Utils } from 'src/app/utils/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { MyStudioService } from 'src/app/services/my-studio.service';
import * as moment from 'moment';
import _ from 'underscore';
import { MyBlackboxComponent } from '../my-blackbox.component';
import { RatingComponent } from 'src/app/theme/partials/rating/rating.component';

declare var $: any;
declare var mApp: any;
@Component({
  selector: 'app-my-collaboration',
  templateUrl: './my-collaboration.component.html',
  styleUrls: ['./my-collaboration.component.css']
})
export class MyCollaborationComponent implements OnInit {
  public paging: any = {
    currentPage: 1,
    pageSize: this.constants.pageSize,
    total: 0,
    firstEntry: 0,
    lastEntry: 0,
    count: 0,
    pageSizeList: this.constants.pageSizeList
  };
  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'MM-DD-YYYY',
    containerClass: 'theme-default'
  };
  collaborateFilter: string = '';
  collaborateFilters: any;
  projectStatusFilters: any;
  searchKeyWordsProject: string = '';
  projectFilterStatus: string = '';
  canCreateProject: boolean = true;
  currentProject: any = {};
  currentProjectContent: any = {};
  filters: any = {};
  percentRate: number = 5;
  curatorPercent: number = 0;
  selectedCurator: any = null;
  notShowMessage: boolean = false;
  isEditingProject: boolean = false;
  allowShow: boolean = false;
  manageProjects: any = [];
  searchProjectId: string = '';
  owners: any = [];
  submitOption: any = [];
  projectNameRegex = "^[a-zA-Z0-9 _'.,]{1,}$";
  maxDate: Date = new Date();
  public avatarUrlB: string = this.apiUrl.get_avatar.replace(
    '{defaultType}',
    'B'
  );
  savedOrSubmitted: boolean = false;
  savedOrSubmittedContent: boolean = false;
  savedOrSubmittedContentSave: boolean = false;
  work: any = {
    editing: false,
    exportClips: false,
    grading: false,
    otherProcess: false,
    selects: false,
    metaData: false
  };
  pagingSharer: any = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    count: 0
  };

  pagingCurator = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    count: 0
  };
  partner: any = this.commonService.getPartnerTypes();
  curators: any = [];
  selectedCuratorProject: any = {
    id: ''
  };
  keywordSearch: any = {
    text: ''
  };
  public memberAttributeList: any = [];
  public memberAttribute: string = 'email';
  selectedSharer: any = null;
  rushOrderPercent: number = 5;
  sharers: any = [];
  messagesModal: string = '';
  tempProject: any = {};
  previewingProject: any = {};
  selectedUploadProject: any = {};
  batchName: any = '';
  ftpLink = this.constants.ftpServer;
  collabShareCurator: number = 40;
  isCuratorLoading: boolean = false;
  isSharerLoading: boolean = false;
  listPostingOption: any = [];
  listProjectType: any = [];
  projectType: string;
  statusHelp: boolean = false;
  first: boolean = false;
  collaborators: any = [];
  listSelectCollaboratiorType: any;
  maxIndicateNumber: number;
  disabledSharingPercentage: boolean = false;
  canActive: boolean = JSON.parse(localStorage.getItem('canActive'));
  canReminder: boolean = false;
  notShowNotice: boolean = false;
  notShowNoticeMetadataOption: boolean = false;
  checkModalShow: boolean = false;
  sub: any;
  ownerInfo: any;
  maxDeadline: any;
  currentModalInfo: any = {};
  public numberRating: number = 0;
  public projectRating: any = null;
  public curatorRating: any = null;
  public commentRating: any = '';
  public listCuratorRated: any = [];
  @ViewChild('projectCreation') projectCreation: ModalDirective;
  @ViewChild('projects') projects: ModalDirective;
  @ViewChild('curatorUpload') curatorUpload: ModalDirective;
  @ViewChild('sharersUpload') sharersUpload: ModalDirective;
  @ViewChild('messageModal') messageModal: ModalDirective;
  @ViewChild('messageSubmitModal') messageSubmitModal: ModalDirective;
  @ViewChild('showProjectModal') showProjectModal: ModalDirective;
  @ViewChild('fileUploadFootageModal') fileUploadFootageModal: ModalDirective;
  @ViewChild('uploadProjectContentModal')
  uploadProjectContentModal: ModalDirective;
  @ViewChild('showFTPModal') showFTPModal: ModalDirective;
  @ViewChild('projectsType') projectsType: ModalDirective;
  @ViewChild('collaborationProject') collaborationProject: ModalDirective;
  @ViewChild('collaboratorsModal') collaboratorsModal: ModalDirective;
  @ViewChild('showProjectModalContent') showProjectModalContent: ModalDirective;
  @ViewChild('confirm') confirm: ModalDirective;
  @ViewChild('notice') notice: ModalDirective;
  @ViewChild('noticeMetadataOption') noticeMetadataOption: ModalDirective;
  @ViewChild('search') search: ElementRef;
  @ViewChild('searchCurator') searchCurator: ElementRef;
  @ViewChild('searchSharers') searchSharers: ElementRef;
  @ViewChild('ratingModal') public ratingModal: RatingComponent;
  constructor(
    private constants: Constants,
    private commonService: CommonService,
    private accountService: AccountService,
    private authenticateService: AuthenticateService,
    private projectsService: ProjectsService,
    private apiUrl: ApiUrl,
    private toastr: ToastrService,
    private myBlackboxComponent: MyBlackboxComponent,
    // private frontpageComponent: FrontpageComponent,
    private sharedService: SharedService,
    private utils: Utils,
    private route: ActivatedRoute,
    private myStudioService: MyStudioService,
    private router: Router
  ) {
    this.collaborateFilters = commonService.getCollaborateFilter();
    this.projectStatusFilters = commonService.getProjectStatus();
    this.submitOption = commonService.getProjectSubmitOptions();
    this.listPostingOption = commonService.getPostingOption();
    this.listProjectType = commonService.getProjectType();
    this.listSelectCollaboratiorType = commonService.getSelectCollaboratorType();
    this.maxIndicateNumber = constants.maxIndicateNumber;
    this.maxDeadline = moment().add(10, 'days');
    this.maxDeadline = new Date(this.maxDeadline);
    console.log('maxDeadline', this.maxDeadline);
    this.memberAttributeList = commonService.getMemberSearchAttributes();
  }

  ngOnInit() {
    var self = this;
    self.first = true;
    setTimeout(() => {
      self.sharedService.infoModal$.subscribe(modalName => {
        if (modalName != '') {
          var modal = JSON.parse(modalName);
          console.log('ngOnInit: ', modal);
          if (modal && modal.id == 'projects' && modal.check) {
            self.checkModalShow = true;
            self.createProjectSuggestion();
          }

          if (modal && modal.id == 'studio-project' && modal.check) {
            self.checkModalShow = true;
            self.currentModalInfo = modal;
            self.collaborativeContentProjectSuggestion();
          }
        }
      });
    }, 100);
    this.route.queryParams.subscribe(data => {
      if (data.collaborateFilter) {
        self.collaborateFilter = data.collaborateFilter;
      }

      if (data.projectFilterStatus) {
        self.projectFilterStatus = data.projectFilterStatus;
      }

      if (data.projectId) {
        self.searchProjectId = data.projectId;
      }
    });
    self.initialize();
  }

  ngOnDestroy() {
    console.log('ngOnDestroy My Collaboration');
    this.sharedService.emitInfoModal('');
  }

  createProjectSuggestion() {
    var self = this;
    self.isEditingProject = false;
    self.currentProject = {};
    self.currentProject.projectStartDate = new Date();
    self.currentProject.projectLocation = localStorage.getItem('location');
    self.currentProject.submitOption = 'private';
    self.currentProject.curator = null;
    self.currentProject.sharers = [];
    self.currentProject.notes = '';
    self.currentProject.projectName = '';
    self.currentProject.ProjectCuration = {};
    self.currentProject.submitOption = 'private';
    self.currentProject.sharingPercentage = 40;
    self.tempProject = {};
    self.updateCuratorPercent();
    self.currentProject.projectId = self.generateUUID();
    self.currentProject.ProjectCuration.metadataStatus = true;
    self.currentProject.ProjectCuration.metadataTaggingOption = 'only curation';
    self.selectedCurator = null;
    self.projectType = 'curation project';
    self.statusHelp = false;
    console.log(self.currentProject);
    self.projects.show();
  }

  collaborativeContentProjectSuggestion() {
    var self = this;
    self.currentProjectContent = {};
    self.currentProjectContent.projectId = self.generateUUID();
    self.currentProjectContent.projectDeadline = this.maxDeadline;
    self.currentProjectContent.projectStartDate = new Date();
    self.currentProjectContent.projectEndDate = new Date();
    self.currentProjectContent.projectEndDate.setMonth(
      self.currentProjectContent.projectEndDate.getMonth() + 1
    );
    self.currentProjectContent.projectLocation = localStorage.getItem(
      'location'
    );
    self.currentProjectContent.topic = '';
    self.currentProjectContent.projectName = '';
    self.currentProjectContent.sharers = [];
    self.currentProjectContent.detailSummary = '';
    self.currentProjectContent.status = 'pending';
    self.currentProjectContent.selectCollaboratorsType = 'indicate number';
    self.currentProjectContent.numberCollaborators =
      self.constants.defaultIndicateNumber;
    self.currentProjectContent.projectType = 'collaborative content project';
    self.currentProject.projectType = 'collaborative content project';
    self.updateCuratorPercent();
    self.collaborationProject.show();
    self.projectType = 'collaborative content project';
  }

  showHelpModal() {
    $('#help-project-coll-modal').modal('show');
  }

  openCreateProject() {
    var self = this;
    self.isEditingProject = false;
    self.currentProject = {};
    self.currentProject.projectStartDate = new Date();
    self.currentProject.projectLocation = localStorage.getItem('location');
    self.currentProject.submitOption = 'private';
    self.currentProject.curator = null;
    self.currentProject.sharers = [];
    self.currentProject.notes = '';
    self.currentProject.projectName = '';
    self.currentProject.ProjectCuration = {};
    self.currentProject.submitOption = 'private';
    self.currentProject.sharingPercentage = 40;
    self.tempProject = {};
    // self.currentProject.curator.collabShare = 40;
    self.updateCuratorPercent();
    self.currentProject.projectId = self.generateUUID();
    self.currentProjectContent = {};
    self.currentProjectContent.projectDeadline = this.maxDeadline;
    self.currentProjectContent.projectStartDate = new Date();
    self.currentProjectContent.projectEndDate = new Date();
    self.currentProjectContent.projectEndDate.setMonth(
      self.currentProjectContent.projectEndDate.getMonth() + 1
    );
    self.currentProjectContent.projectLocation = localStorage.getItem(
      'location'
    );
    self.currentProjectContent.topic = '';
    self.currentProjectContent.projectName = '';
    self.currentProjectContent.sharers = [];
    self.currentProjectContent.detailSummary = '';
    // self.currentProject.curator.collabShare = 40;
    self.updateCuratorPercent();
    self.currentProjectContent.projectId = self.generateUUID();
    self.currentProjectContent.status = 'pending';
    self.selectedCurator = null;
    self.projectType = 'curation project';
    self.statusHelp = false;
    self.currentProjectContent.selectCollaboratorsType = 'indicate number';
    self.currentProjectContent.numberCollaborators =
      self.constants.defaultIndicateNumber;
    var user: any = JSON.parse(
      localStorage.getItem(self.accountService.getUserId())
    );
    if (user && user.readProjectCreation) {
      self.notShowMessage = true;
      self.projectsType.show();
    } else {
      self.notShowMessage = false;
      // self.allowShowCheckbox = true;
      self.projectCreation.show();
    }
  }

  updateCuratorPercent() {
    var self = this;
    if (self.currentProject.curator) {
      self.curatorPercent = self.currentProject.curator.collabShare;
    }
  }

  generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
      c
    ) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  saveLocalProjectCreation() {
    var self = this;
    if (self.notShowMessage) {
      var userLocal: any = {};
      var currentUserLocal: any = JSON.parse(
        localStorage.getItem(self.accountService.getUserId())
      );
      if (currentUserLocal) {
        userLocal = currentUserLocal;
      }
      userLocal.readProjectCreation = true;
      self.authenticateService.saveByUser(JSON.stringify(userLocal));
    }
    self.projectCreation.hide();
    if (!self.statusHelp) {
      self.projectsType.show();
    }
  }

  checkProjectType() {
    this.projectsType.hide();
    if (this.projectType == 'curation project') {
      this.projects.show();
    } else {
      if (!this.canActive) {
        return this.toastr.info('The feature is comming soon!', 'Information');
      }
      this.collaborationProject.show();
    }
  }

  backProjectType() {
    this.projects.hide();
    this.collaborationProject.hide();
    this.closeProjectModal();
    this.projectsType.show();
  }

  openProjectCreationModal() {
    this.statusHelp = true;
    this.projectCreation.show();
  }

  isBroker() {
    if (localStorage.getItem('isBroker') == 'true') {
      return true;
    }
    return false;
  }

  initialize() {
    var self = this;
    self.loadProjects();
    if (self.isBroker()) {
      self.loadOwners();
    }
  }

  loadProjects() {
    var self = this;
    mApp.blockPage();
    self.allowShow = false;

    self.projectsService
      .getProjects(
        (self.paging.currentPage - 1) * self.paging.pageSize + 1,
        self.paging.pageSize,
        self.searchKeyWordsProject,
        self.collaborateFilter,
        self.projectFilterStatus,
        self.searchProjectId
      )
      .then((result: any) => {
        console.log(result);
        mApp.unblockPage();
        if (self.first) {
          self.checkProjectComplete(result.list);
        }
        self.manageProjects = result.list;
        self.allowShow = !self.manageProjects.length ? true : false;
        self.manageProjects = self.changeCuratorApprovalStatus(
          self.manageProjects
        );
        self.paging.total = result.pageInfo.totalRecords;
        self.paging.count = result.pageInfo.totalDisplayRecords;
        self.manageProjects.forEach(element => {
          if (element.projectType == 'collaborative content project') {
            element.collaborators = element.sharers;
            element.collaborators.forEach(item => {
              item.fullName = item.name;
            });
          }

          if (
            element.projectType == 'collaborative content project' &&
            element.status !== 'pending'
          ) {
            // Get team members
            this.myStudioService
              .getTeamMembers(element.projectId)
              .subscribe(data => {
                console.log(data);
                mApp.unblockPage();
                element.collaborators = data.data;
              });
          }
        });
      });

    self.myBlackboxComponent.countProjects();
    self.myBlackboxComponent.countFootages();
    self.myBlackboxComponent.countMediaProducts();
  }

  filterProjects() {
    this.paging.currentPage = 1;
    this.loadProjects();
  }

  checkProjectComplete(list: any[]) {
    this.first = false;
    var listComplete = _.filter(list, item => {
      return item.status == 'completed';
    });

    listComplete = _.pluck(listComplete, 'projectName');

    if (listComplete.length == 1) {
      var array = listComplete.toString();
      this.toastr.warning(
        'The project (' +
          array +
          ') has been completed. Please delete it to clean up your MY COLLABORATION area.',
        'Warning'
      );
    }

    if (listComplete.length > 1) {
      var array = listComplete.toString();
      array = array.split(',').join(', ');
      console.log(array);
      this.toastr.warning(
        'The projects (' +
          array +
          ') have been completed. Please delete them to clean up your MY COLLABORATION area.',
        'Warning'
      );
    }
  }

  changeCuratorApprovalStatus(projects) {
    var self = this;
    projects.forEach(project => {
      if (project.curator) {
        if (project.curator.approvalStatus == 'denied') {
          project.curator.approvalStatusName = 'declined';
        } else {
          if (
            project.curator.approvalStatus == 'approved' &&
            project.curationCompletion == 'yes'
          ) {
            project.curator.approvalStatusName = 'completed';
          } else {
            project.curator.approvalStatusName = project.curator.approvalStatus;
          }
        }

        if (project.curator.approvalStatus == 'cleared') {
          project.curator.approvalStatusName = 'completed';
        }
      }
    });
    return projects;
  }

  loadOwners() {
    var self = this;
    self.projectsService.getOwnerList().then(result => {
      self.owners = result;
    });
  }

  notSubmit(project) {
    return true;
  }

  canEdit(project) {
    if (project.status == 'pending') {
      return true;
    }
    return false;
  }

  canSubmit(project) {
    if (project.projectType === 'collaborative content project') {
      var canSubmit =
        project.projectStartDate &&
        project.projectEndDate &&
        project.topic &&
        project.projectLocation &&
        project.detailSummary &&
        project.status === 'pending';
      return canSubmit;
    }

    if (
      (((project.status == 'pending' || project.uploadType == 'physical') &&
        project.curator) ||
        (project.submitOption == 'marketplace' &&
          project.status == 'pending')) &&
      (project.ProjectCuration.edittingStatus ||
        project.ProjectCuration.metadataStatus)
    ) {
      return true;
    }
    return false;
  }

  canDelete(project) {
    if (this.getUserId() == project.memberId) {
      // if (project.curator && project.curator.approvalStatus == 'approved' && project.curationCompletion != 'yes') {
      //     return false;
      // }
      return true;
    }
    return false;
  }

  canUpload(project) {
    if (
      project.projectType === 'collaborative content project' &&
      project.memberId === this.getUserId() &&
      project.status === 'committed'
    ) {
      return true;
    }

    if (
      project.projectType === 'curation project' &&
      project.ProjectCuration &&
      !project.ProjectCuration.edittingStatus &&
      project.ProjectCuration.metadataStatus &&
      project.ProjectCuration.metadataTaggingOption
    ) {
      if (project.memberId === this.getUserId()) {
        var canUpload =
          project.status === 'committed' &&
          project.ProjectCuration.metadataTaggingOption == 'only curation';
      } else {
        var canUpload =
          project.status === 'committed' &&
          project.ProjectCuration.metadataTaggingOption == 'none';
      }
      return canUpload;
    }

    if (project.curationCompletion === 'yes') {
      return false;
    }
    if (project.curator) {
      if (this.getUserId() === project.curator.id) {
        if (project.status === 'committed') {
          return true;
        }
      }
    }
    return false;
  }

  getUserId() {
    return localStorage.getItem('userid');
  }

  canDownload(project) {
    if (project.hasFootages) {
      return false;
    }
    if (project.pathName) {
      if (project.curator) {
        if (this.getUserId() === project.curator.id) {
          if (project.status !== 'completed') {
            return true;
          }
        } else {
          return false;
        }
      }
    }
    return false;
  }

  canChat(project) {
    var canChat = false;

    if (project.projectType === 'curation project') {
      canChat =
        project.curator &&
        project.curator.ownerApprovalStatus === 'approved' &&
        project.status !== 'pending' &&
        project.status !== 'completed' &&
        (project.memberId !== this.getUserId() || project.curator.id);

      if (project.submitOption == 'marketplace') {
        canChat = project.status == 'committed';
      }
    }

    if (project.projectType === 'collaborative content project') {
      canChat =
        project.memberId !== this.getUserId() && project.status === 'committed';
    }

    return canChat;
  }

  canComplete(project) {
    if (
      this.getUserId() == project.memberId &&
      project.projectType === 'curation project' &&
      project.status == 'committed' &&
      (project.allFootagesSubmitted === true ||
        project.curationCompletion === 'yes')
    ) {
      return true;
    }

    if (
      this.getUserId() == project.memberId &&
      project.projectType === 'collaborative content project' &&
      project.status == 'committed' &&
      project.allMediaProductsSubmitted
    ) {
      return true;
    }

    return false;
  }

  requestCurator(project) {
    var self = this;
    self.collabShareCurator = 40;
    if (
      !project.ProjectCuration.edittingStatus &&
      !project.ProjectCuration.metadataStatus
    ) {
      return self.toastr.warning(
        'Please select the work (instructions) you want to curator perform on you content.',
        'Warning'
      );
    } else {
      if (
        project.ProjectCuration.edittingStatus &&
        project.ProjectCuration.metadataStatus
      ) {
        self.collabShareCurator = 40;
      } else {
        self.collabShareCurator = 20;
      }
    }
    self.keywordSearch.text = '';
    self.curators = [];
    self.isCuratorLoading = true;
    self.projectsService
      .getPartners(
        self.pagingSharer.currentPage * self.pagingSharer.pageSize +
          1 -
          self.pagingSharer.pageSize,
        self.pagingSharer.pageSize,
        self.partner.curator,
        '',
        self.currentProject.memberId
      )
      .then(
        (result: any) => {
          console.log(result);
          self.isCuratorLoading = false;
          if (result.status == 400) {
            return;
          }
          self.projects.hide();
          self.curators = result.list;
          self.allowShow = !self.curators.length ? true : false;
          self.pagingCurator.total = result.pageInfo.totalRecords;
          self.pagingCurator.count = result.pageInfo.totalDisplayRecords;
          console.log(self.currentProject);
          if (self.currentProject.curator) {
            self.selectedCuratorProject.id = self.currentProject.curator.id;
          }
          self.checkCurators();
          setTimeout(() => {
            self.curatorUpload.show();
          }, 200);
        },
        err => {
          self.toastr.error('Error');
          self.isCuratorLoading = false;
        }
      );
  }

  checkCurators() {
    var self = this;
    var currentCurator = self.selectedCurator;
    var percent = self.collabShareCurator;

    if (self.curators) {
      for (var i = 0; i < self.curators.length; i++) {
        if (currentCurator) {
          if (self.curators[i].id == currentCurator.id) {
            self.curators[i].collabShare = currentCurator.collabShare;
          } else {
            self.curators[i].collabShare = percent;
          }
        } else {
          self.curators[i].collabShare = percent;
        }
      }
    }
    console.log(self.curators);
  }

  loadCurators() {
    var self = this;
    var blockId = '#m_blockui_curators_content';
    mApp.block(blockId);
    self.projectsService
      .getPartners(
        self.pagingCurator.currentPage * self.pagingCurator.pageSize +
          1 -
          self.pagingCurator.pageSize,
        self.pagingCurator.pageSize,
        self.partner.curator,
        self.keywordSearch.text,
        self.currentProject.projectId,
        self.memberAttribute
      )
      .then((result: any) => {
        if (result) {
          self.curators = result.list;
          self.allowShow = !self.curators.length ? true : false;
          self.pagingCurator.total = result.pageInfo.totalRecords;
          self.pagingCurator.count = result.pageInfo.totalDisplayRecords;
          self.checkCurators();
          mApp.unblock(blockId);
        }
      });
  }

  filterCurators(keyword) {
    var self = this;
    self.pagingSharer.currentPage = 1;
    self.loadCurators();
  }

  pageCuratorChanged(currentPage: any) {
    if (this.pagingCurator.currentPage === currentPage.page) {
      return;
    }
    this.pagingCurator.currentPage = currentPage.page;
    this.loadCurators();
  }

  selectCurator(curator) {
    var self = this;
    self.selectedCurator = curator;
    self.selectedCuratorProject.id = curator.id;
    console.log(self.selectedCurator);
  }

  changePercentCurator(curator) {
    if (this.selectedCurator && this.selectedCurator.id == curator.id) {
      this.selectedCurator.collabShare = curator.collabShare;
    }
  }

  page(currentPage: any) {
    var self = this;
    if (self.paging.currentPage == currentPage.page) {
      return;
    }
    self.paging.currentPage = currentPage.page;
    self.loadProjects();
  }

  subModalCloseSubmit() {
    var self = this;
    self.pagingSharer.currentPage = 1;
    self.keywordSearch = {
      text: ''
    };
    self.selectedCuratorProject.id = '';
    this.sharersUpload.hide();
    this.curatorUpload.hide();
    if (self.projectType != 'curation project') {
      if (self.currentProjectContent.sharers == null)
        self.selectedSharer = null;

      self.collaborationProject.show();
    } else {
      self.selectedCurator = self.currentProject.curator;
      if (self.currentProject.curator == null) self.selectedCurator = null;

      if (self.currentProject.sharers == null) self.selectedSharer = null;

      this.projects.show();
    }
  }

  removeCurator() {
    this.selectedCuratorProject.id = '';
    this.currentProject.curator = null;
  }

  saveCurator() {
    var self = this;
    if (self.selectedCuratorProject.id == '') {
      return self.toastr.warning('Please select curator.', 'Warning');
    }
    if (self.selectedCurator.id && !self.selectedCurator.name) {
      self.selectedCurator.name =
        self.selectedCurator.firstName + ' ' + self.selectedCurator.lastName;
    }
    if (self.selectedCurator.id && !self.selectedCurator.collabShare) {
      self.selectedCurator.collabShare = 40;
    } else {
      if (self.curators) {
        for (var i = 0; i < self.curators.length; i++) {
          if (self.selectedCurator.id == self.curators[i].id) {
            self.selectedCurator.collabShare = self.curators[i].collabShare;
            break;
          }
        }
      }
    }

    self.currentProject.curator = self.selectedCurator;
    if (self.currentProject.rushOrder) {
      var currentPercent = self.currentProject.curator.collabShare;
      currentPercent = currentPercent + self.rushOrderPercent;
      self.curatorPercent = currentPercent;
      self.currentProject.curator.collabShare = self.curatorPercent;
    }

    self.updateCuratorPercent();

    $('#curator-upload-modal').modal('hide');
    self.subModalCloseSubmit();
  }

  removeSharer() {
    this.currentProject.sharers = [];
  }

  removeSharerContent() {
    this.currentProjectContent.sharers = [];
  }

  requestSharer() {
    var self = this;
    self.allowShow = false;
    self.selectedSharer = [];
    self.isSharerLoading = true;
    if (self.projectType != 'curation project') {
      if (
        self.currentProjectContent.sharers &&
        self.currentProjectContent.sharers.length
      ) {
        self.selectedSharer = self.currentProjectContent.sharers;
        self.selectedSharer = _.map(self.selectedSharer, item => {
          item.fullName = item.name;
          return item;
        });
      }
    } else {
      if (self.currentProject.sharers && self.currentProject.sharers.length) {
        self.selectedSharer = self.currentProject.sharers;
        self.selectedSharer = _.map(self.selectedSharer, item => {
          item.fullName = item.name;
          return item;
        });
      }
    }
    self.projectsService
      .getPartners(
        (self.pagingSharer.currentPage - 1) * self.pagingSharer.pageSize + 1,
        self.pagingSharer.pageSize,
        self.partner.sharer,
        '',
        self.currentProject.memberId
      )
      .then(
        (result: any) => {
          self.isSharerLoading = false;
          if (result.status == 400) {
            return;
          }
          self.projects.hide();
          self.collaborationProject.hide();
          self.sharers = result.list;
          self.allowShow = !self.sharers.length ? true : false;
          self.pagingSharer.total = result.pageInfo.totalRecords;
          self.pagingSharer.count = result.pageInfo.totalDisplayRecords;
          self.sharers = self.keepSharers(
            self.sharers,
            self.selectedSharer,
            self.pagingSharer.total,
            self.pagingSharer.count,
            self.pagingSharer.pageSize
          );
          self.checkSharers();
          self.sharers.forEach(element => {
            if (element.disabledSharingPercentage == undefined) {
              element.disabledSharingPercentage = false;
            }
          });
          setTimeout(() => {
            if (self.projectType != 'curation project') {
              self.disabledSharingPercentage = false;
            } else {
              self.disabledSharingPercentage = true;
            }
            self.sharersUpload.show();
          }, 200);
        },
        err => {
          self.toastr.error('Error');
          self.isSharerLoading = false;
        }
      );
  }

  loadSharers() {
    var self = this;
    var blockId = '#m_blockui_sharers_content';
    mApp.block(blockId);
    self.projectsService
      .getPartners(
        (self.pagingSharer.currentPage - 1) * self.pagingSharer.pageSize + 1,
        self.pagingSharer.pageSize,
        self.partner.sharer,
        self.keywordSearch.text,
        self.currentProject.memberId,
        self.memberAttribute
      )
      .then((result: any) => {
        console.log(result);
        if (result) {
          self.sharers = result.list;
          self.allowShow = !self.sharers.length ? true : false;
          self.pagingSharer.total = result.pageInfo.totalRecords;
          self.pagingSharer.count = result.pageInfo.totalDisplayRecords;
          self.sharers = self.keepSharers(
            self.sharers,
            self.selectedSharer,
            self.pagingSharer.total,
            self.pagingSharer.count,
            self.pagingSharer.pageSize
          );
          self.checkSharers();
          mApp.unblock(blockId);
        }
      });
  }

  pageSharerChanged(currentPage: any) {
    if (this.pagingSharer.currentPage === currentPage.page) {
      return;
    }
    this.pagingSharer.currentPage = currentPage.page;
    this.loadSharers();
  }

  keepSharers(sharers, selectedSharers, total, count, pageSize) {
    var self = this;
    var originalLength = sharers.length;
    if (selectedSharers && selectedSharers.length) {
      _.each(self.selectedSharer, function(sharer) {
        sharers = _.reject(sharers, function(item) {
          return sharer.id == item.id;
        });
      });
      sharers = selectedSharers.concat(sharers);
      var diff = sharers.length - originalLength;
      self.pagingSharer.total = total + diff;
      self.pagingSharer.count = count + diff;
      self.pagingSharer.pageSize = pageSize + diff;
    }
    return sharers;
  }

  checkSharers() {
    var self = this;
    var currentSharers = self.selectedSharer;
    if (self.sharers) {
      for (var i = 0; i < self.sharers.length; i++) {
        if (currentSharers) {
          var exist = false;
          for (var j = 0; j < currentSharers.length; j++) {
            if (self.sharers[i].id == currentSharers[j].id) {
              self.sharers[i].isSelected = true;
              self.sharers[i].collabShare = currentSharers[j].collabShare;
              if (self.sharers[i].collabShare == null) {
                self.sharers[i].disabledSharingPercentage = true;
              }
              exist = true;
              break;
            }
          }
          if (exist == false) {
            self.sharers[i].collabShare = 15;
          }
        } else {
          self.sharers[i].collabShare = 15;
        }
      }
    }
  }

  filterSharers(keyword) {
    var self = this;
    self.pagingSharer.currentPage = 1;
    self.loadSharers();
  }

  saveSharer() {
    var self = this;
    var duplicated = false;
    self.selectedSharer = _.map(self.selectedSharer, item => {
      if (
        self.currentProject.curator &&
        self.currentProject.curator.id === item.id
      ) {
        duplicated = true;
      }
      if (item.name) {
        return item;
      } else {
        item.name = item.fullName;
        return item;
      }
    });
    console.log(self.selectedSharer);
    if (duplicated) {
      self.messagesModal =
        'Apparently, you already selected and provided the sharing percentage for [' +
        self.currentProject.curator.fullName +
        '] as a curator, do you still want to add additional sharing percentage?';
      self.messageModal.show();
    } else {
      if (self.projectType != 'curation project') {
        var existedPercentageTBD = _.find(self.sharers, item => {
          return item.disabledSharingPercentage === true;
        });

        if (existedPercentageTBD) {
          var checkToWarning = _.some(self.selectedSharer, item => {
            return existedPercentageTBD.id === item.id;
          });

          if (!checkToWarning) {
            return self.toastr.warning(
              'Please select the collaborator(s) before Saving.',
              'Warning'
            );
          }
        }
        self.currentProjectContent.sharers = self.selectedSharer;
        self.currentProjectContent.sharers.forEach(element => {
          if (element.disabledSharingPercentage) {
            element.collabShare = null;
            element.isChangeDiscussed = false;
          } else {
            element.isChangeDiscussed = true;
          }
        });
      } else {
        self.currentProject.sharers = self.selectedSharer;
      }
      self.sharersUpload.hide();
      self.subModalCloseSubmit();
    }
  }

  yesConfirmModal() {
    this.currentProject.sharers = this.selectedSharer;
    this.messageModal.hide();
    this.subModalCloseSubmit();
  }

  selectSharer(sharer) {
    if (sharer.isSelected) {
      this.selectedSharer.push(sharer);
    } else {
      this.selectedSharer = _.reject(this.selectedSharer, function(item) {
        return item.id == sharer.id;
      });
    }
    console.log(this.selectedSharer);
  }

  createProject(project: any, submit: boolean) {
    var self = this;
    var totalPercent = 0;
    project.projectType = self.projectType;
    var user: any = JSON.parse(
      localStorage.getItem(self.accountService.getUserId())
    );
    if (user && user.notShowNotice) {
      self.notShowNotice = true;
    } else {
      self.notShowNotice = false;
    }

    if (user && user.notShowNoticeMetadataOption) {
      self.notShowNoticeMetadataOption = true;
    } else {
      self.notShowNoticeMetadataOption = false;
    }
    if (self.projectType == 'curation project') {
      if (!project.ProjectCuration.edittingStatus) {
        project.ProjectCuration.selectsStatus = false;
        project.ProjectCuration.gradingStatus = false;
        project.ProjectCuration.otherProcessStatus = false;
        project.ProjectCuration.exportClipsStatus = false;
      }
      if (project.submitOption == 'marketplace') {
        if (submit) {
          if (
            !project.ProjectCuration.edittingStatus &&
            !project.ProjectCuration.metadataStatus
          ) {
            return self.toastr.warning(
              'Please select the work (instructions) you want to curator perform on you content.',
              'Warning'
            );
          }
        }
        totalPercent = project.sharingPercentage;
        project.curator = null;
      } else {
        project.sharingPercentage = null;
        if (submit) {
          if (
            !project.ProjectCuration.edittingStatus &&
            !project.ProjectCuration.metadataStatus
          ) {
            return self.toastr.warning(
              'Please select the work (instructions) you want to curator perform on you content.',
              'Warning'
            );
          }
        }
        if (project.curator) {
          totalPercent = totalPercent + project.curator.collabShare;
        } else {
          if (submit) {
            return self.toastr.warning('Please pick a curator.', 'Warning');
          }
        }
      }
    }
    if (project.sharers.length) {
      for (var i = 0; i < project.sharers.length; i++) {
        if (project.sharers[i].collabShare == 0) {
          return self.toastr.error(
            'The sharer percentage must be at least 1% and no more than 99%.',
            'Error'
          );
        }
        totalPercent = totalPercent + project.sharers[i].collabShare;
      }
    }

    if ((project.sharers && project.sharers.length) || project.curator) {
      if ((totalPercent > 99 || totalPercent < 1) && totalPercent != 0) {
        return self.toastr.error(
          'The total percentage must be at least 1% and no more than 99%.',
          'Error'
        );
      }
    }
    if (
      project.selectCollaboratorsType == 'indicate number' &&
      project.projectType != 'curation project'
    ) {
      if (
        project.numberCollaborators < 0 ||
        project.numberCollaborators > self.maxIndicateNumber ||
        project.numberCollaborators == null
      ) {
        return self.toastr.error(
          'The indicate number of collaborators must be at least 1 and no more than ' +
            self.maxIndicateNumber,
          'Error'
        );
      }
      project.sharers = project.numberCollaborators;
    }

    if (
      project.selectCollaboratorsType == 'sharing percentage' &&
      project.sharers &&
      !project.sharers.length
    ) {
      return self.toastr.warning('Please select collaborators!', 'Warning');
    }

    if (submit) {
      self.tempProject = project;
      self.messageSubmitModal.show();
    } else {
      console.log(project);
      self.projectsService
        .createProject(project, submit)
        .then((result: any) => {
          result = result.json();
          if (result.success) {
            self.currentModalInfo = {};
            if (self.projectType == 'curation project') {
              if (self.isEditingProject)
                self.toastr.success('Updated project successfully!', 'Success');
              else {
                self.toastr.success(
                  'Created project successfully! <br>The project is available in MY COLLABORATION area. Please complete the project details and/or do the final submission.',
                  'Success',
                  {
                    enableHtml: true
                  }
                );

                if (
                  !self.notShowNotice &&
                  project.ProjectCuration.edittingStatus &&
                  !project.ProjectCuration.metadataStatus
                ) {
                  self.notice.show();
                }

                if (
                  !self.notShowNoticeMetadataOption &&
                  project.ProjectCuration.metadataStatus &&
                  project.ProjectCuration.metadataTaggingOption ===
                    'only curation'
                ) {
                  self.noticeMetadataOption.show();
                }
              }
            } else {
              // Collaborative content project
              if (self.isEditingProject)
                self.toastr.success('Updated project successfully!', 'Success');
              else {
                self.toastr.success(
                  'Created project successfully! <br>The project is available in MY COLLABORATION area. Please complete the project details and/or do the final submission.',
                  'Success',
                  {
                    enableHtml: true
                  }
                );
              }
            }
            self.isEditingProject = false;
            if (self.projectType == 'curation project') {
              self.projects.hide();
            } else {
              self.collaborationProject.hide();
            }

            self.closeProjectModal();
            self.loadProjects();
          } else {
            if (result.message) {
              self.toastr.error(result.message, 'Error');
            } else {
              self.toastr.error('Creating project failed!', 'Error');
            }
          }
        });
    }
  }

  yesSubmitConfirmModal() {
    var self = this;
    self.messageSubmitModal.hide();
    self.projectsService
      .createProject(self.tempProject, true)
      .then((result: any) => {
        result = result.json();
        if (result.success) {
          self.currentModalInfo = {};
          if (self.projectType == 'curation project') {
            var msg = '';
            if (self.tempProject.submitOption === 'private') {
              var msg =
                ' Your project is sent to ' +
                self.tempProject.curator.name +
                ' for consideration.<br>';
            }

            if (
              self.tempProject.ProjectCuration.edittingStatus &&
              !self.tempProject.ProjectCuration.metadataStatus
            ) {
              self.toastr.success(
                'Submitted project successfully!<br>' +
                  msg +
                  'The project is available in MARKETPLACE area. <br> Please note that your curated content will be uploaded by the curator into your workspace, and you then need to do your own meta-data tagging or assign another curator for this task.',
                'Success',
                {
                  enableHtml: true
                }
              );
            } else if (
              self.tempProject.ProjectCuration.metadataStatus &&
              self.tempProject.ProjectCuration.metadataTaggingOption ===
                'only curation'
            ) {
              self.toastr.success(
                'Submitted project successfully!<br>' +
                  msg +
                  'The project is available in MARKETPLACE area. <br> Please note that you either upload the content to the project folder on the FTP site (which will be assigned to the agreed curator automatically) or use the already-uploaded content to assign to the curator once that curator agrees to work on the project.',
                'Success',
                {
                  enableHtml: true
                }
              );
            } else {
              self.toastr.success(
                'Submitted project successfully!<br>' +
                  msg +
                  'The project is available in MARKETPLACE area.',
                'Success',
                {
                  enableHtml: true
                }
              );
            }
          } else {
            self.toastr.success(
              'Submitted project successfully! <br> The project is available in MARKETPLACE area.',
              'Success',
              {
                enableHtml: true
              }
            );
          }
          self.isEditingProject = false;
          if (self.projectType == 'curation project') {
            self.projects.hide();
            self.closeProjectModal();
          } else {
            self.closeProjectModal();
            self.collaborationProject.hide();
          }
          self.loadProjects();
        } else {
          if (result.message) {
            self.toastr.error(result.message, 'Error');
          } else {
            self.toastr.error('Creating project failed!', 'Error');
          }
        }
      });
  }

  deleteProject(project) {
    var self = this;
    var projectIds = [project.projectId];
    project.deleting = true;
    self.projectsService.deleteProjects(projectIds).then((result: any) => {
      project.deleting = false;
      if (result && result.status == 204) {
        self.toastr.success('Deleted project success!', 'Success');
        self.loadProjects();
      } else {
        self.toastr.error('Deleted project failed!', 'Error');
      }
    });
  }

  editProject(project) {
    console.log(project);
    var self = this;
    self.isEditingProject = true;
    var temp: any = {};
    self.projectType = project.projectType;
    temp = self.copyObject(project);
    if (project.projectType != 'curation project') {
      if (temp.projectStartDate) {
        temp.projectStartDate = new Date(temp.projectStartDate);
      }
      if (temp.projectEndDate) {
        temp.projectEndDate = new Date(temp.projectEndDate);
      }
      if (temp.projectDeadline) {
        temp.projectDeadline = new Date(temp.projectDeadline);
      }
      temp.sharers.forEach(element => {
        if (element.collabShare == null) {
          element.isChangeDiscussed = false;
        } else {
          element.isChangeDiscussed = true;
        }
      });
      self.currentProjectContent = temp;
      self.collaborationProject.show();
    } else {
      if (temp.projectStartDate) {
        temp.projectStartDate = new Date(temp.projectStartDate);
      }
      self.currentProject = temp;
      self.updateCuratorPercent();
      self.projects.show();
    }
  }

  copyObject(object) {
    var temp = {};
    for (var i in object) {
      if (object[i] instanceof Array) {
        temp[i] = [];
        for (var j = 0; j < object[i].length; j++) {
          temp[i][j] = this.copyObject(object[i][j]);
        }
      } else if (object[i] instanceof Object) {
        temp[i] = this.copyObject(object[i]);
      } else {
        temp[i] = object[i];
      }
    }
    return temp;
  }

  submitProject(project) {
    var self = this;
    var projectIds = [project.projectId];
    self.projectsService.submitProjects(projectIds).then((result: any) => {
      console.log(result);
      result = result.json();
      if (result.success) {
        if (project.projectType === 'curation project') {
          var msg = '';
          if (project.submitOption === 'private') {
            var msg =
              ' Your project is sent to ' +
              project.curator.name +
              ' for consideration.<br>';
          }

          if (
            project.ProjectCuration.edittingStatus &&
            !project.ProjectCuration.metadataStatus
          ) {
            self.toastr.success(
              'Submitted project successfully!<br>' +
                msg +
                'The project is available in MARKETPLACE area. <br> Please note that your curated content will be uploaded by the curator into your workspace, and you then need to do your own meta-data tagging or assign another curator for this task.',
              'Success',
              {
                enableHtml: true
              }
            );
          } else if (
            project.ProjectCuration.metadataStatus &&
            project.ProjectCuration.metadataTaggingOption === 'only curation'
          ) {
            self.toastr.success(
              'Submitted project successfully!<br>' +
                msg +
                'The project is available in MARKETPLACE area. <br> Please note that you either upload the content to the project folder on the FTP site (which will be assigned to the agreed curator automatically) or use the already-uploaded content to assign to the curator once that curator agrees to work on the project.',
              'Success',
              {
                enableHtml: true
              }
            );
          } else {
            self.toastr.success(
              'Submitted project successfully!<br>' +
                msg +
                'The project is available in MARKETPLACE area.',
              'Success',
              {
                enableHtml: true
              }
            );
          }
        } else {
          self.toastr.success(
            'Submitted project successfully!<br>The project is available in MARKETPLACE area.',
            'Success',
            {
              enableHtml: true
            }
          );
        }
        self.loadProjects();
      } else {
        self.toastr.error('Submitting project failed!', 'Error');
      }
    });
  }

  viewProject(project) {
    project.isLoadingView = true;

    var self = this;
    self.previewingProject = {};
    self.ownerInfo = {};
    self.accountService.getProfile(project.memberId).then((result: any) => {
      const item = result;
      const address = item.Addresses.length ? item.Addresses[0] : null;
      const roles =
        item.Profile.expertisePrimary +
        ' - ' +
        item.Profile.expertiseSecondary +
        ' - ' +
        item.Profile.expertiseTierary;
      self.ownerInfo = {
        id: item.id,
        fullName: item.fullName,
        email: item.email,
        address: address ? address.city + ', ' + address.country : '',
        roles: roles,
        about: item.Profile.preferenceInterests,
        bioData: item.Profile.bioData
      };
      console.log('get owner info', self.ownerInfo);
    });
    self.projectsService.getProjectDetail(project).then((result: any) => {
      console.log(result);
      project.isLoadingView = false;
      if (result) {
        self.previewingProject = result;
        if (project.projectType == 'curation project') {
          if (!self.previewingProject.ProjectCuration.metadataTaggingOption) {
            self.previewingProject.ProjectCuration.metadataTaggingOption =
              'none';
          }
          // self.projectsService.getInterestedCurators(project, true)
          // .then(result => {
          //   console.log(result);
          // })
          self.showProjectModal.show();
        } else {
          self.showProjectModalContent.show();
        }
      } else {
        self.toastr.error('Sorry! please try again!', 'Error');
      }
    });
  }

  uploadFootage(project) {
    var self = this;
    console.log(project);
    this.currentProject = this.utils.clone(project);
    self.selectedUploadProject = project;
    self.batchName = project.projectName;
    if (
      project.projectType === 'curation project' &&
      project.ProjectCuration &&
      project.memberId === this.getUserId() &&
      project.status === 'committed' &&
      project.ProjectCuration.metadataTaggingOption == 'only curation'
    ) {
      return self.showFTPModal.show();
    }
    self.initializeFootageUploadModal();
    self.fileUploadFootageModal.show();
  }

  initializeFootageUploadModal() {
    var self = this;
    var $fFiles = $('#fFiles');
    if ($fFiles.fileinput) {
      $fFiles.fileinput('destroy');
    }
    self.canReminder = false;
    var count = 0;
    var isUpload = false;
    $fFiles.fileinput(
      $.extend(self.constants.defaultFileInputSettings, {
        uploadUrl: self.apiUrl.upload_files.replace(
          '{memberId}',
          self.accountService.getUserId()
        ),
        allowedFileExtensions: ['mov', 'mp4'],
        maxFileCount: 5,
        uploadAsync: true,
        ajaxSettings: {
          headers: {
            Token: self.accountService.getToken()
          }
        },
        uploadExtraData: function(event, data, id, index) {
          var out = {
            batchName: $('#txtBatchName').val(),
            ownerId: self.selectedUploadProject.memberId,
            projectId: self.selectedUploadProject.projectId,
            onBehalfOfId: self.selectedUploadProject.onBehalfOfId
          };
          return out;
        }
      })
    );
    $fFiles.fileinput('clear');
    $fFiles.on('fileuploaderror', (event, data, msg) => {
      isUpload = true;
      self.canReminder = false;
      if (data.files) {
        var file = data.files[data.index];
        if (file) {
          var fileSize = (file.size || 0) / 1024;
          if (fileSize > self.constants.maxContentSize) {
            var msg: any =
              'File "' +
              file.name +
              '" (' +
              (fileSize / 1024).toFixed(2) +
              ' MB) exceeds maximum allowed upload size of 512 MB.';
            $('[data-file-id="' + data.id + '"]').html(msg);
            self.toastr.error(msg, 'Error');
          }
        }
      }
    });
    $fFiles
      .off('fileloaded')
      .on('fileloaded', function(event, file, previewId, index, reader) {
        var fInput = $('#fFiles').data('fileinput');
        var currentFileIndex = fInput.filestack.findIndex((item: any) => {
          return item && item.name == file.name;
        });
        var mime = file.type;
        var blob = new Blob([reader.result], {
            type: mime
          }),
          url = (URL || webkitURL).createObjectURL(blob),
          video = document.createElement('video');

        video.preload = 'metadata';
        video.addEventListener('loadedmetadata', () => {
          if (video.duration < 5 || video.duration > 60) {
            delete fInput.filestack[currentFileIndex];
            fInput.setThumbStatus($('#' + previewId), 'Error');

            $('#fFiles').fileinput('setCaption', '', true);
            $('#fFiles').fileinput(
              'showUploadError',
              'Video "' +
                file.name +
                '" duration must be limited to 5 seconds min and 60 seconds max',
              {
                id: previewId,
                index: currentFileIndex
              }
            );
          }
        });
        video.src = url;
      });

    $('#fFiles')
      .off('filebatchuploadcomplete')
      .on('filebatchuploadcomplete', function(event, files, extra) {
        var fInput = $('#fFiles').data('fileinput');
        var errors = [];
        fInput.ajaxRequests.filter((i: any) => {
          if (i.responseJSON.error) {
            errors.push(i.responseJSON.error);
          }
          return i.responseJSON.error;
        });
        $fFiles.fileinput('clear');

        if (errors.length) {
          self.toastr.error(errors.join('<br>'), 'Error', { enableHtml: true });
        } else {
          self.loadProjects();
          self.canReminder = false;

          if (
            self.currentProject.projectType === 'curation project' &&
            self.currentProject.ProjectCuration &&
            self.currentProject.ProjectCuration.metadataStatus
          ) {
            self.toastr.success(
              'The uploaded file(s) is available in WORKSPACE area for further processing. Please go there to complete metadata editing and final submission.',
              'Success'
            );
          } else {
            self.toastr.success(
              "The uploaded files(s) is available in the owner's WORKSPACE area for further processing.",
              'Success'
            );
          }
        }
      });

    $fFiles
      .off('fileclear')
      .on('fileclear', (event, file, previewId, index, reader) => {
        self.canReminder = false;
      });

    $fFiles.off('fileremoved').on('fileremoved', function(event, id, index) {
      count -= 1;
      if (!isUpload) {
        if (count == 0) {
          self.canReminder = false;
        } else {
          self.canReminder = true;
        }
      } else {
        self.canReminder = false;
      }
    });

    $fFiles.on('fileuploaded', function(event, previewId, index, fileId) {
      isUpload = true;
      self.canReminder = false;
    });

    $fFiles.on('fileloaded', function(event, file, previewId, index, reader) {
      count += 1;
    });

    $fFiles.change(function() {
      self.canReminder = true;
    });
  }

  downloadContent(project) {
    window.open(
      this.apiUrl.download_project_content
        .replace('{projectId}', project.projectId)
        .replace('{memberId}', this.accountService.getUserId()),
      'Download project content'
    );
  }

  completeProject(project) {
    var self = this;
    project.completing = true;
    self.projectsService.completeProject(project).then((result: any) => {
      project.completing = false;
      if (result && result.status == 200) {
        self.toastr.success('Completed successfully!', 'Success');
        self.loadProjects();
      } else {
        self.toastr.error('Sorry! please try again!', 'Error');
      }
    });
  }

  clearSearch() {
    this.searchKeyWordsProject = '';
    this.loadProjects();
    this.search.nativeElement.focus();
  }

  clearSearchCurator() {
    this.keywordSearch.text = '';
    this.filterCurators('');
    this.searchCurator.nativeElement.focus();
  }

  clearSearchSharers() {
    this.keywordSearch.text = '';
    this.filterSharers('');
    this.searchSharers.nativeElement.focus();
  }

  canCompleteCuration(project) {
    var self = this;

    if (
      project.projectType === 'curation project' &&
      project.status === 'committed' &&
      project.curator &&
      project.curator.id === this.getUserId() &&
      project.curationCompletion != 'yes' &&
      project.ProjectCuration &&
      (project.ProjectCuration.metadataTaggingOption === 'only curation' ||
        (project.hasFootages && !project.ProjectCuration.metadataStatus))
    ) {
      return true;
    }

    if (project.curator) {
      if (self.accountService.getUserId() === project.curator.id) {
        if (
          project.status === 'committed' &&
          project.allFootagesSubmitted === true &&
          project.curationCompletion != 'yes'
        ) {
          return true;
        }
      }
    }
    return false;
  }

  completeCuration(project) {
    var self = this;
    project.curationCompleting = true;
    self.projectsService
      .completeCurationProject(project)
      .then((result: any) => {
        console.log(result);
        if (result && result.status == 200) {
          project.curationCompleting = false;
          self.toastr.success('Curation completed successfully!', 'Success');
          self.manageProjects = _.map(self.manageProjects, item => {
            if (item.projectId == project.projectId) {
              item.curator.approvalStatusName = 'completed';
              project.curationCompletion = 'yes';
            }
            return item;
          });
        } else {
          self.toastr.error('Sorry! please try again!', 'Error');
        }
      });
  }

  canClearCurationProject(project) {
    if (
      this.getUserId() != project.memberId &&
      project.status == 'committed' &&
      (project.allFootagesSubmitted === true ||
        project.curationCompletion === 'yes')
    ) {
      return true;
    }
    return false;
  }

  clearCurationProject(project) {
    var self = this;

    project.clearing = true;
    self.projectsService.clearCurationProject(project).then((result: any) => {
      project.clearing = false;
      self.toastr.success('Cleared successfully!', 'Success');
      self.manageProjects = _.reject(self.manageProjects, item => {
        return item.projectId == project.projectId;
      });
    });
  }

  suggestSharingPercenatge = project => {
    if (
      project.ProjectCuration.edittingStatus &&
      project.ProjectCuration.metadataStatus
    ) {
      project.sharingPercentage = 40;
    } else {
      project.sharingPercentage = 20;
    }

    if (
      !project.ProjectCuration.edittingStatus &&
      project.ProjectCuration.metadataStatus
    ) {
      project.ProjectCuration.metadataTaggingOption = project.ProjectCuration
        .metadataTaggingOption
        ? project.ProjectCuration.metadataTaggingOption
        : 'none';
    } else {
      project.ProjectCuration.metadataTaggingOption = null;
    }
  };

  getListInterest(project) {
    var self = this;
    this.currentProject = this.utils.clone(project);
    this.collaborators = this.currentProject.collaborators;
    this.projectsService
      .getListCuratorRated(this.currentProject.projectId)
      .then(function(result: any) {
        if (result.success) {
          self.listCuratorRated = result.data;
          self.setInfoCuratorRated();
          self.collaboratorsModal.show();
        }
      });
  }

  ChatAction(project, member) {
    // var groupId = null;
    // var memberId = member
    //   ? !member.id
    //     ? member.memberId
    //     : member.id
    //   : project.memberId;
    // if (project.memberId === this.accountService.getUserId()) {
    //   this.frontpageComponent.loginRoomChat(
    //     memberId,
    //     member.name ? member.name : member.fullName,
    //     project.projectId,
    //     project.projectName,
    //     groupId,
    //     project.status
    //   );
    // } else {
    //   this.frontpageComponent.loginRoomChat(
    //     project.memberId,
    //     project.Member.fullName,
    //     project.projectId,
    //     project.projectName,
    //     groupId,
    //     project.status
    //   );
    // }
  }

  checkTooltip() {
    if (this.projectType == 'curation project') {
      return 'Edit and/or meta-data tagging';
    } else {
      return 'Co-produce of content';
    }
  }

  changeDisabledSharingPercentage(item: any) {
    if (!item.disabledSharingPercentage) {
      item.collabShare = 15;
    }
  }

  initializeUploadProjectContentModal(isReUpload?) {
    var self = this;
    var $fFiles = $('#projectContentFile');
    if ($fFiles.fileinput) {
      $fFiles.fileinput('destroy');
    }
    var myUrl = self.apiUrl.re_upload_media_product
      .replace('{memberId}', self.accountService.getUserId())
      .replace('{projectId}', self.currentProject.projectId);
    self.canReminder = false;
    $fFiles.fileinput(
      $.extend(self.constants.defaultFileInputSettings, {
        uploadUrl: isReUpload
          ? myUrl
          : self.apiUrl.add_media_product
              .replace('{memberId}', self.accountService.getUserId())
              .replace('{projectId}', self.currentProject.projectId),
        allowedFileExtensions: ['mov', 'mp4'],
        maxFileSize: 10 * 1024 * 1024, //10 GB
        maxFileCount: 1,
        uploadAsync: true,
        ajaxSettings: {
          headers: {
            Token: self.accountService.getToken()
          }
        }
      })
    );

    $fFiles.fileinput('clear');
    $fFiles
      .off('fileloaded')
      .on('fileloaded', function(event, file, previewId, index, reader) {
        var fileNames = [
          `${self.currentProject.projectId}.mov`,
          `${self.currentProject.projectId}.mp4`
        ];
        if (!fileNames.includes(file.name.toLowerCase())) {
          self.toastr.error('The file name is invalid.', 'Error');
          self.initializeUploadProjectContentModal(isReUpload);
        }
      });

    $fFiles
      .off('fileuploaded')
      .on('fileuploaded', function(event, files, extra) {
        self.toastr.success('Uploaded successfully!', 'Success');
        self.uploadProjectContentModal.hide();
        self.loadProjects();
      });

    $fFiles
      .off('fileclear')
      .on('fileclear', (event, file, previewId, index, reader) => {
        self.canReminder = false;
      });

    $fFiles.off('fileremoved').on('fileremoved', function(event, id, index) {
      self.canReminder = false;
    });

    $fFiles.change(function() {
      self.canReminder = true;
    });
  }

  canUploadProjectContent(project) {
    var canUploadProjectContent =
      project.canUploadContent &&
      project.projectType === 'collaborative content project' &&
      project.memberId === this.accountService.getUserId() &&
      project.status === 'committed';

    return canUploadProjectContent;
  }

  canReUploadProjectContent(project) {
    var canUploadProjectContent =
      !project.canUploadContent &&
      project.projectType === 'collaborative content project' &&
      project.memberId === this.accountService.getUserId() &&
      project.status === 'committed';

    return canUploadProjectContent;
  }

  uploadProjectContent(project) {
    var self = this;
    console.log(project);
    this.currentProject = this.utils.clone(project);
    self.initializeUploadProjectContentModal();
    self.uploadProjectContentModal.show();
  }

  reUploadProjectContent(project) {
    var self = this;
    console.log(project);
    this.currentProject = this.utils.clone(project);
    self.initializeUploadProjectContentModal(true);
    self.uploadProjectContentModal.show();
  }

  closeUploadAdvancedModal() {
    this.showFTPModal.hide();
    if (this.currentProject.isProjectContentUploadModal) {
      this.uploadProjectContent(this.currentProject);
    } else {
      this.uploadFootage(this.currentProject);
    }
  }

  showUploadAdvancedModal(project, isProjectContentUploadModal) {
    this.currentProject.isProjectContentUploadModal = isProjectContentUploadModal;

    if (isProjectContentUploadModal) {
      this.uploadProjectContentModal.hide();
    } else {
      this.fileUploadFootageModal.hide();
    }

    this.showFTPModal.show();
  }

  copyToken(val: string) {
    this.sharedService.copyText(val);
    console.log('ngoai');
    this.toastr.success('Copied successfully!', 'Success');
  }

  closeUploadProjectContentModal() {
    if (this.canReminder) {
      this.confirm.show();
      $('#confirmModal').on('click', '.btn-ok', e => {
        this.confirm.hide();
        this.uploadProjectContentModal.hide();
      });
    } else {
      this.uploadProjectContentModal.hide();
    }
  }

  closeNoticeModal() {
    if (this.notShowNotice) {
      var userLocal: any = {};
      var currentUserLocal: any = JSON.parse(
        localStorage.getItem(this.accountService.getUserId())
      );
      if (currentUserLocal) {
        userLocal = currentUserLocal;
      }
      userLocal.notShowNotice = true;
      this.authenticateService.saveByUser(JSON.stringify(userLocal));
    }

    if (this.notShowNoticeMetadataOption) {
      var userLocal: any = {};
      var currentUserLocal: any = JSON.parse(
        localStorage.getItem(this.accountService.getUserId())
      );
      if (currentUserLocal) {
        userLocal = currentUserLocal;
      }
      userLocal.notShowNoticeMetadataOption = true;
      this.authenticateService.saveByUser(JSON.stringify(userLocal));
    }
    this.notice.hide();
    this.noticeMetadataOption.hide();
  }

  closeFileUploadFootageModal() {
    if (this.canReminder) {
      this.confirm.show();
      $('#confirmModal').on('click', '.btn-ok', e => {
        this.confirm.hide();
        this.fileUploadFootageModal.hide();
      });
    } else {
      this.fileUploadFootageModal.hide();
    }
  }

  openLink(link) {
    if (link && link.indexOf('http') === 0) {
      return window.open(link);
    }
    return window.open('//' + link);
  }

  closeProjectModal() {
    const self = this;

    if (self.checkModalShow) {
      $('body').removeClass('modal-open');
      $('bs-modal-backdrop').removeClass('modal-backdrop fade in show');
      $('.modal-backdrop').removeClass('modal-backdrop fade in show');
      self.checkModalShow = false;
      self.sharedService.emitInfoModal('');
      if (
        self.currentModalInfo &&
        self.currentModalInfo.id === 'studio-project' &&
        self.currentModalInfo.check
      ) {
        self.router.navigate(['/my-studio/projects/content-review']);
      }
    }
  }

  canChatGroup(project) {
    if (
      project.projectType === 'collaborative content project' &&
      project.status === 'committed'
    ) {
      return true;
    }

    return false;
  }

  ChatGroupAction(project) {
    var groupId = project.projectId;
    var roomId = groupId;
    var connectName = project.projectName + ' - Group';
    var projectId = project.projectId;
    var projectName = project.projectName;
    // this.frontpageComponent.loginRoomChat(
    //   roomId,
    //   connectName,
    //   projectId,
    //   projectName,
    //   groupId,
    //   project.status
    // );
  }
  setInfoCuratorRated(): void {
    var self = this;
    this.collaborators.forEach(item => {
      item.rated = false;
      var curatorRated = self.listCuratorRated.find(
        c => c.curatorId == item.memberId
      );
      if (curatorRated) {
        item.rated = true;
      }
    });
  }
  openRatingModal(project, curator): void {
    this.projectRating = project;
    this.curatorRating = curator;
    var self = this;
    this.projectsService
      .getInfoCuratorRating(curator.memberId, project.projectId, 'project')
      .then(function(result: any) {
        if (result.success) {
          var rating = result.data;
          self.curatorRating.curatorId = self.curatorRating.memberId;
          self.curatorRating.footageId = null;
          self.curatorRating.projectId = project.projectId;
          self.curatorRating.name = project.projectName;
          self.curatorRating.rated = curator.rated;
          if (!curator.rated) {
            self.curatorRating.numberRating = 0;
            self.curatorRating.commentRating = '';
            // self.curatorRating.numberOfProject = result.countProjectJoined;
            self.curatorRating.numberOfFootage = result.countFootageJoined;
            // self.curatorRating.rejectRateAtBB = result.countRejectRateAtBB;
            // self.curatorRating.rejectRateAtStorefront = result.countRejectRateAtStorefront;
            // self.curatorRating.numberOfFootageSold = result.countFootageSold;
            self.curatorRating.ratingType = 'positive';
          } else {
            self.curatorRating.numberRating = rating.numberRating;
            self.curatorRating.comment = rating.comment;
            var metaData = JSON.parse(rating.metaData);
            // self.curatorRating.numberOfProject = metaData.numberOfProject;
            self.curatorRating.numberOfFootage = metaData.numberOfFootage;
            // self.curatorRating.rejectRateAtBB = metaData.rejectRateAtBB;
            // self.curatorRating.rejectRateAtStorefront = metaData.rejectRateAtStorefront;
            // self.curatorRating.numberOfFootageSold = metaData.numberOfFootageSold;
            self.curatorRating.ratingType = rating.ratingType;
          }
          self.ratingModal.openModalRating(self.curatorRating);
        }
      });
  }

  closeModalRating(): void {
    $('#modalRating').modal('hide');
  }

  saveRating(info): void {
    var self = this;
    this.projectsService.addRating(info).then(function(result: any) {
      result = result.json();
      if (result.success) {
        self.toastr.success('Rating for curator success');
        self.curatorRating.rated = true;
        self.ratingModal.doneRating();
      }
    });
  }
}
