import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../shared/abstract-component';
import {ThemeManager} from '../../shared/views/theme-manager';
import {ChartDataSets} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {ReportService} from '../../services/report.service';
import {DashboardService} from '../../services/dashboard.service';
import {DashboardData} from '../../entities/dashboard-data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends AbstractComponent implements OnInit {
    yearWiseData: any[];
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

    get isDark(): boolean {
    return ThemeManager.isDark();
  }

  public lineChartData: ChartDataSets[] = [
    {data: [], label: 'Count'},
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        ticks: {fontColor: this.isDark ? 'white' : 'black'},
        gridLines: {color: this.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
      }],
      yAxes: [{
        ticks: {fontColor: this.isDark ? 'white' : 'black'},
        gridLines: {color: this.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
      }]
    }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'rgba(184,255,179,1)',
      backgroundColor: 'rgba(109,194,114,0.6)',
    },
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  displayedColumns: string[] = ['year', 'count'];

  constructor(
    private reportService: ReportService,
    private dashboardService: DashboardService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.yearWiseData = await this.reportService.getYearWiseCustomerCount(10);
    this.lineChartLabels = [];
    this.lineChartData[0].data = [];
    for (const yearData of this.yearWiseData) {
      this.lineChartLabels.unshift(yearData.year);
      this.lineChartData[0].data.unshift(yearData.count);
    }

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

