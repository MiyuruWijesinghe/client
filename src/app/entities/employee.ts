import {Gender} from './gender';
import {Civilstatus} from './civilstatus';
import {Designation} from './designation';
import {Employeestatus} from './employeestatus';
import {User} from './user';
import {Nametitle} from './nametitle';
import {LoggedUser} from '../shared/logged-user';
import {Branch} from './branch';

export class Employee {
  id: number;
  code: string;
  callingname: string;
  fullname: string;
  dobirth: string;
  nic: string;
  address: string;
  email: string;
  mobile: string;
  land: string;
  description: string;
  dorecruite: string;
  photo: File;
  tocreation: string;
  gender: Gender;
  civilstatus: Civilstatus;
  designation: Designation;
  employeestatus: Employeestatus;
  nametitle: Nametitle;
  branch: Branch;
  creator: User;

  public get loggedUserName(): string{
    return LoggedUser.getName();
  }

  constructor() {
  }

}
