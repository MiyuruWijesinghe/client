import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class InventorycustomertypeService {
  constructor(private http: HttpClient) { }

  async delete(id: number): Promise<void> {
    return this.http.delete<void>(ApiManager.getURL(`inventorycustomertypes/${id}`)).toPromise();
  }

}
