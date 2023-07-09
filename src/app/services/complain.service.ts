import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageRequest} from '../shared/page-request';
import {ComplainDataPage} from '../entities/complain-data-page';
import {ApiManager} from '../shared/api-manager';
import {Complain} from '../entities/complain';
import {ResourceLink} from '../entities/resource-link';

@Injectable({
  providedIn: 'root'
})
export class ComplainService {
  constructor(private http: HttpClient) {}

  async getAll(pageRequest: PageRequest): Promise<ComplainDataPage>{
    const url = pageRequest.getPageRequestURL('complains');
    const complainDataPage = await this.http.get<ComplainDataPage>(ApiManager.getURL(url)).toPromise();

    complainDataPage.content = complainDataPage.content.map((complain) => Object.assign(new Complain(), complain));

    return complainDataPage;
  }

  async get(id: number): Promise<Complain>{
    const complain = await this.http.get<Complain>(ApiManager.getURL(`complains/${id}`)).toPromise();
    return Object.assign(new Complain(), complain);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`complains/${id}`)).toPromise();
  }

  async add(complain: Complain): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`complains`), complain).toPromise();
  }

  async update(id: number, complain: Complain): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`complains/${id}`), complain).toPromise();
  }
}
