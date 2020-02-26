import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { from } from 'rxjs';
@Injectable()
export class ApiUrl {
  api_address: string = environment.baseApiUrl;
  apiChat: string = environment.baseApiChat;
  chat_address: string = this.apiChat;
  group_chat_threads_address: string = environment.groupChatThreadsUrl;

  // Camera
  member_cameras: string = this.api_address + '/member/{memberId}/cameras';
  details_camera: string =
    this.api_address + '/member/{memberId}/cameras/{cameraId}';
  default_camera: string =
    this.api_address + '/member/{memberId}/cameras/default';

  // USER
  login: string = this.api_address + '/login';
  forgot_password: string = this.api_address + '/forgotPassword';
  unRegister: string = this.api_address + '/un-register';
  upload_government: string = this.api_address + '/register/governmentUpload';
  register: string = this.api_address + '/register';
  member_info: string = this.api_address + '/member/{memberId}/info';
  profile_settings: string =
    this.api_address + '/member/{memberId}/profileSettings';
  upload_avatar: string = this.api_address + '/member/{memberId}/avatarUpload';
  update_password: string = this.api_address + '/member/{memberId}/password';
  accept_agreement: string =
    this.api_address + '/member/{memberId}/acceptAgreement';
  get_avatar: string =
    this.api_address + '/member/{memberId}/{defaultType}/avatar';
  logout: string = this.api_address + '/member/{memberId}/logout';
  upload_member_government: string =
    this.api_address + '/member/{memberId}/governmentUpload';
  changeCuration: string =
    this.api_address + '/member/{memberId}/changeCuration';
  reset_password: string = this.api_address + '/resetPassword';

  // Footage
  get_contribute_footages: string =
    this.api_address + '/member/{memberId}/contribute/footage';
  thumbnail: string = this.api_address + '/{memberId}/thumbnail/';
  get_member_footage_documents: string =
    this.api_address + '/member/{memberId}/footage/{footageId}/document';
  delete_footages: string = this.api_address + '/member/{memberId}/footages';
  get_members_by_role: string = this.api_address + '/{userId}/members/{role}';
  update_footage: string =
    this.api_address + '/member/{memberId}/footage/{footageId}';
  upload_footage_document: string =
    this.api_address + '/member/{memberId}/document/{documentType}/upload';
  get_footage_video: string =
    this.api_address + '/member/{memberId}/footage/{footageId}/getVideo';
  update_batch_footages: string =
    this.api_address + '/member/{memberId}/batch/{batchId}/footages';
  assign_footage_curator: string =
    this.api_address + '/footage/{memberId}/assignCurator';
  create_batch: string = this.api_address + '/footage/{memberId}/createBatch';
  upload_csv: string = this.api_address + '/member/{memberId}/csv/upload';
  submit_footages: string = this.api_address + '/member/{memberId}/footages';
  get_content_footages: string =
    this.api_address + '/member/{memberId}/content/footage';
  edited_content_footage: string =
    this.api_address + '/member/{memberId}/content/{footageId}';
  approve_footage: string =
    this.api_address + '/member/{memberId}/footage/{footageId}/approve';
  reject_footage: string =
    this.api_address + '/member/{memberId}/footage/{footageId}/reject';
  get_curation_footages: string =
    this.api_address + '/member/{memberId}/curationFootage';
  refused_by_curation: string =
    this.api_address + '/member/{memberId}/footages/refuse';
  curator_update_footage: string =
    this.api_address + '/member/{memberId}/curationFootage/{footageId}';
  count_in_tab: string =
    this.api_address + '/member/{memberId}/footage/count_in_tabs';
  upload_csv_curator: string =
    this.api_address + '/member/{memberId}/csv/curator/upload';
  upload_files: string = this.api_address + '/member/{memberId}/footage/upload';
  change_sharer: string =
    this.api_address + '/member/{memberId}/footage/{footageId}/change_sharer';
  get_curation_owners: string =
    this.api_address + '/member/{memberId}/curationFootage/getCurationOwners';
  get_list_batch_name: string =
    this.api_address + '/member/{memberId}/footage/getListBatchName';
  count_upload_project: string =
    this.api_address + '/member/{memberId}/countUploadProject';
  get_footage: string =
    this.api_address + '/member/{memberId}/contribute/footage/{footageId}';

