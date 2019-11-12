export class Organization {
  companyName: string;
  siteUrl: string;

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
    }
  }
}
