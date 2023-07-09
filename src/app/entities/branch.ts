import {User} from './user';
import {Branchstatus} from './branchstatus';
import {Itembranch} from './itembranch';
import {Porderitem} from './porderitem';

export class Branch {
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
  dorecruite: string;
  branchstatus: Branchstatus;
  itembranchList: Itembranch[];

  creator: User;
 }
