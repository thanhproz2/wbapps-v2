export class Account {
  public userType: string;
  public firstName: string;
  public lastName: string;
  public companyName: string;
  public telephone: string;
  public username: string;
  public email: string;
  public city: string;
  public country: string;
  public preferenceInterests: string;
  public expertisePrimary: string;
  public expertiseSecondary: string;
  public expertiseTierary: string;
  public referrer: string;
  public referralSourceId: string;
  public referralDescription: string;
  public governmentPath: string;
  public firstSocial: string;
  public secondSocial: string;
  public firstSocialAddress: string;
  public secondSocialAddress: string;
  public governmentFileName: string;
  public isValidAge: boolean;
  public professionalType: string;
  public settings: any;
}

export class AccountProfile {
  public Profile: any = {
    settings: {
      notify: {},
      social: {}
    }
  };
  public address: any = {};
  public referralLink: string;
  public fullName: string;
  public firstName: string;
  public userType: string;
  public username: string;
  public password: any;
  public reUserName: string;
  public referralCode: string;
}