  // Release
  view_release: string =
    this.api_address + '/member/{memberId}/release/{documentId}/view';
  get_release: string =
    this.api_address + '/member/{memberId}/releases/{documentId}';
  delete_release: string =
    this.api_address + '/member/{memberId}/release/{documentId}';
  attach_release_for_footage: string =
    this.api_address + '/member/{memberId}/footage/{footageId}/attach_release';
  deattach_release_for_footage: string =
    this.api_address +
    '/member/{memberId}/footage/{footageId}/deattach_release/{documentId}';
  count_releases: string =
    this.api_address + '/member/{memberId}/count-releases';
  attach_release_for_media_product: string =
    this.api_address +
    '/member/{memberId}/media_product/{mediaProductId}/attach_release';
  deattach_release_for_media_product: string =
    this.api_address +
    '/member/{memberId}/media_product/{mediaProductId}/deattach_release/{documentId}';
  // FootageProjects
  complete_project: string =
    this.api_address + '/member/{memberId}/project/{projectId}/complete';
  get_member_projects: string =
    this.api_address + '/member/{memberId}/footageProject';
  create_member_projects: string =
    this.api_address + '/member/{memberId}/footageProject';
  get_member_project: string =
    this.api_address + '/member/{memberId}/footageProject/{projectId}';
  upload_project_content: string =
    this.api_address +
    '/member/{memberId}/footageProject/{projectId}/contentUpload';
  download_project_content: string =
    this.api_address + '/{memberId}/downloadContent/{projectId}';
  get_collaborated_projects: string =
    this.api_address + '/member/{memberId}/collaboratedProjects';
  accept_project_collaboration: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/acceptCollaboration';
  decline_project_collaboration: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/declineCollaboration';
  count_project_in_tabs: string =
    this.api_address + '/member/{memberId}/project/count';
  get_interested_list_project: string =
    this.api_address +
    '/member/{memberId}/footageProject/{projectId}/interestedList';
  update_curator_project: string =
    this.api_address + '/member/{memberId}/projectCurator';
  curation_complete_project: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/curationComplete';
  clear_curation_project: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/clearCurationProject';
  become_curator_project: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/becomeCuratorProject';
  accept_curator_project: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/acceptCuratorMarketplaceProject/{collabMemberId}';
  decline_curator_project: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/declineCuratorMarketplaceProject/{collabMemberId}';
  approve_collaborative_content_project: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/approveCollaborativeContentProject';
  reject_collaborative_content_project: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/rejectCollaborativeContentProject';
  interest_collaborative_content_project: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/interestCollaborativeContentProject';
  decline_collaborator: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/declineCollaborator/{collabMemberId}';
  accept_collaborator: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/acceptCollaborator';
  change_collaborator_sharing_percentage: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/changeCollaboratorSharingPercentage';
  finalize_collaborative_content_project: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/finalizeCollaborativeContentProject';
  collaborator_accept_invitation: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/collaboratorAcceptInvitation';
  collaborator_decline_invitation: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/collaboratorDeclineInvitation';
  change_collaborator: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/changeCollaborator';
  interested_curators: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/getInterestedCurators';
  set_auto_post_comment: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/setAutoPostComment';
  get_info_curator_rating: string =
    this.api_address +
    '/member/{memberId}/curator/{curatorId}/footage/{footageId}/type/{type}/getInfoCuratorRating';
  add_rating: string =
    this.api_address + '/member/{memberId}/curator/{curatorId}/addRating';
  get_list_curator_rated: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/getListCuratorRated';
  get_resent_collaborator: string =
    this.api_address + '/member/{memberId}/rating/getResentCollaborators';
  // Footage Documents
  get_member_documents: string =
    this.api_address + '/member/{memberId}/document';
  update_document: string =
    this.api_address + '/member/{memberId}/document/{documentId}';

  // Tools Tab
  download_template: any = this.api_address + '/templates/{type}';

