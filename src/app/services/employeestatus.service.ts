import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Employeestatus} from '../entities/employeestatus';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class EmployeestatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Employeestatus[]>{
    const employeestatuses: Employeestatus[] = await this.http.get<Employeestatus[]>(ApiManager.getURL('employeestatuses')).toPromise();
    return employeestatuses.map((employeestatus) => Object.assign(new Employeestatus(), employeestatus));
  }
}
