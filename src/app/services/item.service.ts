import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageRequest} from '../shared/page-request';
import {ItemDataPage} from '../entities/item-data-page';
import {ApiManager} from '../shared/api-manager';
import {Item} from '../entities/item';
import {ResourceLink} from '../entities/resource-link';


@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) {}

  async getAll(pageRequest: PageRequest): Promise<ItemDataPage> {
    const url = pageRequest.getPageRequestURL('items');
    const itemDataPage = await this.http.get<ItemDataPage>(ApiManager.getURL(url)).toPromise();
    itemDataPage.content = itemDataPage.content.map((item) => Object.assign(new Item(), item));
    return itemDataPage;
  }

  async get(id: number): Promise<Item>{
    const item = await this.http.get<Item>(ApiManager.getURL(`items/${id}`)).toPromise();
    return Object.assign(new Item(), item);
  }

  async getBasic(pageRequest: PageRequest): Promise<ItemDataPage> {
    const url = pageRequest.getPageRequestURL('items/basic');
    const itemDataPage = await this.http.get<ItemDataPage>(ApiManager.getURL(url)).toPromise();
    itemDataPage.content = itemDataPage.content.map((item) => Object.assign(new Item(), item));
    return itemDataPage;
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`items/${id}`)).toPromise();
  }

  async add(item: Item): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`items`), item).toPromise();
  }

  async update(id: number, item: Item): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`items/${id}`), item).toPromise();
  }
}
