import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Porderstatus} from '../entities/porderstatus';
import {ApiManager} from '../shared/api-manager';
import {Suppliertype} from '../entities/suppliertype';

@Injectable({
  providedIn: 'root'
})
export class PorderstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Porderstatus[]>{
    const porderstatuses: Porderstatus[] = await this.http.get<Porderstatus[]>(ApiManager.getURL('porderstatuses')).toPromise();
    return porderstatuses.map((porderstatus) => Object.assign(new Suppliertype(), porderstatus) );
  }
}
