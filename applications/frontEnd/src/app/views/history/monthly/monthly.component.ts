import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service'
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.scss']
})
export class MonthlyComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.stockId = params['id']; // (+) converts string 'id' to a number
      this.materialId = this.stockId.split(':')[0];
      this.supplierId = this.stockId.split(':')[1];
      this.getStockHistory(this.stockId).then(() => {
        this.getStockShippings(this.materialId, this.supplierId).then(() => {
          this.instantiateForm();
          this.dataLoaded = true;
        })
      })
    });
  }

  public largeModal;
  data: Array<any>;
  lineChartLabels = [];
  lineChartData: Array<any> = [
    { data: [], label: 'Stock' },
    { data: [], label: 'Min Stock' },
    { data: [], label: 'Max Stock' },
  ]
  dataLoaded = false;
  currentStock;
  shippings = [];
  forecasts = [];
  modalData;
  stockId;
  materialId;
  supplierId;
  cardSelecter = "history";
  stockForm = new FormGroup({
    class: new FormControl(),
    materialId: new FormControl(),
    supplierId: new FormControl(),
    quantity: new FormControl(),
    min: new FormControl(),
    max: new FormControl(),
    note: new FormControl(),
    monthlyForecast: new FormControl(),
  });

  changeCard(card) {
    this.cardSelecter = card;
  }

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
    this.shippings = [];
    this.shippingQuery.selector.materialId = materialId;
    this.shippingQuery.selector.supplierId = supplierId;
    return new Promise((resolve, reject) => {
      this.httpService.getAssetsByQuery(JSON.stringify(this.shippingQuery)).subscribe((res) => {
        res.forEach(element => {
          if (element.Record.state != 2) {
            this.shippings.push(element.Record)
          }
        });
        resolve(res)
      })
    })
  }

  getStockHistory(id) {
    return new Promise((resolve, reject) => {
      this.httpService.getStockHistory(id).subscribe((res) => {
        try {
          this.data = res;
          this.lineChartData = [
            { data: [], label: 'Stock' },
            { data: [], label: 'Min Stock' },
            { data: [], label: 'Max Stock' },
          ];
          this.lineChartLabels = [];
          this.currentStock = res[res.length - 1].Value;
          this.forecasts = this.currentStock.monthlyForecast;
          console.log(this.forecasts)
          console.log(this.currentStock)
          res.forEach(element => {
            var dt = new Date(element.Timestamp.seconds.low * 1000);
            this.lineChartLabels.push(dt.getDate());
            this.lineChartData[0].data.push(element.Value.quantity);
            this.lineChartData[1].data.push(element.Value.min);
            this.lineChartData[2].data.push(element.Value.max);
          });
          resolve(true);
        }
        catch (err) {
          this.router.navigate(['/history'])
        }
      });
    })
  }

  setModalData(i) {
    this.modalData = this.shippings[i];
    console.log(this.modalData)
  }

  downloadInvoice() {
    this.httpService.getInvoice(this.modalData.invoiceId).subscribe((res) => {
      console.log(res.invoiceData)
      window.open(res.invoiceData)
    })
  }

  receiveShipping() {
    let data = {
      "shippingId": this.modalData.shippingId
    }
    this.httpService.receiveShipping(data).subscribe(res => {
      this.dataLoaded = false;
      this.getStockHistory(this.stockId).then(() => {
        this.dataLoaded = true;
      });
      this.getStockShippings(this.materialId, this.supplierId).then()
    })
  }

  instantiateForm() {
    this.stockForm.patchValue({
      class: this.currentStock.class,
      materialId: this.currentStock.materialId,
      supplierId: this.currentStock.supplierId,
      min: this.currentStock.min,
      max: this.currentStock.max,
      quantity: this.currentStock.quantity,
      note: this.currentStock.note,
      monthlyForecast: this.forecasts
    });
  }

  submitAdjustStockData() {
    console.log(this.stockForm)
    this.httpService.updateStock(this.stockForm.value).subscribe(() => {
      this.dataLoaded = false;
      this.getStockHistory(this.stockId).then(() => {
        this.dataLoaded = true;
      });
      this.getStockShippings(this.materialId, this.supplierId).then()
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
