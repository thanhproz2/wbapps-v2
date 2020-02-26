export class CommentModel {
  commentId: number;
  memberId: string;
  activityId: string;
  parentCommentId: string;
  text: string;
  createdAt: string;
  replyText: string;
  replyMode: boolean;
  replyTo: string;

  Member: MemberModel;
  ReplyTo: MemberModel;
  Replies: any[];

  showAction: boolean;
  loading: boolean;

  constructor() {
    this.commentId = null;
    this.memberId = null;
    this.activityId = null;
    this.parentCommentId = null;
    this.text = null;
  }
}

class MemberModel {
  fullName: string;
}
