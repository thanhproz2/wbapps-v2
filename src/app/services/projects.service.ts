import { Injectable } from '@angular/core';
import { ApiUrl } from '../utils/apiUrl';
import { ApiService } from './api.service';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private apiUrl: ApiUrl, private apiService: ApiService) { }

  getUserId(){
    return localStorage.getItem('userid');
  }

  getPartners(index: number, limit: number, role: string, filter: any, projectId?: any, memberAttribute?: any) {
    var self = this;
    var myUrl = self.apiUrl.get_members_by_role.replace('{role}', role).replace("{userId}", self.getUserId());
    var myParams = {
        index: index,
        limit: limit,
        filter: filter.trim(),
        projectId: projectId,
        notMemberId: self.getUserId(),
        memberAttribute: memberAttribute
    };
    return self.apiService.httpGet(myUrl,myParams);
  }

  getProjects(index, limit, filter, collaborateFilter, projectFilterStatus, projectId) {
    var self = this;
    var url = self.apiUrl.get_member_projects.replace('{memberId}', self.getUserId())
    var myParams: any = {};
    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }

    if (filter) {
      myParams.filter = filter.trim();
    }

    if (collaborateFilter) {
      myParams.collaborateFilter = collaborateFilter;
    }

    if (projectFilterStatus) {
      myParams.projectFilterStatus = projectFilterStatus;
    }

    if (projectId) {
      myParams.projectId = projectId;
    }

    return self.apiService.httpGet(url,myParams);
  }

  getOwnerList(){
    var self = this;
    var myUrl = self.apiUrl.get_project_owner_list_by_broker.replace('{brokerId}', self.getUserId());
    return self.apiService.httpGet(myUrl);
  }

  isAdmin(){
    if(localStorage.getItem('isAdmin') == "true"){
      return true;
    }
    return false;
  }

  createProject(project, submit) {
    var self = this;
    var memberId = self.getUserId();
    if (self.isAdmin()) {
      if (project.memberId) {
        memberId = project.memberId;
      }
    }
    var myUrl = self.apiUrl.create_member_projects.replace('{memberId}', memberId);
    for (var i in project) {
      if (project[i] == null) {
        delete project[i];
      }
    }
    var myParams: any = {};
    if (submit) {
      myParams.submit = submit;
    }

    return self.apiService.httpPost(myUrl, project, myParams);
  }

  deleteProjects(projects){
    var myUrl = this.apiUrl.get_member_projects.replace('{memberId}', this.getUserId());
    return this.apiService.httpDelete(myUrl, projects);
  }

  submitProjects(projects) {
    var myUrl = this.apiUrl.get_member_projects.replace('{memberId}', this.getUserId());
    return this.apiService.httpPut(myUrl,projects);
  }

  getProjectDetail(project) {
    var myUrl = this.apiUrl.get_member_project.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);
    return this.apiService.httpGet(myUrl);
  }

  completeProject(project) {
    var myUrl = this.apiUrl.complete_project.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);
    return this.apiService.httpPost(myUrl, {});
  }
  
  getCollaboratedProjects(index, limit, filter, projectFilter, projectFilterStatus, filterProjectType, projectId) {
    var myParams: any = {};
    var url: string = this.apiUrl.get_collaborated_projects.replace('{memberId}', this.getUserId());
    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }

    if (filter) {
      myParams.filter = filter.trim();
    }

    if (projectFilter) {
      myParams.projectFilter = projectFilter;
    }

    if (projectFilterStatus) {
      myParams.projectFilterStatus = projectFilterStatus;
    }

    if (filterProjectType) {
      myParams.filterProjectType = filterProjectType;
    }

    if (projectId) {
      myParams.projectId = projectId;
    }

    return this.apiService.httpGet(url, myParams);
  }

  acceptProjectCollaboration(project){
    var myUrl = this.apiUrl.accept_project_collaboration.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);
    return this.apiService.httpPost(myUrl, {});
  }

  declineProjectCollaboration(project) {
    var myUrl = this.apiUrl.decline_project_collaboration.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);
    return this.apiService.httpPost(myUrl, {});
  }

  countProjects() {
    var myUrl = this.apiUrl.count_project_in_tabs.replace('{memberId}', this.getUserId());
    return this.apiService.httpGet(myUrl);
  }

  getInterestedList(projectId, filter) {
    var myUrl = this.apiUrl.get_interested_list_project.replace('{memberId}', this.getUserId()).replace('{projectId}', projectId);
    var myParams: any = {};
    if (filter) {
        myParams.filter = filter;
    }
    return this.apiService.httpGet(myUrl, myParams);
  }

  updateCuratorProject(project) {
    var memberId = this.getUserId();
    var myUrl = this.apiUrl.update_curator_project.replace('{memberId}', memberId);
    for (var i in project) {
        if (project[i] == null) {
            delete project[i];
        }
    }
    return this.apiService.httpPost(myUrl, project);
  }

  completeCurationProject(project) {
    var myUrl = this.apiUrl.curation_complete_project.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);

    return this.apiService.httpPost(myUrl, {});
  }

  clearCurationProject(project) {
    var myUrl = this.apiUrl.clear_curation_project.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);

    return this.apiService.httpPut(myUrl, {});
  }

  becomeCuratorProject(project) {
    var myUrl = this.apiUrl.become_curator_project.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);

    return this.apiService.httpPut(myUrl, project);
  }

  acceptCuratorMarketplaceProject(curator, project) {
    var myUrl = this.apiUrl.accept_curator_project.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId).replace('{collabMemberId}', curator.id);

    return this.apiService.httpPut(myUrl, {});
  }

  declineCuratorMarketplaceProject(curator, project) {
    var myUrl = this.apiUrl.decline_curator_project.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId).replace('{collabMemberId}', curator.id);

    return this.apiService.httpPut(myUrl, {});
  }

  approveCollaborativeContentProject(project) {
    var myUrl = this.apiUrl.approve_collaborative_content_project.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);

    return this.apiService.httpPut(myUrl, {});
  }

  rejectCollaborativeContentProject(project) {
    var myUrl = this.apiUrl.reject_collaborative_content_project.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);

    return this.apiService.httpPut(myUrl, project);
  }

  interestCollaborativeContentProject(project) {
    var myUrl = this.apiUrl.interest_collaborative_content_project.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);

    return this.apiService.httpPut(myUrl, {});
  }

  acceptCollaborator(collaborator, project) {
    var myUrl = this.apiUrl.accept_collaborator.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);

    return this.apiService.httpPut(myUrl, collaborator);
  }

  declineCollaborator(collaborator, project) {
    var myUrl = this.apiUrl.decline_collaborator.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId).replace('{collabMemberId}', collaborator.id);

    return this.apiService.httpPut(myUrl, {});
  }

  changeCollaboratorSharingPercentage(collaborator, project) {
    var myUrl = this.apiUrl.change_collaborator_sharing_percentage.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);

    return this.apiService.httpPut(myUrl, collaborator);
  }

  finalizeCollaborativeContentProject(project) {
    var myUrl = this.apiUrl.finalize_collaborative_content_project.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);

    return this.apiService.httpPut(myUrl, project);
  }

  collaboratorAcceptInvitation(project) {
    var myUrl = this.apiUrl.collaborator_accept_invitation.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);

    return this.apiService.httpPut(myUrl, {});
  }

  collaboratorDeclineInvitation(project) {
    var myUrl = this.apiUrl.collaborator_decline_invitation.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);

    return this.apiService.httpPut(myUrl, {});
  }

  changeCollaborator(info: any){
    var myUrl = this.apiUrl.change_collaborator.replace('{memberId}', this.getUserId()).replace('{projectId}', info.projectId);

    return this.apiService.httpPost(myUrl, info);

  }

  getInterestedCurators(projectId: string, isCount?: boolean){
    var myUrl = this.apiUrl.interested_curators.replace('{memberId}', this.getUserId()).replace('{projectId}', projectId);
    var myParams: any = {};
    if (isCount) {
      myParams.isCount = true;
    }
    return this.apiService.httpGet(myUrl, myParams);
  }
  setAutoPostComment(project) {
    var myUrl = this.apiUrl.set_auto_post_comment.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);

    return this.apiService.httpPut(myUrl, project);
  }
  getInfoCuratorRating(curatorId: string, footageId: string, type: string){
    var myUrl = this.apiUrl.get_info_curator_rating.replace('{memberId}', this.getUserId()).replace('{curatorId}', curatorId)
    .replace('{footageId}', footageId).replace('{type}', type);
    var myParams: any = {};
    return this.apiService.httpGet(myUrl, myParams);
  }
  getListCuratorRated(projectId: string){
    var myUrl = this.apiUrl.get_list_curator_rated.replace('{memberId}', this.getUserId()).replace('{projectId}', projectId);
    return this.apiService.httpGet(myUrl);
  }
  addRating(info: any){
    var myUrl = this.apiUrl.add_rating.replace('{memberId}', this.getUserId()).replace('{curatorId}', info.curatorId);
    return this.apiService.httpPost(myUrl, info);
  }
  getResentCollaborators() {
    var url: string = this.apiUrl.get_resent_collaborator.replace('{memberId}', this.getUserId());
    return this.apiService.httpGet(url);
  }
}
