import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Nametitle} from '../entities/nametitle';

@Injectable({
  providedIn: 'root'
})
export class NametitleService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Nametitle[]>{
    const nametitles: Nametitle[] = await  this.http.get<Nametitle[]>(ApiManager.getURL('nametitles')).toPromise();
    return nametitles.map((nametitle) => Object.assign(new Nametitle(), nametitle));
  }
}
