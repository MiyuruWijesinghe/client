import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageRequest} from '../shared/page-request';
import {ApiManager} from '../shared/api-manager';
import {ResourceLink} from '../entities/resource-link';
import {EmployeeDataPage} from '../entities/employee-data-page';
import {Employee} from '../entities/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<EmployeeDataPage>{
    const url = pageRequest.getPageRequestURL('employees');
    const employeeDataPage = await this.http.get<EmployeeDataPage>(ApiManager.getURL(url)).toPromise();
    employeeDataPage.content = employeeDataPage.content.map((employee) => Object.assign(new Employee(), employee));
    return employeeDataPage;
  }

  async get(id: number): Promise<Employee>{
    const employee: Employee = await this.http.get<Employee>(ApiManager.getURL(`employees/${id}`)).toPromise();
    return Object.assign(new Employee(), employee);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`employees/${id}`)).toPromise();
  }

  async add(employee: Employee): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`employees`), employee).toPromise();
  }

  async update(id: number, employee: Employee): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`employees/${id}`), employee).toPromise();
  }

  async getPhoto(id: number): Promise<any>{
    return await this.http.get<any>(ApiManager.getURL(`employees/${id}/photo`)).toPromise();
  }
}
