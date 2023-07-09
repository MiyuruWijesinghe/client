
import {Branch} from './branch';
import {User} from './user';
import {Porder} from './porder';
import {Purchaseitem} from './purchaseitem';

export class Purchase {
  id: number;
  code: string;
  description: string;
  date: string;
  tocreation: string;
  branch: Branch;
  porder: Porder;
  creator: User;
  amount: bigint;
  taxamount: bigint;
  totalamount: bigint;
  purchaseitemList: Purchaseitem[];
}
