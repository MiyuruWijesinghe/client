
import {User} from './user';
import {Saleitem} from './saleitem';
import {Salepayment} from './salepayment';
import {Customer} from './customer';
import {Branch} from './branch';
import {Inventory} from './inventory';

export class Sale {
  id: number;
  code: string;
  tocreation: string;
  amount: bigint;
  discount: bigint;
  total: bigint;
  description: string;
  creator: User;
  saleitemList: Saleitem[];
  // salepaymentList: Salepayment[];
  date: Date;
  customer: Customer;
  branch: Branch;


}
