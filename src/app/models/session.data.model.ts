export class SessionData {
  acceptAgreement: boolean;
  fullname: string;
  isAdmin: boolean;
  isBroker: boolean;
  isCurator: boolean;
  isFootageReviewer: boolean;
  isMediaReviewer: boolean;
  isMarketingManagement: boolean;
  isSaleManagement: boolean;
  lastLoginTime: Date;
  location: string;
  message: string;
  profileComplete: boolean;
  roles: [];
  success: boolean;
  token: string;
  userid: string;
  username: string;
  firstName: string;
  availableCuration: boolean;
  canActive: boolean;
  chatEmailNotify: boolean;
  rating: string
  constructor(
    token: string,
    userid: string,
    acceptAgreement: boolean,
    fullname: string,
    username: string,
    isAdmin: boolean,
    isBroker: boolean,
    isCurator: boolean,
    isFootageReviewer: boolean,
    isMediaReviewer: boolean,
    isMarketingManagement: boolean,
    isSaleManagement: boolean,
    lastLoginTime: Date,
    location: string,
    message: string,
    profileComplete: boolean,
    roles: any,
    success: boolean,
    firstName: string,
    availableCuration: boolean,
    canActive: boolean,
    chatEmailNotify: boolean,
    rating: string
  ) {
    this.token = token;
    this.userid = userid;
    this.acceptAgreement = acceptAgreement;
    this.fullname = fullname;
    this.username = username;
    this.isAdmin = isAdmin;
    this.isBroker = isBroker;
    this.isCurator = isCurator;
    this.isFootageReviewer = isFootageReviewer;
    this.isMediaReviewer = isMediaReviewer;
    this.isMarketingManagement = isMarketingManagement;
    this.isSaleManagement = isSaleManagement;
    this.lastLoginTime = lastLoginTime;
    this.location = location;
    this.message = message;
    this.profileComplete = profileComplete;
    this.roles = roles;
    this.success = success;
    this.firstName = firstName;
    this.availableCuration = availableCuration;
    this.canActive = canActive;
    this.chatEmailNotify = chatEmailNotify;
    this.rating = rating;
  }
}
