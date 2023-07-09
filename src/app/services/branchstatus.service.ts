import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Suppliertype} from '../entities/suppliertype';
import {ApiManager} from '../shared/api-manager';
import {Branchstatus} from '../entities/branchstatus';

@Injectable({
  providedIn: 'root'
})
export class BranchstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Branchstatus[]>{
    const branchstatuses: Branchstatus[] = await this.http.get<Branchstatus[]>(ApiManager.getURL('branchstatuses')).toPromise();
    return branchstatuses.map((branchstatus) => Object.assign(new Suppliertype(), branchstatus) );
  }
}
