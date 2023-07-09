import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../shared/abstract-component';
import {ThemeManager} from '../../../shared/views/theme-manager';
import {ChartDataSets} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {ReportService} from '../../../services/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends AbstractComponent implements OnInit {
  yearWiseData: any[];

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

  constructor(private reportService: ReportService) {

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
  }


  updatePrivileges(): any {
  }


}

