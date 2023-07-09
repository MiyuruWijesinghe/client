import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Gender} from '../entities/gender';

@Injectable({
  providedIn: 'root'
})
export class GenderService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Gender[]>{
   const genders: Gender[] =  await this.http.get<Gender[]>(ApiManager.getURL('genders')).toPromise();

   return genders.map((gender) => Object.assign(new Gender(), gender));
  }
}
