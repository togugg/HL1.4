import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.scss']
})
export class MonthlyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }



  // lineChart
  public lineChartData: Array<any> = [
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Stock' },
    { data: [28, 28, 28, 28, 28, 28, 28], label: 'Min Stock' },
    { data: [90, 90, 90, 90, 90, 90, 90], label: 'Max Stock' },
  ];
  public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: any = {
    animation: false,
    responsive: true
  };
  public lineChartColours: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.0)',
      borderColor: 'rgba(32,168,216,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      steppedLine: true
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.0)',
      borderColor: 'rgba(248,108,107,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)',
      steppedLine: true
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.0)',
      borderColor: 'rgba(255,193,7,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      steppedLine: true
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
