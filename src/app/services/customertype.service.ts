import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Customertype} from '../entities/customertype';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class CustomertypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Customertype[]>{
    const customertypes: Customertype[] = await this.http.get<Customertype[]>(ApiManager.getURL('customertypes')).toPromise();
    return customertypes.map((customertype) => Object.assign(new Customertype(), customertype) );
  }
}
