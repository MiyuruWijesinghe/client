import {Customertype} from './customertype';
import {Inventory} from './inventory';

export class Inventorycustomertype {
  id: number;
  price: bigint;
  customertype: Customertype;
  inventory: Inventory;


}
