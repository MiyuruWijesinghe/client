import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageRequest} from '../shared/page-request';
import {PurchaseDataPage} from '../entities/purchase-data-page';
import {ApiManager} from '../shared/api-manager';
import {Purchase} from '../entities/purchase';
import {ResourceLink} from '../entities/resource-link';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http: HttpClient) {
  }

  async getAll(pageRequest: PageRequest): Promise<PurchaseDataPage> {
    const url = pageRequest.getPageRequestURL('purchases');
    const purchaseDataPage = await this.http.get<PurchaseDataPage>(ApiManager.getURL(url)).toPromise();
    purchaseDataPage.content = purchaseDataPage.content.map((purchase) => Object.assign(new Purchase(), purchase));
    return purchaseDataPage;
  }

  async get(id: number): Promise<Purchase> {
    const purchase = await this.http.get<Purchase>(ApiManager.getURL(`purchases/${id}`)).toPromise();
    return Object.assign(new Purchase(), purchase);
  }

  async delete(id: number): Promise<void> {
    return this.http.delete<void>(ApiManager.getURL(`purchases/${id}`)).toPromise();
  }

  async add(purchase: Purchase): Promise<ResourceLink> {
    return this.http.post<ResourceLink>(ApiManager.getURL(`purchases`), purchase).toPromise();
  }

  async update(id: number, purchase: Purchase): Promise<ResourceLink> {
    return this.http.put<ResourceLink>(ApiManager.getURL(`purchases/${id}`), purchase).toPromise();
  }
}
