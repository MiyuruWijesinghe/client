import {Branch} from './branch';
import {Item} from './item';

export class Purchaseitem {
  id: number;
  qty: bigint;
  unitprice: bigint;
  domanufactured: string;
  doexpired: string;
  batchno: string;
  item: Item;

}
