import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Constants } from 'src/app/utils/constants';
import { ProjectsService } from 'src/app/services/projects.service';
import { ApiUrl } from 'src/app/utils/apiUrl';
import { AccountService } from 'src/app/services/account.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { Utils } from 'src/app/utils/utils';
import { MyBlackboxComponent } from '../my-blackbox.component';
import _ from 'underscore';

declare var $: any;
declare var mApp: any;

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {
  public avatarUrlB: string = this.apiUrl.get_avatar.replace(
    '{defaultType}',
    'B'
  );
  projectFilters: any = [];
  projectStatusFilters: any = [];
  keywordsProject: string = '';
  collaboratedProjects: any = [];
  paging = {
    currentPage: 1,
    pageSize: this.constants.pageSize,
    total: 0,
    firstEntry: 0,
    lastEntry: 0,
    count: 0
  };
  pagingCurator = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    count: 0
  };
  projectFilter: string = '';
  projectFilterStatus: string = '';
  allowShow: boolean = false;
  emailModel: any = {};
  searchProjectId: string;
  previewingProject: any = {};
  curators: any = [];
  pagingSharer = {
    currentPage: 1,
    pageSize: this.constants.pageSharerSize[0],
    total: 0,
    firstEntry: 0,
    lastEntry: 0,
    count: 0,
    pageSizeList: this.constants.pageSizeList
  };
  partner: any;
  public memberAttributeList: any = [];
  public memberAttribute: string = 'email';
  keywordSearch = {
    text: ''
  };
  currentProject: any = {};
  selectedCurator: any = {};
  selectedCuratorProject: any = {
    id: ''
  };
  isAdmin: boolean;
  reasonsText: string = '';
  reasonsStatus: boolean = false;
  tempProject: any = {};
  rejectedReason: string = '';
  collaborators: any = [];
  listChangeProjecstModal: any = {
    collaborators: []
  };
  listSelectCollaboratiorType: any;
  filterProjectType: string = '';
  checkCollaboratorPendingInvitation: boolean = false;
  finalining: boolean = false;
  selectedSharer: any = null;
  isSharerLoading: boolean = false;
  sharers: any = [];
  changeSharer: any = {};
  saving: boolean = false;
  invitedCollaborators: any = [];
  interestedCollaborators: any = [];
  ownerInfo: any;

  @ViewChild('showProjectModal') showProjectModal: ModalDirective;
  @ViewChild('showProjectModalContent') showProjectModalContent: ModalDirective;
  @ViewChild('changeProjectsModal') changeProjectsModal: ModalDirective;
  @ViewChild('refuseModal') refuseModal: ModalDirective;
  @ViewChild('rejectCollaborativeContentProjectModal')
  rejectCollaborativeContentProjectModal: ModalDirective;
  @ViewChild('curatorUpload') curatorUpload: ModalDirective;
  @ViewChild('curatorsModal') curatorsModal: ModalDirective;
  @ViewChild('collaboratorsModal') collaboratorsModal: ModalDirective;
  @ViewChild('finalizeConfirmModal') finalizeConfirmModal: ModalDirective;
  @ViewChild('membersModal') membersModal: ModalDirective;
  @ViewChild('search') search: ElementRef;
  @ViewChild('searchCurator') searchCurator: ElementRef;
  @ViewChild('searchSharers') searchSharers: ElementRef;

  constructor(
    private commonService: CommonService,
    public constants: Constants,
    private projectsService: ProjectsService,
    private apiUrl: ApiUrl,
    public accountService: AccountService,
    private toastr: ToastrService,
    // private frontpageComponent: FrontpageComponent,
    private myBlackboxComponent: MyBlackboxComponent,
    private authenticateService: AuthenticateService,
    private utils: Utils
  ) {
    this.projectFilters = commonService.getProjectFilter();
    this.projectStatusFilters = commonService.getProjectStatus();
    this.partner = commonService.getPartnerTypes();
    this.listSelectCollaboratiorType = commonService.getSelectCollaboratorType();
    this.memberAttributeList = commonService.getMemberSearchAttributes();
  }

  ngOnInit() {
    this.isAdmin = this.accountService.isAdmin();
    if (this.isAdmin) {
      this.filterProjectType = 'collaborative content project';
    }
    this.initialize();
  }

  showHelpModal() {
    $('#help-project-market-modal').modal('show');
  }

  initialize() {
    // if (this.homeSearch.projectId) {
    //   this.searchProjectId = this.homeSearch.projectId;
    //   this.homeSearch.projectId = '';
    // } else {
    this.searchProjectId = '';
    // }
    this.loadCollaborateProjects();
  }

  openLink(link) {
    if (link && link.indexOf('http') === 0) {
      return window.open(link);
    }
    return window.open('//' + link);
  }

  loadCollaborateProjects() {
    var self = this;
    self.allowShow = false;
    mApp.blockPage();
    self.projectsService
      .getCollaboratedProjects(
        (self.paging.currentPage - 1) * self.paging.pageSize + 1,
        self.paging.pageSize,
        self.keywordsProject,
        self.projectFilter,
        self.projectFilterStatus,
        self.filterProjectType,
        self.searchProjectId
      )
      .then((result: any) => {
        console.log(result);
        mApp.unblockPage();
        self.collaboratedProjects = result.list;
        self.allowShow = !self.collaboratedProjects.length ? true : false;
        self.collaboratedProjects = self.changeCuratorApprovalStatus(
          self.collaboratedProjects
        );
        self.paging.total = result.pageInfo.totalRecords;
        self.paging.count = result.pageInfo.totalDisplayRecords;
        self.collaboratedProjects.forEach(project => {
          if (
            project.projectType === 'curation project' &&
            project.submitOption === 'marketplace'
          ) {
            let interest = [];
            interest = _.filter(
              project.Collaborators,
              item => item.collabType === 'curator'
            );
            project.interest = interest;
          }
        });
      });

    self.myBlackboxComponent.countProjects();
  }

  filterCollaborateProjects() {
    this.paging.currentPage = 1;
    this.loadCollaborateProjects();
  }

  changeCuratorApprovalStatus(projects) {
    projects.forEach((project: any) => {
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
      }
    });
    return projects;
  }

  canAcceptProjectCollaboration(project, collaborator, role) {
    return (
      project.status == 'available' &&
      collaborator &&
        this.accountService.getUserId() == collaborator.id &&
        collaborator.approvalStatus == 'pending' &&
        collaborator.ownerApprovalStatus == 'approved' &&
      this.accountService.hasRole(role)
    );
  }

  acceptProjectCollaboration(project) {
    var self = this;
    self.projectsService
      .acceptProjectCollaboration(project)
      .then((result: any) => {
        if (result && result.status == 200) {
          self.toastr.success(
            'You have agreed to become a curator for project: ' +
              project.projectName +
              '.<br>The project will be available in "MY COLLABORATION" area.',
            'Success',
            { enableHtml: true }
          );
          self.loadCollaborateProjects();
        } else {
          self.toastr.error('Sorry! Please try again!', 'Error');
        }
      });
  }

  declineProjectCollaboration(project) {
    var self = this;
    self.projectsService
      .declineProjectCollaboration(project)
      .then((result: any) => {
        if (result && result.status == 200) {
          self.toastr.success(
            'You have declined the invitation to become a curator for project: ' +
              project.projectName,
            'Success'
          );
          self.loadCollaborateProjects();
        } else {
          self.toastr.error('Sorry! Please try again!', 'Error');
        }
      });
  }

  canCompleteProject(project) {
    return (
      project.memberId == this.accountService.getUserId() &&
      project.status == 'committed'
    );
  }

  completeProject(project) {
    var self = this;
    self.projectsService.completeProject(project).then((result: any) => {
      if (result && result.status == 200) {
        self.toastr.success('Completed successfully!', 'Success');
        self.loadCollaborateProjects();
      } else {
        self.toastr.error('Sorry! Please try again!', 'Error');
      }
    });
  }

  page(currentPage: any) {
    var self = this;
    if (self.paging.currentPage == currentPage.page) {
      return;
    }
    self.paging.currentPage = currentPage.page;
    self.loadCollaborateProjects();
  }

  viewProject(project) {
    project.isLoadingView = true;
    const self = this;
    self.previewingProject = {};
    project.viewing = true;
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
      project.isLoadingView = false;
      if (result) {
        self.previewingProject = result;
        if (project.projectType === 'curation project') {
          if (!self.previewingProject.ProjectCuration.metadataTaggingOption) {
            self.previewingProject.ProjectCuration.metadataTaggingOption =
              'none';
          }
          let interest = [];
          interest = _.filter(
            self.previewingProject.Collaborators,
            item => item.collabType === 'curator'
          );
          self.previewingProject.interest = interest;
          self.showProjectModal.show();
        } else {
          self.showProjectModalContent.show();
        }
      } else {
        self.toastr.error('Sorry! please try again!', 'Error');
      }
    });
  }

  canChat(project) {
    var canChat = project.status === 'available';

    if (this.isOwnerProject(project, 'marketplace')) {
      return false;
    }

    if (project.projectType === 'collaborative content project') {
      canChat =
        project.status === 'available' && project.reviewState === 'approved';
      return canChat;
    }

    return canChat;
  }

  canChatGroup(project) {
    var canChat = project.status === 'available';
    if (project.projectType === 'collaborative content project') {
      canChat =
        project.status === 'available' && project.reviewState === 'approved';
      if (canChat) {
        canChat = this.checkMemberApprovalChatGroup(project);
      }
    }
    return canChat;
  }

  checkMemberApprovalChatGroup(project) {
    var isApproved = false;
    var userId = this.accountService.getUserId();
    if (project.memberId == userId) {
      isApproved = true;
    } else {
      for (var i = 0; i < project.Interests.length; i++) {
        var item = project.Interests[i];
        if (
          item.memberId == userId &&
          (item.approvalStatus == 'approved' ||
            (item.approvalStatus == 'agreed' &&
              item.ownerApprovalStatus == 'accepted'))
        ) {
          isApproved = true;
          break;
        }
      }
    }
    return isApproved;
  }

  deleteProjects(project) {
    var self = this;
    project.deleting = true;
    self.projectsService
      .deleteProjects([project.projectId])
      .then((result: any) => {
        project.deleting = false;
        if (result && result.status == 204) {
          self.toastr.success('Deleted project successfully!', 'Success');
          self.loadCollaborateProjects();
        } else {
          self.toastr.error('Deleting project failed!', 'Error');
        }
      });
  }

  canDeleteProject(project) {
    return project.memberId == this.accountService.getUserId();
  }

  ChatAction(project, member) {
    var groupId = null;
    // if (project.memberId === this.accountService.getUserId()) {
    //   this.frontpageComponent.loginRoomChat(
    //     member.id,
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

  CommunityCurator(project) {
    if (project) {
      if (
        project.submitOption == 'community' &&
        project.interestCount > 0 &&
        project.curator &&
        (project.curator.id == null ||
          project.curator.approvalStatus == 'denied') &&
        this.accountService.getUserId() == project.memberId
      ) {
        return true;
      }
    }
    return false;
  }

  PrivateCurator(project) {
    if (project) {
      if (
        project.submitOption == 'private' &&
        ((project.curator && project.curator.approvalStatus == 'denied') ||
          !project.curator) &&
        this.accountService.getUserId() == project.memberId
      ) {
        return true;
      }
    }
    return false;
  }

  chooseCurator(project) {
    var self = this;
    self.curators = [];
    self.selectedCuratorProject.id = '';
    project.isLoading = true;
    self.allowShow = false;
    if (self.PrivateCurator(project)) {
      self.projectsService
        .getPartners(
          self.pagingCurator.currentPage * self.pagingCurator.pageSize +
            1 -
            self.pagingCurator.pageSize,
          self.pagingCurator.pageSize,
          self.partner.curator,
          self.keywordSearch.text
        )
        .then((result: any) => {
          project.isLoading = false;
          if (result.status == 400) {
            return;
          }
          self.curators = result.list;
          self.allowShow = !self.curators.length ? true : false;
          self.pagingCurator.total = result.pageInfo.totalRecords;
          self.pagingCurator.count = result.pageInfo.totalDisplayRecords;
          self.checkCurators(true);
          setTimeout(() => {
            self.curatorUpload.show();
          }, 200);
        });
    }
    self.currentProject = project;
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
        mApp.unblock(blockId);
        if (result.status == 400) {
          return;
        }
        self.curators = result.list;
        self.allowShow = !self.curators.length ? true : false;
        self.pagingCurator.total = result.pageInfo.totalRecords;
        self.pagingCurator.count = result.pageInfo.totalDisplayRecords;
        self.checkCurators(true);
        setTimeout(() => {
          self.curatorUpload.show();
        }, 200);
      });
  }

  filterCurators(keyword) {
    var self = this;
    self.pagingCurator.currentPage = 1;
    self.loadCurators();
  }

  pageCuratorChanged(currentPage: any) {
    if (this.pagingCurator.currentPage === currentPage.page) {
      return;
    }
    this.pagingCurator.currentPage = currentPage.page;
    this.loadCurators();
  }

  checkCurators(all) {
    var self = this;
    var currentCurator = self.selectedCurator;
    if (self.curators) {
      if (all) {
        for (var i = 0; i < self.curators.length; i++) {
          self.curators[i].collabShare =
            self.currentProject.curator.collabShare;
        }
      } else {
        for (var i = 0; i < self.curators.length; i++) {
          if (currentCurator) {
            if (self.curators[i].id == currentCurator.id) {
              self.curators[i].collabShare = currentCurator.collabShare;
            } else {
              self.curators[i].collabShare = 15;
            }
          } else {
            self.curators[i].collabShare = 15;
          }
        }
      }
    }
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

  subModalCloseSubmit() {
    var self = this;
    self.selectedCurator = self.currentProject.curator;
    if (self.currentProject.curator == null) self.selectedCurator = null;

    self.pagingCurator.currentPage = 1;
    self.keywordSearch = {
      text: ''
    };

    this.curatorUpload.hide();
  }

  saveCurator() {
    var self = this;
    if (self.selectedCuratorProject.id == '') {
      return self.toastr.warning('Please select curator!', 'Warning');
    }
    if (!self.selectedCurator.name) {
      self.selectedCurator.name =
        self.selectedCurator.firstName + ' ' + self.selectedCurator.lastName;
    }
    self.currentProject.curator = self.selectedCurator;
    self.currentProject.saving = true;
    self.projectsService
      .updateCuratorProject(self.currentProject)
      .then((result: any) => {
        self.currentProject.saving = false;
        result = result.json();
        if (result.success) {
          self.toastr.success(
            'Updated curator for project successfully!',
            'Success'
          );
          self.curatorUpload.hide();
          self.loadCollaborateProjects();
          self.subModalCloseSubmit();
        } else {
          self.toastr.error('Updating curator for project failed!', 'Error');
          self.curatorUpload.hide();
        }
      });
  }

  clearSearch() {
    this.keywordsProject = '';
    this.loadCollaborateProjects();
    this.search.nativeElement.focus();
  }

  clearSearchCurator() {
    this.keywordSearch.text = '';
    this.filterCurators('');
    this.searchCurator.nativeElement.focus();
  }

  canClearCurationProject(project) {
    return (
      project.memberId !== this.accountService.getUserId() &&
      project.submitOption === 'marketplace'
    );
  }

  clearCurationProject(project) {
    var self = this;
    project.isClear = true;
    self.projectsService.clearCurationProject(project).then((result: any) => {
      project.isClear = false;
      self.toastr.success('Cleared successfully!', 'Success');
      self.loadCollaborateProjects();
      self.collaboratedProjects = _.reject(self.collaboratedProjects, item => {
        return item.projectId == project.projectId;
      });
    });
  }

  isOwnerProject(project, type) {
    if (project.memberId != this.accountService.getUserId()) {
      return false;
    }

    if (type === project.submitOption) {
      return true;
    }

    return false;
  }

  canBecomeCuratorProject(project) {
    if (
      project.submitOption == 'marketplace' &&
      !this.canDeleteProject(project)
    ) {
      let isBecomeCuratorProject = _.some(project.Collaborators, item => {
        return (
          item.collabMemberId == this.accountService.getUserId() &&
          item.collabType == 'curator'
        );
      });
      return !isBecomeCuratorProject;
    }

    return false;
  }

  becomeCuratorProject(project) {
    var sessionData;
    this.authenticateService.getSessionData().subscribe(o => {
      sessionData = o;
    });
    project.curator = {
      fullName: sessionData.fullname,
      approvalStatusName: 'pending'
    };

    if (
      project.interest &&
      project.interest.length >= this.constants.maxBecomeCurators
    ) {
      return this.toastr.info(
        'There are already too many interested curators for this project.',
        'Info'
      );
    }

    project.isLoading = true;
    this.projectsService.becomeCuratorProject(project).then((result: any) => {
      console.log(result.json());
      var result = result.json();
      project.isLoading = false;
      if (result.success) {
        this.toastr.success(
          'A request has been sent to the owner project. Please wait for the approval.',
          'Success'
        );
        this.loadCollaborateProjects();
      } else {
        this.toastr.info(result.message, 'Info');
        this.loadCollaborateProjects();
        return;
      }
    });
  }

  viewDetailCurators(project) {
    project.isViewDetail = true;
    this.currentProject = project;
    this.projectsService
      .getInterestedCurators(project.projectId)
      .then(result => {
        project.isViewDetail = false;
        if (result.success) {
          this.curators = _.filter(
            result.data,
            item =>
              item.approvalStatus == 'approved' &&
              item.ownerApprovalStatus == 'pending'
          );
          this.curatorsModal.show();
        }
      });
  }

  acceptCurator(curator) {
    mApp.block('#curatorsModal');
    this.projectsService
      .acceptCuratorMarketplaceProject(curator, this.currentProject)
      .then((result: any) => {
        result = result.json();
        console.log(result);
        if (result.success) {
          mApp.unblock('#curatorsModal');
          this.toastr.success('Accepted successfully!', 'Success');
          this.curatorsModal.hide();
          this.collaboratedProjects = _.reject(
            this.collaboratedProjects,
            item => {
              return item.projectId == this.currentProject.projectId;
            }
          );
        }
      });
  }

  declineCurator(curator) {
    curator.isLoading = true;
    this.projectsService
      .declineCuratorMarketplaceProject(curator, this.currentProject)
      .then((result: any) => {
        result = result.json();
        console.log(result);
        curator.isLoading = false;
        if (result.success) {
          this.toastr.success('Declined successfully!', 'Success');
          this.curators = _.reject(this.curators, item => {
            return item.id == curator.id;
          });

          this.collaboratedProjects = _.map(this.collaboratedProjects, item => {
            if (item.projectId == this.currentProject.projectId) {
              item.curators = this.curators;
            }

            return item;
          });
        }
      });
  }

  approveCollaborativeContentProject = project => {
    this.projectsService
      .approveCollaborativeContentProject(project)
      .then((result: any) => {
        result = result.json();
        console.log(result);
        if (result.success) {
          this.collaboratedProjects = _.reject(
            this.collaboratedProjects,
            item => {
              return item.projectId == project.projectId;
            }
          );
          this.myBlackboxComponent.countProjects();
          this.toastr.success('Approved successfully!', 'Success');
        } else {
          this.toastr.error(result.message, 'Error');
        }
      });
  };

  rejectCollaborativeContentProject = project => {
    this.currentProject = this.utils.clone(project);
    this.rejectCollaborativeContentProjectModal.show();
    this.rejectedReason = '';

    $('#rejectCollaborativeContentProjectModal').on(
      'click',
      '#send-mail-btn',
      event => {
        this.currentProject.rejectedReason = this.rejectedReason.replace(
          /[\n]/gi,
          '<br>'
        );
        this.projectsService
          .rejectCollaborativeContentProject(this.currentProject)
          .then((result: any) => {
            result = result.json();
            if (result.success) {
              this.collaboratedProjects = _.reject(
                this.collaboratedProjects,
                item => {
                  return item.projectId == project.projectId;
                }
              );
              this.myBlackboxComponent.countProjects();
              this.toastr.success('Rejected successfully!', 'Success');
            } else {
              this.toastr.error(result.message, 'Error');
            }
            this.rejectCollaborativeContentProjectModal.hide();
          });
      }
    );
  };

  canInterestProject(project) {
    let canInterestProject = _.some(project.collaborators, item => {
      return item.id == this.accountService.getUserId();
    });

    let listInterestProject = _.filter(project.collaborators, item => {
      return item.ownerApprovalStatus == 'accepted';
    });

    if (
      project.selectCollaboratorsType == 'indicate number' &&
      listInterestProject.length >= project.numberCollaborators
    ) {
      return false;
    }
    if (
      project.memberId !== this.accountService.getUserId() &&
      !canInterestProject
    ) {
      return true;
    }

    return false;
  }

  interestCollaborativeContentProject = project => {
    this.projectsService
      .interestCollaborativeContentProject(project)
      .then((result: any) => {
        result = result.json();
        console.log(result);
        if (result.success) {
          this.loadCollaborateProjects();
          this.toastr.success('Interested successfully!', 'Success');
        } else {
          this.toastr.error(result.message, 'Error');
        }
      });
  };

  getListInterest(project, interestType) {
    this.currentProject = this.utils.clone(project);
    if (interestType === 'inviting') {
      this.collaborators = this.currentProject.invitedCollaborators;
    }

    if (interestType === 'interesting') {
      this.collaborators = this.currentProject.interestedCollaborators;
    }

    // this.collaborators = this.currentProject.collaborators;
    this.collaborators = _.map(this.collaborators, item => {
      if (!item.collabShare && item.ownerApprovalStatus != 'accepted') {
        item.collabShare = 15;
      }
      return item;
    });
    this.collaboratorsModal.show();
  }

  acceptCollaborator(collaborator) {
    if (collaborator.collabShare < 1 || collaborator.collabShare > 99) {
      return this.toastr.warning(
        'The sharing percentage must be at least 1% and no more than 99%.',
        'Warning'
      );
    }

    var totalPercentage = collaborator.collabShare;
    this.collaborators.forEach(item => {
      if (item.ownerApprovalStatus === 'accepted') {
        totalPercentage += item.collabShare;
      }
    });

    if (totalPercentage < 1 || totalPercentage > 99) {
      return this.toastr.warning(
        'The total percentage must be at least 1% and no more than 99%.',
        'Warning'
      );
    }

    this.projectsService
      .acceptCollaborator(collaborator, this.currentProject)
      .then((result: any) => {
        result = result.json();
        console.log(result);
        if (result.success) {
          this.toastr.success('Accepted successfully!', 'Success');
          collaborator.ownerApprovalStatus = 'accepted';
          collaborator.collabShareOld = collaborator.collabShare;
          this.updateChangeCollaborator(this.currentProject, collaborator);
        }
      });
  }

  declineCollaborator(collaborator) {
    this.projectsService
      .declineCollaborator(collaborator, this.currentProject)
      .then((result: any) => {
        result = result.json();
        console.log(result);
        if (result.success) {
          this.toastr.success('Declined successfully!', 'Success');
          this.collaborators = _.reject(this.collaborators, item => {
            return item.id == collaborator.id;
          });

          this.collaboratedProjects = _.map(this.collaboratedProjects, item => {
            if (item.projectId == this.currentProject.projectId) {
              item.collaborators = _.reject(item.collaborators, temp => {
                return temp.id == collaborator.id;
              });
              item.interestedCollaborators = this.collaborators;
            }
            return item;
          });
        }
      });
  }

  changeProject(project: any) {
    this.listChangeProjecstModal = this.utils.clone(project);
    this.listChangeProjecstModal.collaborators.forEach(element => {
      element.change = false;
      element.isCollapsed = false;
      if (element.collabShare == null) {
        element.isChangeDiscussed = false;
      } else {
        element.isChangeDiscussed = true;
      }
      element.collabShareOld = element.collabShare;
      element.isChangeDiscussedOld = element.isChangeDiscussed;
    });

    this.listChangeProjecstModal.collaborators = _.filter(
      this.listChangeProjecstModal.collaborators,
      item => {
        return (
          item.ownerApprovalStatus === 'accepted' &&
          (item.approvalStatus === 'agreed' ||
            item.approvalStatus === 'approved')
        );
      }
    );
    console.log(this.listChangeProjecstModal.collaborators);
    this.changeProjectsModal.show();
  }

  cancelChange(collaborator: any) {
    collaborator.change = false;
    collaborator.collabShare = collaborator.collabShareOld;
    collaborator.isChangeDiscussed = collaborator.isChangeDiscussedOld;
  }

  changeCollabShare(collaborator: any) {
    if (
      collaborator.collabShare == collaborator.collabShareOld &&
      collaborator.collabShare != null
    ) {
      return (collaborator.change = false);
    }
    return (collaborator.change = true);
  }

  saveChangeCollaboratorSharingPercentage(collaborator) {
    if (collaborator.collabShare < 1 || collaborator.collabShare > 99) {
      return this.toastr.warning(
        'The sharing percentage must be at least 1% and no more than 99%.',
        'Warning'
      );
    }

    var totalPercentage = 0;
    this.listChangeProjecstModal.collaborators.forEach(item => {
      if (item.ownerApprovalStatus == 'accepted') {
        totalPercentage += item.collabShare;
      }
    });

    if (totalPercentage < 1 || totalPercentage > 99) {
      return this.toastr.warning(
        'The total percentage must be at least 1% and no more than 99%.',
        'Warning'
      );
    }

    this.saving = true;

    this.projectsService
      .changeCollaboratorSharingPercentage(
        collaborator,
        this.listChangeProjecstModal
      )
      .then((result: any) => {
        result = result.json();
        console.log(result);
        if (result.success) {
          this.toastr.success('Accepted successfully!', 'Success');
          collaborator.change = false;
          this.saving = false;
          collaborator.collabShareOld = collaborator.collabShare;

          this.updateChangeCollaborator(
            this.listChangeProjecstModal,
            collaborator
          );
        }
      });
  }

  updateChangeCollaborator(project, collaborator) {
    this.collaboratedProjects.forEach(element => {
      if (element.projectId == project.projectId) {
        element.collaborators = _.map(element.collaborators, i => {
          if (i.id === collaborator.id) {
            i = collaborator;
          }
          return i;
        });

        element.invitedCollaborators = _.map(
          element.invitedCollaborators,
          i => {
            if (i.id === collaborator.id) {
              i = collaborator;
            }
            return i;
          }
        );

        element.interestedCollaborators = _.map(
          element.interestedCollaborators,
          i => {
            if (i.id === collaborator.id) {
              i = collaborator;
            }
            return i;
          }
        );
      }
    });
  }

  finalizeCollaborativeContentProject(project: any) {
    var list: any[] = _.filter(project.collaborators, item => {
      return (
        item.collabShare == null &&
        item.ownerApprovalStatus === 'accepted' &&
        (item.approvalStatus === 'agreed' || item.approvalStatus === 'approved')
      );
    });
    if (list.length > 0) {
      return this.toastr.warning(
        'Sharing percentage must be assigned to the collaborator(s) before the project can be finalized.',
        'Warning'
      );
    }

    this.checkCollaboratorPendingInvitation = _.some(
      project.collaborators,
      item => {
        return item.approvalStatus === 'pending';
      }
    );

    this.finalizeConfirmModal.show();

    $('#finalizeConfirmModal')
      .off('click', '.btn-success')
      .on('click', '.btn-success', () => {
        this.finalining = true;
        project.collaborators = _.filter(project.collaborators, item => {
          return (
            item.ownerApprovalStatus === 'accepted' &&
            (item.approvalStatus === 'approved' ||
              item.approvalStatus === 'agreed')
          );
        });
        this.projectsService
          .finalizeCollaborativeContentProject(project)
          .then((result: any) => {
            result = result.json();
            console.log(result);
            if (result.success) {
              this.toastr.success(
                'Finalized successfully! The project has moved to the MY COLLABORATION area.',
                'Success'
              );
              project.status = 'committed';
              this.collaboratedProjects = _.reject(
                this.collaboratedProjects,
                item => {
                  return item.projectId == project.projectId;
                }
              );
              this.finalining = true;
              this.finalizeConfirmModal.hide();
              this.loadCollaborateProjects();
            }
          });
      });
  }

  canFinalize(project: any) {
    if (project.reviewState !== 'approved') {
      return false;
    }
    var list = [];
    list = _.filter(project.collaborators, item => {
      return (
        item.ownerApprovalStatus == 'accepted' &&
        (item.approvalStatus == 'agreed' || item.approvalStatus == 'approved')
      );
    });
    if (
      list.length > 0 &&
      this.accountService.getUserId() == project.memberId
    ) {
      return true;
    }
    return false;
  }

  changeDiscussed(item: any) {
    item.change = true;
    item.collabShare = 15;
    item.isChangeDiscussed = true;
  }

  getApprovalStatus(project) {
    var collaborator = _.find(project.collaborators, item => {
      return item.id == this.accountService.getUserId();
    });

    if (collaborator) {
      var ownerApprovalStatus =
        collaborator.ownerApprovalStatus == 'pending'
          ? 'Pending Approve'
          : 'Approved';
    } else {
      ownerApprovalStatus = null;
    }

    return ownerApprovalStatus;
  }

  showSharingTBDInfomation() {
    this.toastr.info(
      'The sharing percentage is not set. You can discuss with the owner via the chat prior to accepting or declining the invitation.',
      'Information'
    );
  }

  collaboratorAcceptInvitation(project) {
    this.projectsService
      .collaboratorAcceptInvitation(project)
      .then((result: any) => {
        result = result.json();
        if (result.success) {
          this.toastr.success('Accepted successfully!', 'Success');
          this.loadCollaborateProjects();
        } else {
          this.toastr.error('Error!');
        }
      });
  }

  collaboratorDeclineInvitation(project) {
    this.projectsService
      .collaboratorDeclineInvitation(project)
      .then((result: any) => {
        result = result.json();
        if (result.success) {
          this.toastr.success('Declined successfully!', 'Success');
          this.loadCollaborateProjects();
        } else {
          this.toastr.error('Error!');
        }
      });
  }

  changeCollaborator() {
    if (this.changeSharer.disabledSharingPercentage) {
      this.changeSharer.collabShare = null;
    }
    var info = {
      projectId: this.currentProject.projectId,
      oldCollaborator: this.selectedSharer[0].id,
      newCollaborator: this.changeSharer
    };
    this.saving = true;
    this.projectsService.changeCollaborator(info).then((result: any) => {
      result = result.json();
      this.saving = false;
      if (result.success) {
        this.membersModal.hide();
        this.collaboratedProjects = _.map(this.collaboratedProjects, item => {
          if (item.projectId === info.projectId) {
            item.collaborators = _.map(item.collaborators, i => {
              if (i.id === info.oldCollaborator) {
                var member = {
                  id: info.newCollaborator.id,
                  fullName: info.newCollaborator.fullName,
                  email: info.newCollaborator.email,
                  address: info.newCollaborator.address,
                  roles: info.newCollaborator.roles,
                  about: info.newCollaborator.about,
                  ownerApprovalStatus: 'accepted',
                  approvalStatus: 'pending',
                  collabShare: info.newCollaborator.collabShare
                };
                i = member;
              }
              return i;
            });
          }
          return item;
        });
        this.collaborators = _.map(this.collaborators, item => {
          if (item.id === info.oldCollaborator) {
            var member = {
              id: info.newCollaborator.id,
              fullName: info.newCollaborator.fullName,
              email: info.newCollaborator.email,
              address: info.newCollaborator.address,
              roles: info.newCollaborator.roles,
              about: info.newCollaborator.about,
              ownerApprovalStatus: 'accepted',
              approvalStatus: 'pending',
              collabShare: info.newCollaborator.collabShare
            };
            item = member;
          }
          return item;
        });
        this.collaboratorsModal.show();
      }
    });
  }

  requestSharer(collaborator) {
    var self = this;
    self.allowShow = false;
    self.selectedSharer = [collaborator];
    self.changeSharer = {};
    self.isSharerLoading = true;
    self.pagingSharer.pageSize = self.constants.pageSharerSize[0];
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
          self.collaboratorsModal.hide();
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
            self.membersModal.show();
          }, 200);
        },
        err => {
          self.toastr.error('Error');
          self.isSharerLoading = false;
        }
      );
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
      self.sharers = _.reject(self.sharers, (item: any) => {
        return currentSharers[0].id == item.id;
      });
      for (var i = 0; i < self.sharers.length; i++) {
        if (currentSharers) {
          self.sharers[i].collabShare = 15;
        }
      }
    }
  }

  filterSharers(keyword, memberAttribute) {
    var self = this;
    var blockId = '#m_blockui_sharers_content';
    mApp.block(blockId);
    self.pagingSharer.currentPage = 1;
    self.pagingSharer.pageSize = self.constants.pageSharerSize[1];
    self.projectsService
      .getPartners(
        (self.pagingSharer.currentPage - 1) * self.pagingSharer.pageSize + 1,
        self.pagingSharer.pageSize,
        self.partner.sharer,
        keyword,
        self.currentProject.memberId,
        memberAttribute
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

  backSharerModal() {
    this.membersModal.hide();
    this.collaboratorsModal.show();
  }

  selectSharer(sharer) {
    this.changeSharer = sharer;
  }

  changeDisabledSharingPercentage(item: any) {
    if (!item.disabledSharingPercentage) {
      item.collabShare = 15;
    }
  }

  clearSearchSharers() {
    this.keywordSearch.text = '';
    this.filterSharers('', '');
    this.searchSharers.nativeElement.focus();
  }
}
