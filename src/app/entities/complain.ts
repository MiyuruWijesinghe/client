import {User} from './user';
import {Item} from './item';

export class Complain {
  id: number;
  code: string;
  name: string;
  nic: string;
  address: string;
  contact: string;
  description: string;
  tocreation: string;
  date: string;
  creator: User;
  item: Item;
}
