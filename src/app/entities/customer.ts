
import {User} from './user';
import {Customertype} from './customertype';

export class Customer {
  id: number;
  code: string;
  name: string;
  nic: string;
  address: string;
  email: string;
  contact1: string;
  contact2: string;
  passport: string;
  fax: string;
  description: string;
  tocreation: string;
  customertype: Customertype;
  creator: User;
}

