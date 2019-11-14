export class Organization {
  id: number;
  title: string;
  employees: string;
  country: string;
  city: string;
  address: string;
  postcode: string;
  phone: number;
  email: string;
  website: string;
  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
    }
  }
}
