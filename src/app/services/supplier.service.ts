import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageRequest} from '../shared/page-request';
import {SupplierDataPage} from '../entities/supplier-data-page';
import {ApiManager} from '../shared/api-manager';
import {Supplier} from '../entities/supplier';
import {ResourceLink} from '../entities/resource-link';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private http: HttpClient) {}

  async getAll(pageRequest: PageRequest): Promise<SupplierDataPage>{
    const url = pageRequest.getPageRequestURL('suppliers');
    const supplierDataPage = await this.http.get<SupplierDataPage>(ApiManager.getURL(url)).toPromise();
    supplierDataPage.content = supplierDataPage.content.map((supplier) => Object.assign(new Supplier(), supplier));
    return supplierDataPage;
  }

  async get(id: number): Promise<Supplier>{
    const supplier = await this.http.get<Supplier>(ApiManager.getURL(`suppliers/${id}`)).toPromise();
    return Object.assign(new Supplier(), supplier);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`suppliers/${id}`)).toPromise();
  }

  async add(supplier: Supplier): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`suppliers`), supplier).toPromise();
  }

  async update(id: number, supplier: Supplier): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`suppliers/${id}`), supplier).toPromise();
  }
}
