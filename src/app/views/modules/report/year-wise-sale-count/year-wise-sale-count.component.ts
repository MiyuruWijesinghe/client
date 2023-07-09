import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {ThemeManager} from '../../../../shared/views/theme-manager';
import {ChartDataSets} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {ReportService} from '../../../../services/report.service';
import {ReportHelper} from '../../../../shared/report-helper';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-year-wise-sale-count',
  templateUrl: './year-wise-sale-count.component.html',
  styleUrls: ['./year-wise-sale-count.component.scss']
})
export class YearWiseSaleCountComponent extends AbstractComponent implements OnInit {


  years = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
  yearWiseData: any[];
  public lineChartData: ChartDataSets[] = [
    { data: [this.yearWiseData] },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  form = new FormGroup({
    year: new FormControl(10),
  });

  get yearField(): FormControl{
    return this.form.controls.year as FormControl;
  }

  public lineChartColors: Color[] = [
    {
      borderColor: 'rgba(184,255,179,1)',
      backgroundColor: 'rgba(109,194,114,0.6)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'bar';
  public lineChartPlugins = [];

  displayedColumns: string[] = ['year', 'count'];

  constructor(private reportService: ReportService) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any>{
    this.yearWiseData = await this.reportService.getYearWiseSaleCount(this.yearField.value);

    this.lineChartLabels = [];
    this.yearWiseData[0].data = [];
    this.lineChartData[0].data = [];
    for (const yearData of this.yearWiseData){
      this.lineChartLabels.unshift(yearData.year);
      this.lineChartData[0].data.unshift(yearData.count);

    }
  }

  updatePrivileges(): any {
  }

  print(): void{
    ReportHelper.print('yearWiseSaleCountReport');
  }



}
