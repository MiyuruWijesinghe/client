import { Component, OnInit } from '@angular/core';
import {ChartDataSets} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {FormControl, FormGroup} from '@angular/forms';
import {ReportService} from '../../../../services/report.service';
import {ReportHelper} from '../../../../shared/report-helper';
import {AbstractComponent} from '../../../../shared/abstract-component';

@Component({
  selector: 'app-day-wise-sale',
  templateUrl: './day-wise-sale.component.html',
  styleUrls: ['./day-wise-sale.component.scss']
})
export class DayWiseSaleComponent extends AbstractComponent implements OnInit {

  years = [2021, 2020, 2019, 2018, 2017, 2016, 2015];
  months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];

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
    year: new FormControl(2021),
    month: new FormControl(1),
  });

  get yearField(): FormControl{
    return this.form.controls.year as FormControl;
  }
  get monthField(): FormControl{
    return this.form.controls.month as FormControl;
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

  displayedColumns: string[] = ['day', 'amount'];

  constructor(private reportService: ReportService) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any>{
    this.yearWiseData = await this.reportService.getDayWiseSale(this.monthField.value);

    this.lineChartLabels = [];
    this.yearWiseData[0].data = [];
    this.lineChartData[0].data = [];
    for (const yearData of this.yearWiseData){
      this.lineChartLabels.unshift(yearData.day);
      this.lineChartData[0].data.unshift(yearData.amount);

    }
  }

  updatePrivileges(): any {
  }

  print(): void{
    ReportHelper.print('yearWiseSaleReport');
  }

}
