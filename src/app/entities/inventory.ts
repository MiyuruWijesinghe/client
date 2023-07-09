import {Branch} from './branch';
import {Item} from './item';
import {User} from './user';
import {Inventorycustomertype} from './inventorycustomertype';

export class Inventory {
  id: number;
  code: string;
  doexpired: string;
  domanufactured: string;
  branch: Branch;
  item: Item;
  initqty: bigint;
  qty: bigint;
  batchno: string;
  creator: User;
  inventorycustomertypeList: Inventorycustomertype[];

}