  // Dashboard Tab
  get_summary_info: any = this.api_address + '/member/{memberId}/summaryInfo';
  get_popular_footages: any = this.api_address + '/footage/popularFootage';
  get_earning_summary: any =
    this.api_address + '/member/{memberId}/earningSummary';
  search_admin_footage: any =
    this.api_address + '/member/{memberId}/searchAdmin/footage';
  search_admin_project: any =
    this.api_address + '/member/{memberId}/searchAdmin/footageProject';
  search_footage: any = this.api_address + '/member/{memberId}/search/footage';
  search_project: any =
    this.api_address + '/member/{memberId}/search/footageProject';
  get_recently_online_fooatges: string =
    this.api_address + '/member/{memberId}/get-recently-online-footages';

  // Notifications
  get_notifications: string =
    this.api_address + '/member/{memberId}/notifications';
  read_notification: string =
    this.api_address + '/member/{memberId}/notifications/{notificationId}';

  // Media Products
  add_media_product: string =
    this.api_address + '/member/{memberId}/project/{projectId}/mediaProduct';
  re_upload_media_product: string =
    this.api_address +
    '/member/{memberId}/project/{projectId}/last-mediaProduct';
  get_media_products: string =
    this.api_address + '/member/{memberId}/mediaProducts';
  update_media_product: string =
    this.api_address + '/member/{memberId}/mediaProducts/{mediaProductId}';
  count_media_products: string =
    this.api_address + '/member/{memberId}/mediaProducts/count';
  refuse_curation_media_products: string =
    this.api_address +
    '/member/{memberId}/mediaProducts/refuseCurationMediaProducts';
  assign_curator: string =
    this.api_address + '/member/{memberId}/mediaProducts/assignCurator';
  get_curation_media_products: string =
    this.api_address + '/member/{memberId}/mediaProducts/getCuration';
  submit_media_products: string =
    this.api_address + '/member/{memberId}/mediaProducts/submitMediaProducts';
  get_submitted_media_products: string =
    this.api_address + '/member/{memberId}/mediaProducts/getSubmitted';
  thumbnail_media_products: string =
    this.api_address + '/member/{memberId}/mediaProducts/thumbnail/';
  get_media_products_video: string =
    this.api_address +
    '/member/{memberId}/mediaProducts/{mediaProductId}/getVideo';
  get_last_media_products_video: string =
    this.api_address +
    '/member/{memberId}/mediaProducts/{mediaProductId}/getLastScale';
  create_comment: string =
    this.api_address + '/member/{memberId}/mediaProduct/{mediaProductId}';
  save_member_view_content: string =
    this.api_address +
    '/member/{memberId}/mediaProducts/{mediaProductId}/memberViewContent';
  member_view_content: string =
    this.api_address +
    '/member/{memberId}/mediaProducts/{mediaProductId}/memberViewContent';
  get_media_product: string =
    this.api_address + '/member/mediaProduct/{mediaProductId}';
  create_thumbnail_media_product: string =
    this.api_address +
    '/member/{memberId}/mediaProduct/{mediaProductId}/createThumbnailMediaProduct';
  get_user_approval: string =
    this.api_address +
    '/member/{memberId}/mediaProduct/{mediaProductId}/getUserApproval';
  approval_media_product: string =
    this.api_address +
    '/member/{memberId}/mediaProduct/{mediaProductId}/approvalMediaProduct';
  import_thumbnail_media_product: string =
    this.api_address +
    '/member/{memberId}/mediaProduct/{mediaProductId}/importThumbnailMediaProduct';
  import_call_to_action_media_product: string =
    this.api_address +
    '/member/{memberId}/mediaProduct/{mediaProductId}/importCallToAction';
  import_end_screen_media_product: string =
    this.api_address +
    '/member/{memberId}/mediaProduct/{mediaProductId}/importEndScreen';
  get_call_to_action: string =
    this.api_address + '/member/{memberId}/mediaProduct/callToAction/';
  get_end_screen: string =
    this.api_address + '/member/{memberId}/mediaProduct/endScreen/';
  remove_file_media_product: string =
    this.api_address +
    '/member/{memberId}/mediaProducts/{mediaProductId}/removeFileMediaProduct/{type}';
  get_custom_image: string =
    this.api_address + '/member/{memberId}/mediaProduct/customImage/';
  remove_custom_image: string =
    this.api_address +
    '/member/{memberId}/mediaProducts/{mediaProductId}/removeCustomImage/{type}';
  // Media product document
  get_media_product_documents: string =
    this.api_address + '/member/{memberId}/mediaProduct/documents';
  // My Studio module
  get_studio_projects: string =
    this.api_address + '/member/{memberId}/studio-projects';
  get_studio_project: string =
    this.api_address + '/member/{memberId}/studio-projects/{projectId}';
  get_team_members: string =
    this.api_address + '/member/{memberId}/team-members/{projectId}';
  get_members_votes: string =
    this.api_address + '/member/{memberId}/team-members/{projectId}/votes';
  finalize_changes_votes: string =
    this.api_address +
    '/member/{memberId}/team-members/{projectId}/votes/finalize-changes';
  request_vote_again: string =
    this.api_address +
    '/member/{memberId}/team-members/{projectId}/votes/request-vote-again';
  update_team_member: string =
    this.api_address + '/member/{memberId}/team-members/{projectId}/update';
  add_members: string =
    this.api_address + '/member/{memberId}/team-members/{projectId}/add';
  remove_member: string =
    this.api_address + '/member/{memberId}/team-members/{projectId}/remove';
  accept_deleting: string =
    this.api_address +
    '/member/{memberId}/team-members/{projectId}/accept-deleting';
  send_private_email: string =
    this.api_address + '/member/{memberId}/send-private-email';
  update_studio_project: string =
    this.api_address + '/member/{memberId}/studio-projects/{projectId}';

