import {User} from './user';
import {Suppliertype} from './suppliertype';
import {Supplierstatus} from './supplierstatus';
import {Item} from './item';

export class Supplier {
  id: number;
  code: string;
  name: string;
  address: string;
  email: string;
  contact1: string;
  contact2: string;
  fax: string;
  description: string;
  tocreation: string;
  todeletion: string;
  suppliertype: Suppliertype;
  supplierstatus: Supplierstatus;
  itemList: Supplier[];
  creator: User;
}
