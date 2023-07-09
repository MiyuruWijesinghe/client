
import {User} from './user';
import {Itemstatus} from './itemstatus';
import {Unit} from './unit';
import {Itemtype} from './itemtype';
import {Itembranch} from './itembranch';
import {Itemcategory} from './itemcategory';

export class Item {
  id: number;
  code: string;
  name: string;
  tocreation: string;
  itemtype: Itemtype;
  itemstatus: Itemstatus;
  itemcategory: Itemcategory;
  unit: Unit;
  image: string;
  lastprice: bigint;
  description: string;
  creator: User;
  itembranchList: Itembranch[];
}
