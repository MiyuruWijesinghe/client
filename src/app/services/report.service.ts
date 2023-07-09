import { Injectable } from '@angular/core';
import {ApiManager} from '../shared/api-manager';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
 constructor(private http: HttpClient){}

  async getYearWiseCustomerCount(count: number): Promise<any> {
    const url = ApiManager.getURL('reports/year-wise-customer-count/' + count);
    return await this.http.get<any>(url).toPromise();
  }
  async getMonthWiseSale(count: number): Promise<any> {
    const url = ApiManager.getURL('reports/month-wise-sale/' + count);
    return await this.http.get<any>(url).toPromise();
  }
  async getYearWiseSaleCount(count: number): Promise<any> {
    const url = ApiManager.getURL('reports/year-wise-sale-count/' + count);
    return await this.http.get<any>(url).toPromise();
  }
  async getYearWiseSale(count: number): Promise<any> {
    const url = ApiManager.getURL('reports/year-wise-sale/' + count);
    return await this.http.get<any>(url).toPromise();
  }
  async getYearWisePurchase(count: number): Promise<any> {
    const url = ApiManager.getURL('reports/year-wise-purchase/' + count);
    return await this.http.get<any>(url).toPromise();
  }
  async getYearWiseIncome(count: number): Promise<any> {
    const url = ApiManager.getURL('reports/year-wise-income/' + count);
    return await this.http.get<any>(url).toPromise();
  }
  async getDayWiseSale(count: number): Promise<any> {
    const url = ApiManager.getURL('reports/day-wise-sale/2021/' + count );
    return await this.http.get<any>(url).toPromise();
  }
 }
