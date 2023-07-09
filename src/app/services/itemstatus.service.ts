import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Itemstatus} from '../entities/itemstatus';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class ItemstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Itemstatus[]>{
    const itemstatuses: Itemstatus[] = await this.http.get<Itemstatus[]>(ApiManager.getURL('itemstatuses')).toPromise();
    return itemstatuses.map((itemstatus) => Object.assign(new Itemstatus(), itemstatus) );
  }}
