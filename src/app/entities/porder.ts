
import {User} from './user';
import {Supplier} from './supplier';
import {Porderstatus} from './porderstatus';
import {Branch} from './branch';
import {Itembranch} from './itembranch';
import {Porderitem} from './porderitem';

export class Porder {
  id: number;
  code: string;
  description: string;
  dorequired: string;
  doordered: string;
  dorecieved: string;
  tocreation: string;
  porderstatus: Porderstatus;
  supplier: Supplier;
  branch: Branch;
  creator: User;
  porderitemList: Porderitem[];

}
