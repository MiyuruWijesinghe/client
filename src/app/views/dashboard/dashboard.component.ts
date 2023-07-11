import {Component, OnInit} from '@angular/core';
import {AbstractComponent} from '../../shared/abstract-component';
import {ThemeManager} from '../../shared/views/theme-manager';
import {DashboardService} from '../../services/dashboard.service';
import {DashboardData} from '../../entities/dashboard-data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends AbstractComponent implements OnInit {
  dashBoardData: DashboardData;
  salesCount = '0';
  customersCount = '0';
  employeesCount = '0';
  branchCount = '0';
  usersCount = '0';
  purchaseOrdersCount = '0';
  suppliersCount = '0';
  itemsCount = '0';
  complainsCount = '0';

  constructor(
    private dashboardService: DashboardService
  ) {
    super();
  }

  get isDark(): boolean {
    return ThemeManager.isDark();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.dashboardService.getDataCount().then(async (data) => {
      this.dashBoardData = data;
      this.salesCount = this.dashBoardData.salesCount.toString();
      this.customersCount = this.dashBoardData.customersCount.toString();
      this.employeesCount = this.dashBoardData.employeesCount.toString();
      this.branchCount = this.dashBoardData.branchCount.toString();
      this.usersCount = this.dashBoardData.usersCount.toString();
      this.purchaseOrdersCount = this.dashBoardData.purchaseOrdersCount.toString();
      this.suppliersCount = this.dashBoardData.suppliersCount.toString();
      this.itemsCount = this.dashBoardData.itemsCount.toString();
      this.complainsCount = this.dashBoardData.complainsCount.toString();
    }).catch((e) => {
      console.log(e);
    });
  }

  updatePrivileges(): any {
  }
}