  // My Studio module - Tasks
  create_folder: string =
    this.api_address + '/member/{memberId}/studio-projects/{projectId}/folders';
  update_folder: string =
    this.api_address +
    '/member/{memberId}/studio-projects/{projectId}/folders/{folderId}';
  create_subject: string =
    this.api_address +
    '/member/{memberId}/studio-projects/{projectId}/subjects';
  update_subject: string =
    this.api_address +
    '/member/{memberId}/studio-projects/{projectId}/subjects/{subjectId}';
  create_activity: string =
    this.api_address +
    '/member/{memberId}/studio-projects/{projectId}/activities';
  update_activity: string =
    this.api_address +
    '/member/{memberId}/studio-projects/{projectId}/activities/{activityId}';
  filter_activities: string =
    this.api_address +
    '/member/{memberId}/studio-projects/{projectId}/filter-activities';
  search_activities: string =
    this.api_address +
    '/member/{memberId}/studio-projects/{projectId}/search-activities';
  create_activity_comment: string =
    this.api_address + '/member/{memberId}/activities/{activityId}/comments';
  update_activity_comment: string =
    this.api_address +
    '/member/{memberId}/activities/{activityId}/comments/{commentId}';

  // ADMIN
  get_referral_members: any =
    this.api_address + '/member/{memberId}/getReferralMembers';
  get_project_owner_list_by_broker: string =
    this.api_address + '/{brokerId}/projectOwners';
  update_member_profile_by_admin: string =
    this.api_address + '/{adminId}/member/{memberId}/info';
  approve_profile: string = this.api_address + '/{adminId}/approve/{memberId}';
  decline_profile: string = this.api_address + '/{adminId}/decline/{memberId}';
  update_referral: string = this.api_address + '/{adminId}/updateReferral';
  remove_referral: string =
    this.api_address + '/{adminId}/removeReferral/{memberId}';
  loginByAdmin: string = this.api_address + '/member/{memberId}/loginByAdmin';
  reset_account: string = this.api_address + '/{adminId}/reset/{memberId}';
  lock_member: string = this.api_address + '/{adminId}/lock/{memberId}';
  unlock_member: string = this.api_address + '/{adminId}/unlock/{memberId}';

  // Admin-Notifications
  admin_get_notifications: string =
    this.api_address + '/admin/{adminId}/notifications';
  admin_create_notification: string =
    this.api_address + '/admin/{adminId}/notifications';
  admin_get_one_notification: string =
    this.api_address + '/admin/{adminId}/notifications/{notificationId}';
  admin_update_notification: string =
    this.api_address + '/admin/{adminId}/notifications/{notificationId}';
  admin_delete_notification: string =
    this.api_address + '/admin/{adminId}/notifications/{notificationId}';

