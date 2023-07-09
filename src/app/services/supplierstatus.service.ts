import { Injectable } from '@angular/core';
import {ApiManager} from '../shared/api-manager';
import {Supplierstatus} from '../entities/supplierstatus';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SupplierstatusService {

  constructor(private http: HttpClient) { }


  async getAll(): Promise<Supplierstatus[]>{
    const supplierstatuses: Supplierstatus[] = await this.http.get<Supplierstatus[]>(ApiManager.getURL('supplierstatuses')).toPromise();
    return supplierstatuses.map((supplierstatus) => Object.assign(new Supplierstatus(), supplierstatus) );
  }
}
