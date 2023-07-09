import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {User} from '../entities/user';
import {ClientToken} from '../entities/client-token';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private http: HttpClient) { }

  async checkConfiguration(): Promise<HttpResponse<any>>{
    return this.http.head<HttpResponse<any>>(ApiManager.getURL('configuration')).toPromise();
  }

  async config(user: User): Promise<ClientToken>{
    return this.http.post<ClientToken>(ApiManager.getURL(`configuration`), user).toPromise();
  }

}
