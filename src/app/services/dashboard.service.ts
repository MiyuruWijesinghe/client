import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {DashboardData} from '../entities/dashboard-data';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  async getDataCount(): Promise<DashboardData>{
    const dashboardData: DashboardData = await this.http.get<DashboardData>(ApiManager.getURL('dashboard/data-count')).toPromise();
    return Object.assign(new DashboardData(), dashboardData);
  }

}
