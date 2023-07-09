import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Supplierstatus} from '../entities/supplierstatus';
import {ApiManager} from '../shared/api-manager';
import {Itemcategory} from '../entities/itemcategory';

@Injectable({
  providedIn: 'root'
})
export class ItemcategoryService {


  constructor(private http: HttpClient) { }


  async getAll(): Promise<Itemcategory[]>{
    const itemcategories: Itemcategory[] = await this.http.get<Itemcategory[]>(ApiManager.getURL('itemcategories')).toPromise();
    return itemcategories.map((itemcategory) => Object.assign(new Supplierstatus(), itemcategory) );
  }}
