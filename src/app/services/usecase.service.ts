import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageRequest} from '../shared/page-request';
import {ApiManager} from '../shared/api-manager';
import {Usecase} from '../entities/usecase';

@Injectable({
  providedIn: 'root'
})
export class UsecaseService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Usecase[]>{
    const usecases: Usecase [] = await this.http.get<Usecase[]>(ApiManager.getURL('usecases')).toPromise();
    return usecases.map((usecase) => Object.assign(new Usecase(), usecase));
  }
}
