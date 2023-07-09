import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Itemtype} from '../entities/itemtype';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class ItemtypeService {
  constructor(private http: HttpClient) { }

  async getAll(): Promise<Itemtype[]>{
    const itemtypes: Itemtype[] = await this.http.get<Itemtype[]>(ApiManager.getURL('itemtypes')).toPromise();
    return itemtypes.map((itemtype) => Object.assign(new Itemtype(), itemtype) );
  }
}
