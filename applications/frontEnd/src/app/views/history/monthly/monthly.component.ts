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
      let materialId = id.split(':')[0];
      let supplierId = id.split(':')[1];
      this.getStockHistory(id).then(() => {
        this.getStockShippings(materialId, supplierId).then(() => {
          this.dataLoaded = true;
        })

      })
    });

  }

  data: Array<any>;
  lineChartLabels = [];
  lineChartData: Array<any> = [
    { data: [], label: 'Stock' },
    { data: [], label: 'Min Stock' },
    { data: [], label: 'Max Stock' },
  ]
  dataLoaded = false;
  currentStock;
  shippings = []

  shippingQuery = {
    "selector": {
      "class": {
        "$eq": "org.warehousenet.shipping"
      },
      "supplierId": {
        "$eq": ""
      },
      "materialId": {
        "$eq": ""
      }
    }
  }

  getStockShippings(materialId, supplierId) {
    this.shippingQuery.selector.materialId = materialId;
    this.shippingQuery.selector.supplierId = supplierId;
    return new Promise((resolve, reject) => {
      this.httpService.getAssetsByQuery(JSON.stringify(this.shippingQuery)).subscribe((res) => {
        res.forEach(element => {
          this.shippings.push(element.Record)
        });
        resolve(res)
      })
    })
  }

  getStockHistory(id) {
    return new Promise((resolve, reject) => {
      this.httpService.getStockHistory(id).subscribe((res) => {
        this.data = res;
        console.log(res);
        this.currentStock = res[res.length -1].Value;
        res.forEach(element => {
          var dt = new Date(element.Timestamp.seconds.low * 1000);
          this.lineChartLabels.push(dt.getDate());
          this.lineChartData[0].data.push(element.Value.quantity);
          this.lineChartData[1].data.push(element.Value.min);
          this.lineChartData[2].data.push(element.Value.max);
        });
        resolve(true)
      });
    })
  }

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
