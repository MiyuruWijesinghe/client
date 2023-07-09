import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageRequest} from '../shared/page-request';
import {PorderDataPage} from '../entities/porder-data-page';
import {ApiManager} from '../shared/api-manager';
import {Porder} from '../entities/porder';
import {ResourceLink} from '../entities/resource-link';
import {BranchDataPage} from '../entities/branch-data-page';
import {Branch} from '../entities/branch';

@Injectable({
  providedIn: 'root'
})
export class PorderService {

  constructor(private http: HttpClient) {
  }

  async getAll(pageRequest: PageRequest): Promise<PorderDataPage> {
    const url = pageRequest.getPageRequestURL('porders');
    const porderDataPage = await this.http.get<PorderDataPage>(ApiManager.getURL(url)).toPromise();
    porderDataPage.content = porderDataPage.content.map((porder) => Object.assign(new Porder(), porder));
    return porderDataPage;
  }

  async get(id: number): Promise<Porder> {
    const porder = await this.http.get<Porder>(ApiManager.getURL(`porders/${id}`)).toPromise();
    return Object.assign(new Porder(), porder);
  }

  async delete(id: number): Promise<void> {
    return this.http.delete<void>(ApiManager.getURL(`porders/${id}`)).toPromise();
  }

  async add(porder: Porder): Promise<ResourceLink> {
    return this.http.post<ResourceLink>(ApiManager.getURL(`porders`), porder).toPromise();
  }

  async update(id: number, porder: Porder): Promise<ResourceLink> {
    return this.http.put<ResourceLink>(ApiManager.getURL(`porders/${id}`), porder).toPromise();
  }
}