  // Admin-Members
  get_member_list_by_admin: string = this.api_address + '/{adminId}/member';
  export_social_media_info: string =
    this.api_address + '/{adminId}/exportSocialMedia';
  change_referral_percentage: string =
    this.api_address + '/{adminId}/changeReferralPercentage';
  get_member_profile_by_admin: string =
    this.api_address + '/{adminId}/member/{memberId}/info';
  governmentID: string =
    this.api_address + '/{adminId}/info/{memberId}/governmentID';
  admin_approve_govt_ID: string =
    this.api_address + '/{adminId}/info/{memberId}/approveGovt';
  admin_decline_govt_ID: string =
    this.api_address + '/{adminId}/info/{memberId}/declineGovt';

  // Admin-Requests
  change_sharing_requests: string =
    this.api_address + '/{adminId}/change-sharing-requests';
  approve_request: string =
    this.api_address + '/{adminId}/change-sharing-requests/approve';

  // Portal admin
  member_reporting: string = this.api_address + '/{adminId}/memberReporting';
  member_reporting_details: string =
    this.api_address + '/{adminId}/{memberId}/memberReportingDetails';
  payout_for_member: string =
    this.api_address + '/{adminId}/member/{memberId}/payout';
  get_next_payout: string = this.api_address + '/{adminId}/nextPayout';
  delete_profile: string = this.api_address + '/{adminId}/delete/{memberId}';
  change_payout_exclusion: string =
    this.api_address + '/{adminId}/updatePayoutExclusion';
  // statistical admin
  statistical_footage_status: string =
    this.api_address +
    '/{adminId}/statistical/footageStatus/site/{site}/type/{type}/fromDate/{fromDate}/toDate/{toDate}';
  // Chat
  chat_message: string =
    this.api_address +
    '/member/{memberId}/sender/{senderId}/project/{projectId}/message';
  chat_group_message: string =
    this.api_address +
    '/member/{memberId}/sender/{senderId}/project/{projectId}/group/{groupId}/message';
  // Earnings Tab
  get_revenue: string = this.api_address + '/member/{memberId}/revenue';
  get_earnings_report: string =
    this.api_address + '/member/{memberId}/earningsReport';
  get_payment_history: string =
    this.api_address + '/member/{memberId}/paymentHistory';
  count_earnings: string =
    this.api_address + '/member/{memberId}/count-earnings';
  annual_summary: string =
    this.api_address + '/member/{memberId}/annual-summary';
  admin_summary_info: string = this.api_address + '/{adminId}/summaryInfo';
  get_members_by_status: string =
    this.api_address + '/{adminId}/membersByStatus/{status}';
  get_members_not_made_sales: string =
    this.api_address + '/{adminId}/membersNotMadeSales';
  send_mail: string = this.api_address + '/{adminId}/sendMail';

  // Media Reviewer Module
  review_media: string = this.api_address + '/member/{memberId}/media-products';
  in_review_media: string =
    this.api_address + '/member/{memberId}/media-products/in-review';
  get_more_media: string =
    this.api_address + '/member/{memberId}/media-products/in-review/get-more';
  reviewer_approve_media: string =
    this.api_address +
    '/member/{memberId}/media-products/{mediaProductId}/reviewer-approve';
  reviewer_reject_media: string =
    this.api_address +
    '/member/{memberId}/media-products/{mediaProductId}/reviewer-reject';

