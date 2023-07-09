import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {FormControl, FormGroup} from '@angular/forms';
import {ReportService} from '../../../../services/report.service';
import {ReportHelper} from '../../../../shared/report-helper';
import {Color, Label} from 'ng2-charts';
import {ChartDataSets} from 'chart.js';

@Component({
  selector: 'app-month-wise-sale',
  templateUrl: './month-wise-sale.component.html',
  styleUrls: ['./month-wise-sale.component.scss']
})
export class MonthWiseSaleComponent extends AbstractComponent implements OnInit {

  years = [2021, 2020, 2019, 2018, 2017, 2016, 2015];
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

  displayedColumns: string[] = ['month', 'amount'];

  constructor(private reportService: ReportService) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any>{
    this.yearWiseData = await this.reportService.getMonthWiseSale(this.yearField.value);

    this.lineChartLabels = [];
    this.yearWiseData[0].data = [];
    this.lineChartData[0].data = [];
    for (const yearData of this.yearWiseData){
      this.lineChartLabels.unshift(yearData.month);
      this.lineChartData[0].data.unshift(yearData.amount);

    }
  }

  updatePrivileges(): any {
  }

  print(): void{
    ReportHelper.print('yearWiseSaleReport');
  }

}
