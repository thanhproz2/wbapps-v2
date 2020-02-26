import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';
import { ApiUrl } from '../utils/apiUrl';
import * as io from 'socket.io-client'
@Injectable({
    providedIn: 'root'
})
export class ChatStudioService {
  private url: string = '';
  private socket;
  constructor(
      private apiService: ApiService,
      private apiUrl: ApiUrl
  ){
    this.url = this.apiUrl.studio_chat_group_address;
    this.socket = io(this.url, { 'forceNew': true });
  }
  joinRoom(data: any): void {
    this.socket.emit('joined', data);
  }
  sendMessage(data: any): void {
    this.socket.emit('message', data);
  }
  getMessage() {
    return Observable.create(observer => {
      this.socket.on("new-message", data => {
        observer.next(data);
      });
    });
  }
  refreshMessage(data: any): void {
    this.socket.emit('refresh-message', data);
  }
  refreshedMessage() {
    return Observable.create(observer => {
      this.socket.on("refreshed-message", data => {
        observer.next(data);
      });
    });
  }
  getUserId() {
    return localStorage.getItem('userid');
  }
  getGroups(projectId: string) {
    // return Observable.create(observer => {
    //     observer.next(this.coins);
    // });
    var myUrl = this.apiUrl.studio_get_groups.replace('{memberId}', this.getUserId()).replace('{projectId}', projectId);
    return this.apiService.httpGet(myUrl);
  }
  createGroup(group: any) {
    var myUrl = this.apiUrl.studio_create_group.replace('{memberId}', this.getUserId()).replace('{projectId}', group.projectId);
    return this.apiService.httpPost(myUrl, group);
  }
  updateGroup(group: any) {
    var myUrl = this.apiUrl.studio_update_group.replace('{memberId}', this.getUserId()).replace('{projectId}', group.projectId)
    .replace('{groupId}', group.groupId);
    return this.apiService.httpPut(myUrl, group);
  }
  deleteGroup(group: any) {
    var myUrl = this.apiUrl.studio_delete_group.replace('{memberId}', this.getUserId()).replace('{projectId}', group.projectId)
    .replace('{groupId}', group.groupId);
    return this.apiService.httpDelete(myUrl, group);
  }
  deleteGroupMember(groupMember: any) {
    var myUrl = this.apiUrl.studio_delete_group_member.replace('{memberId}', this.getUserId())
    .replace('{groupId}', groupMember.groupId).replace('{id}', groupMember.id);
    return this.apiService.httpDelete(myUrl);
  }
  deleteDirectMember(directId: string) {
    var myUrl = this.apiUrl.studio_delete_direct_member.replace('{memberId}', this.getUserId())
    // .replace('{projectId}', projectId)
    .replace('{directId}', directId);
    return this.apiService.httpDelete(myUrl);
  }
  getMembers(index: any, limit: any, keywords?: any) {
    var myUrl = this.apiUrl.studio_get_members.replace('{memberId}', this.getUserId());
    var myParams: any = {};
    if (limit > 0) {
      myParams.index = index;
      myParams.limit = limit;
    }
    if (keywords) {
      myParams.keywords = keywords.trim();
    } 
    return this.apiService.httpGet(myUrl, myParams);
  }
  inviteMember(model: any, type: string) {
    var myUrl = this.apiUrl.studio_invite_member.replace('{memberId}', this.getUserId()).replace('{type}', type);
    return this.apiService.httpPost(myUrl, model);
  }
  getGroupMembers(groupId: string) {
    var myUrl = this.apiUrl.studio_get_group_members.replace('{memberId}', this.getUserId()).replace('{groupId}', groupId);
    return this.apiService.httpGet(myUrl);
  }
  getDirectMembers(projectId: string) {
    var myUrl = this.apiUrl.studio_get_direct_members.replace('{memberId}', this.getUserId()).replace('{projectId}', projectId);
    return this.apiService.httpGet(myUrl);
  }
  getGroupMessages(projectId: string, groupId: string) {
    var myUrl = this.apiUrl.studio_chat_group_get_messages.replace("{memberId}", this.getUserId())
    .replace("{projectId}", projectId).replace("{groupId}", groupId);
    return this.apiService.httpGet(myUrl);
  };
  getDirectMessages(projectId: string, receiverId: string) {
    var myUrl = this.apiUrl.studio_chat_get_direct_messages.replace("{memberId}", this.getUserId())
    .replace("{projectId}", projectId).replace("{receiverId}", receiverId);
    return this.apiService.httpGet(myUrl);
  };
  acceptChatGroup(group: any, status: string) {
    var myUrl = this.apiUrl.studio_accept_chat_group.replace('{memberId}', this.getUserId()).replace('{groupId}', group.groupId)
    .replace('{status}', status);
    return this.apiService.httpPut(myUrl, group);
  }
  acceptChatDirect(direct: any, status: string) {
    var myUrl = this.apiUrl.studio_accept_chat_direct.replace('{memberId}', this.getUserId()).replace('{directId}', direct.id)
    .replace('{status}', status);
    return this.apiService.httpPut(myUrl, direct);
  }
  editMessage(message: any) {
    var myUrl = this.apiUrl.studio_edit_message.replace('{memberId}', this.getUserId())
    .replace('{chatId}', message.chatId);
    return this.apiService.httpPut(myUrl, message);
  }
  deleteMessage(chatId: string) {
    var myUrl = this.apiUrl.studio_delete_message.replace('{memberId}', this.getUserId())
    .replace('{chatId}', chatId);
    return this.apiService.httpDelete(myUrl);
  }
}