  // Reviewer Module
  get_all_content_footages: string =
    this.api_address + '/member/{memberId}/footage_review';
  get_deferral_footages: string =
    this.api_address + '/member/{memberId}/deferral_footage';
  get_rejected_footages: string =
    this.api_address + '/member/{memberId}/rejected_footage';
  reviewr_approve_footage: string =
    this.api_address + '/member/{memberId}/footage_review/{footageId}/approve';
  reviewr_reject_footage: string =
    this.api_address + '/member/{memberId}/footage_review/{footageId}/reject';
  update_deferral_content: string =
    this.api_address +
    '/member/{memberId}/deferral_footage/{footageId}/update_deferral_content';
  ignore_rejected_footage: string =
    this.api_address +
    '/member/{memberId}/footage_review/{footageId}/ignore_rejected_footage';
  get_original_footage_video: string =
    this.api_address +
    '/member/{memberId}/footage/{footageId}/downloadOriginalFootage';
  reviewer_approve_footage: string =
    this.api_address + '/member/{memberId}/footage_review/{footageId}/approve';
  reviewer_reject_footage: string =
    this.api_address + '/member/{memberId}/footage_review/{footageId}/reject';
  reject_release_footage: string =
    this.api_address +
    '/member/{memberId}/review_release/{documentId}/{footageId}/reject';
  reviewer_defer_footage: string =
    this.api_address + '/member/{memberId}/footage_review/{footageId}/defer';
  reviewer_need_dowload_footage: string =
    this.api_address +
    '/member/{memberId}/footage_review/{footageId}/need_download';
  get_count_all_footage_review_tab: string =
    this.api_address +
    '/member/{memberId}/footage_review/getCountAllFootageReviewTab';
  export_members_has_high_rejected_rate: string =
    this.api_address +
    '/member/{memberId}/footage_review/get-members-by-rejection-rate';
  get_reviewers: string =
    this.api_address + '/member/{memberId}/footage_review/get-reviewers';

  // Reviewer Module -- Release
  get_releases_by_reviewer: string =
    this.api_address + '/member/{memberId}/reviewer_releases';
  get_more_releases_by_reviewer: string =
    this.api_address + '/member/{memberId}/get_more_releases';
  count_status_release: string =
    this.api_address + '/member/{memberId}/review_release/count_status_release';
  approve_release: string =
    this.api_address + '/member/{memberId}/review_release/{documentId}/approve';
  reject_release: string =
    this.api_address + '/member/{memberId}/review_release/{documentId}/reject';
  count_status_footage: string =
    this.api_address + '/member/{memberId}/footage_review/in_review/count';
  count_deferred_footage: string =
    this.api_address + '/member/{memberId}/footage_review/deferred/count';

  // Reviewer Module -- Search Footage
  reviewer_search_footage: string =
    this.api_address + '/member/{memberId}/footage_review/search';
  // ChatStuido
  studio_get_groups: string =
    this.api_address +
    '/member/{memberId}/chatStudio/project/{projectId}/groups';
  studio_create_group: string =
    this.api_address +
    '/member/{memberId}/chatStudio/project/{projectId}/group';
  studio_update_group: string =
    this.api_address +
    '/member/{memberId}/chatStudio/project/{projectId}/group/{groupId}';
  studio_delete_group: string =
    this.api_address +
    '/member/{memberId}/chatStudio/project/{projectId}/group/{groupId}';
  studio_delete_group_member: string =
    this.api_address +
    '/member/{memberId}/chatStudio/group/{groupId}/groupMember/{id}';
  studio_delete_direct_member: string =
    this.api_address + '/member/{memberId}/chatStudio/directMember/{directId}';
  studio_get_group_members: string =
    this.api_address +
    '/member/{memberId}/chatStudio/group/{groupId}/groupMembers';
  studio_get_direct_members: string =
    this.api_address +
    '/member/{memberId}/chatStudio/project/{projectId}/directMembers';
  studio_get_members: string =
    this.api_address + '/member/{memberId}/chatStudio/members';
  studio_invite_member: string =
    this.api_address + '/member/{memberId}/chatStudio/inviteMember/{type}';
  studio_chat_group_address: string = environment.baseApiStudioChat;
  studio_chat_group_get_messages: string =
    this.api_address +
    '/member/{memberId}/chatStudio/project/{projectId}/group/{groupId}/groupMessages';
  studio_chat_get_direct_messages: string =
    this.api_address +
    '/member/{memberId}/chatStudio/project/{projectId}/receive/{receiverId}/directMessages';
  studio_accept_chat_group: string =
    this.api_address +
    '/member/{memberId}/chatStudio/group/{groupId}/acceptChat/{status}';
  studio_accept_chat_direct: string =
    this.api_address +
    '/member/{memberId}/chatStudio/direct/{directId}/acceptChat/{status}';
  studio_delete_message: string =
    this.api_address + '/member/{memberId}/chatStudio/message/{chatId}';
  studio_edit_message: string =
    this.api_address + '/member/{memberId}/chatStudio/message/{chatId}';
}
