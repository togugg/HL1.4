import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.scss']
})
export class MonthlyComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      let id = params['id']; // (+) converts string 'id' to a number
      this.httpService.getStockHistory(id).subscribe((res) => {
        this.data = res;
        console.log(res)
        res.forEach(element => {
          var dt = new Date(element.Timestamp.seconds.low * 1000);
          this.lineChartLabels.push(dt);
          this.lineChartData[0].data.push(element.Value.quantity);
          this.lineChartData[1].data.push(element.Value.min);
          this.lineChartData[2].data.push(element.Value.max);
        });
        console.log(this.lineChartLabels)
      });
    });
  }

  data: Array<any>;
  public lineChartLabels = [];
  public lineChartData: Array<any> = [
    { data: [], label: 'Stock' },
    { data: [], label: 'Min Stock' },
    { data: [], label: 'Max Stock' },
  ]

  shippings = [{
    "shippingId": "23123123",
    "materialId": "3255234234",
    "supplierId": "97234223",
    "customerId": "923023",
    "quantity": "250",
    "sentDate": "2019-01-08",
    "receivedDate": "",
    "status": "Sent"
  }, {
    "shippingId": "23123123",
    "materialId": "3255234234",
    "supplierId": "97234223",
    "customerId": "923023",
    "quantity": "250",
    "sentDate": "",
    "receivedDate": "",
    "status": "Not Sent"
  },
  {
    "shippingId": "23123123",
    "materialId": "3255234234",
    "supplierId": "97234223",
    "customerId": "923023",
    "quantity": "250",
    "sentDate": "",
    "receivedDate": "",
    "status": "Not Sent"
  },
  {
    "shippingId": "23123123",
    "materialId": "3255234234",
    "supplierId": "97234223",
    "customerId": "923023",
    "quantity": "250",
    "sentDate": "",
    "receivedDate": "",
    "status": "Not Sent"
  }]



    // lineChart
    
    /* public lineChartData: Array<any> = [
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Stock' },
      { data: [22, 28, 28, 28, 28, 28, 28], label: 'Min Stock' },
      { data: [90, 90, 90, 90, 90, 90, 90], label: 'Max Stock' },
    ];/* 
    public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July']; */
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
