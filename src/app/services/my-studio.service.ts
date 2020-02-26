import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiUrl } from '../utils/apiUrl';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MyStudioService {

  constructor(
    private apiUrl: ApiUrl,
    private _apiService: ApiService
  ) { }

  getUserId() {
    return localStorage.getItem('userid');
  }

  getProjects() {
    const url = this.apiUrl.get_studio_projects.replace('{memberId}', this.getUserId());

    return this._apiService.httpGet(url);
  }

  getTeamMembers(projectId) {
    const url = this.apiUrl.get_team_members.replace('{memberId}', this.getUserId()).replace('{projectId}', projectId);
    return this._apiService.get(url).pipe(map(data => data.json()));
  }

  changeShareOwnership(projectId, data) {
    const url = this.apiUrl.get_team_members.replace('{memberId}', this.getUserId()).replace('{projectId}', projectId);
    const body = {
      data: data
    };
    return this._apiService.httpPut(url, body);
  }

  getVotes(project) {
    const url = this.apiUrl.get_members_votes.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);
    const params = {
      isOwner: project.isOwner
    };
    return this._apiService.get(url, params).pipe(map(data => data.json()));
  }

  voteSharePercentage(projectId, votes) {
    const url = this.apiUrl.get_members_votes.replace('{memberId}', this.getUserId()).replace('{projectId}', projectId);
    const body = {
      votes: votes
    };
    return this._apiService.httpPut(url, body);
  }

  finalizeChanges(projectId, reasons) {
    const url = this.apiUrl.finalize_changes_votes.replace('{memberId}', this.getUserId()).replace('{projectId}', projectId);
    const body = {
      reasons: reasons
    };
    return this._apiService.httpPost(url, body);
  }

  requestVoteAgain(projectId, voteInfo) {
    const url = this.apiUrl.request_vote_again.replace('{memberId}', this.getUserId()).replace('{projectId}', projectId);
    const body = {
      voteInfo: voteInfo
    };
    return this._apiService.httpPost(url, body);
  }

  addMembers(projectId, data) {
    const url = this.apiUrl.add_members.replace('{memberId}', this.getUserId()).replace('{projectId}', projectId);
    const body = data;
    return this._apiService.httpPost(url, body);
  }

  removeMember(projectId, data) {
    const url = this.apiUrl.remove_member.replace('{memberId}', this.getUserId()).replace('{projectId}', projectId);
    const body = {
      data: data
    };
    return this._apiService.httpPost(url, body);
  }

  acceptDeletingMember(projectId) {
    const url = this.apiUrl.accept_deleting.replace('{memberId}', this.getUserId()).replace('{projectId}', projectId);

    return this._apiService.httpDelete(url);
  }


  updateTeamMember(project, member) {
    const url = this.apiUrl.update_team_member.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);
    const body = {
      memberInfo: member
    };
    return this._apiService.httpPut(url, body);
  }

  updateStudioProject(projectInfo) {
    const url = this.apiUrl.update_studio_project.replace('{memberId}', this.getUserId()).replace('{projectId}', projectInfo.projectId);
    const body = {
      projectInfo: projectInfo
    };
    return this._apiService.httpPut(url, body);
  }

  // Tasks
  createFolder(folderInfo, project) {
    const url = this.apiUrl.create_folder.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);
    const body = {
      folderInfo: folderInfo
    };
    return this._apiService.httpPost(url, body);
  }

  updateFolder(folderInfo, project) {
    const url = this.apiUrl.update_folder.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId).replace('{folderId}', folderInfo.folderId);
    const body = {
      folderInfo: folderInfo
    };
    return this._apiService.httpPut(url, body);
  }

  deleteFolder(folder, project) {
    const url = this.apiUrl.update_folder.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId).replace('{folderId}', folder.folderId);

    return this._apiService.httpDelete(url);
  }

  createSubject(subjectInfo, project) {
    const url = this.apiUrl.create_subject.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);
    const body = {
      subjectInfo: subjectInfo
    };
    return this._apiService.httpPost(url, body);
  }

  updateSubject(subjectInfo, project) {
    const url = this.apiUrl.update_subject.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId).replace('{subjectId}', subjectInfo.subjectId);
    const body = {
      subjectInfo: subjectInfo
    };
    return this._apiService._httpPut(url, body);
  }

  deleteSubject(subject, project) {
    const url = this.apiUrl.update_subject.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId).replace('{subjectId}', subject.subjectId);

    return this._apiService._httpDelete(url);
  }

  getFolders(project) {
    const url = this.apiUrl.create_folder.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);

    return this._apiService.httpGet(url);
  }

  sortableFolders(foldersInfo, project) {
    const url = this.apiUrl.create_folder.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);
    const body = {
      foldersInfo: foldersInfo
    };
    return this._apiService.httpPut(url, body);
  }

  getSubjects(project) {
    const url = this.apiUrl.create_subject.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);

    return this._apiService.httpGet(url);
  }

  createActivity(activityInfo, project) {
    const url = this.apiUrl.create_activity.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);
    const body = {
      activityInfo: activityInfo
    };

    return this._apiService.httpPost(url, body);
  }

  updateActivity(activityInfo, project) {
    const url = this.apiUrl.update_activity.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId).replace('{activityId}', activityInfo.activityId);
    const body = {
      activityInfo: activityInfo
    };

    return this._apiService.httpPut(url, body);
  }

  deleteActivity(activityInfo, project) {
    const url = this.apiUrl.update_activity.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId).replace('{activityId}', activityInfo.activityId);

    return this._apiService.httpDelete(url);
  }

  sortableActivities(activitiesInfo, project) {
    const url = this.apiUrl.create_activity.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);
    const body = {
      activitiesInfo: activitiesInfo
    };

    return this._apiService.httpPut(url, body);
  }

  getActivities(project) {
    const url = this.apiUrl.create_activity.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);

    return this._apiService.httpGet(url);
  }

  filterActivities(project, params) {
    const url = this.apiUrl.filter_activities.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);
    return this._apiService._httpGet(url, params);
  }

  searchActivities(project, params) {
    const url = this.apiUrl.search_activities.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);
    return this._apiService._httpGet(url, params);
  }

  getDetailProject(project) {
    const url = this.apiUrl.get_studio_project.replace('{memberId}', this.getUserId()).replace('{projectId}', project.projectId);

    return this._apiService.get(url);
  }

  createComment(comment) {
    const url = this.apiUrl.create_activity_comment.replace('{memberId}', this.getUserId()).replace('{activityId}', comment.activityId);
    return this._apiService._httpPost(url, comment);
  }

  deleteComment(comment) {
    const url = this.apiUrl.update_activity_comment.replace('{memberId}', this.getUserId()).replace('{activityId}', comment.activityId).replace('{commentId}', comment.commentId);
    return this._apiService._httpDelete(url);
  }

  updateComment(comment) {
    const url = this.apiUrl.update_activity_comment.replace('{memberId}', this.getUserId()).replace('{activityId}', comment.activityId).replace('{commentId}', comment.commentId);
    return this._apiService._httpPut(url, comment);
  }

  getActivityComments(activity) {
    const url = this.apiUrl.create_activity_comment.replace('{memberId}', this.getUserId()).replace('{activityId}', activity.activityId);
    return this._apiService._httpGet(url);
  }

}
