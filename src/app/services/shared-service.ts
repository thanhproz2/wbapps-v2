import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private contentTotal = new Subject<any>();
  private collaborationTotal = new Subject<any>();
  private marketplaceTotal = new Subject<any>();
  private footage = new BehaviorSubject<any>('');
  private footageCuration = new BehaviorSubject<any>('');
  private infoWorkspacePage = new BehaviorSubject<any>('');
  private infoModal = new BehaviorSubject<any>('');
  private footageContent = new BehaviorSubject<any>('');
  private infoSubmitContentPage = new BehaviorSubject<any>('');
  private accessPayout = new BehaviorSubject<boolean>(false);
  private content = new BehaviorSubject<any>('');
  private infoContentPage = new BehaviorSubject<any>('');
  private infoCurationPage = new BehaviorSubject<any>('');
  private currentSelectedProject = new BehaviorSubject<any>('');
  private currentSelectedSharers = new BehaviorSubject<any>('');
  private mediaProductId = new BehaviorSubject<any>(null);
  private currentProjects = new BehaviorSubject<any[]>([]);
  private currentTeamMembers = new BehaviorSubject<any>([]);
  private listFootageIds = new BehaviorSubject<any>([]);

  setCurrentTeamMembers(behave: any) {
    this.currentTeamMembers.next(behave);
  }

  getCurrentTeamMembers(): Observable<any> {
    return this.currentTeamMembers.asObservable();
  }

  setCurrentSelectedSharers(behave: any) {
    this.currentSelectedSharers.next(behave);
  }

  getCurrentSelectedSharers(): Observable<any> {
    return this.currentSelectedSharers.asObservable();
  }

  getCurrentProjects(): Observable<any> {
    return this.currentProjects.asObservable();
  }

  setCurrentProjects(behave: any) {
    return this.currentProjects.next(behave);
  }

  setCurrentSelectedProject(behave: any) {
    this.currentSelectedProject.next(behave);
  }

  getCurrentSelectedProject(): Observable<any> {
    return this.currentSelectedProject.asObservable();
  }

  contentTotal$ = this.contentTotal.asObservable();
  emitContentTotal(change: any) {
    this.contentTotal.next(change);
  }

  collaborationTotal$ = this.collaborationTotal.asObservable();
  emitCollaborationTotal(change: any) {
    this.collaborationTotal.next(change);
  }

  marketplaceTotal$ = this.marketplaceTotal.asObservable();
  emitmarketplaceTotal(change: any) {
    this.marketplaceTotal.next(change);
  }

  footage$ = this.footage.asObservable();
  emitFootage(footage: any) {
    this.footage.next(footage);
  }

  footageCuration$ = this.footageCuration.asObservable();
  emitFootageCuration(footage: any) {
    this.footageCuration.next(footage);
  }

  footageContent$ = this.footageContent.asObservable();
  emitFootageContent(footage: any) {
    this.footageContent.next(footage);
  }

  infoSubmitContentPage$ = this.infoSubmitContentPage.asObservable();
  emitInfoSubmitContentPage(info: any) {
    this.infoSubmitContentPage.next(info);
  }

  infoWorkspacePage$ = this.infoWorkspacePage.asObservable();
  emitInfoWorkspacePage(info: any) {
    this.infoWorkspacePage.next(info);
  }

  infoModal$ = this.infoModal.asObservable();
  emitInfoModal(infoModal: any) {
    this.infoModal.next(infoModal);
  }

  copyText(val: string) {
    console.log('copyText 1');
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    console.log('copyText 2');
  }

  accessPayout$ = this.accessPayout.asObservable();
  emitAccessPayout(change: boolean) {
    this.accessPayout.next(change);
  }

  content$ = this.content.asObservable();
  emitContent(content: any) {
    this.content.next(content);
  }

  infoContentPage$ = this.infoContentPage.asObservable();
  emitInfoContentPage(info: any) {
    this.infoContentPage.next(info);
  }

  infoCurationPage$ = this.infoCurationPage.asObservable();
  emitInfoCurationPage(info: any) {
    this.infoCurationPage.next(info);
  }
  mediaProductId$ = this.mediaProductId.asObservable();
  emitmediaProductId(mediaProductId: any) {
    this.mediaProductId.next(mediaProductId);
  }
  listFootageIds$ = this.listFootageIds.asObservable();
  emitListFootageIds(listFootageIds: any[]) {
    this.listFootageIds.next(listFootageIds);
  }

  removeEmitAll() {
    this.emitInfoCurationPage('');
    this.emitFootageCuration('');
    this.emitInfoModal('');
    this.emitInfoModal('');
    this.emitFootage('');
    this.emitInfoWorkspacePage('');
    this.emitContent('');
    this.emitInfoContentPage('');
    this.emitContent('');
    this.emitInfoContentPage('');
    this.emitmediaProductId(null);
    this.setCurrentProjects([]);
    this.setCurrentSelectedProject(null);
  }
}
