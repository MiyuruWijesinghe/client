import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageRequest} from '../shared/page-request';
import {InventoryDataPage} from '../entities/inventory-data-page';
import {ApiManager} from '../shared/api-manager';
import {Inventory} from '../entities/inventory';
import {ResourceLink} from '../entities/resource-link';


@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) {
  }

  async getAll(pageRequest: PageRequest): Promise<InventoryDataPage> {
    const url = pageRequest.getPageRequestURL('inventories');
    const inventoryDataPage = await this.http.get<InventoryDataPage>(ApiManager.getURL(url)).toPromise();
    inventoryDataPage.content = inventoryDataPage.content.map((inventory) => Object.assign(new Inventory(), inventory));
    return inventoryDataPage;
  }

  async get(id: number): Promise<Inventory> {
    const inventory = await this.http.get<Inventory>(ApiManager.getURL(`inventories/${id}`)).toPromise();
    return Object.assign(new Inventory(), inventory);
  }

  async delete(id: number): Promise<void> {
    return this.http.delete<void>(ApiManager.getURL(`inventories/${id}`)).toPromise();
  }

  async add(inventory: Inventory): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`inventories`), inventory).toPromise();
  }

  async update(id: number, inventory: Inventory): Promise<ResourceLink> {
    return this.http.put<ResourceLink>(ApiManager.getURL(`inventories/${id}`), inventory).toPromise();
  }
}
