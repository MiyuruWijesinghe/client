import {Inventory} from './inventory';
import {Item} from './item';

export class Saleitem {
  id: number;
  name: string;
  qty: bigint;
  unitprice: bigint;
  item: Item;
  inventory: Inventory;
 }
