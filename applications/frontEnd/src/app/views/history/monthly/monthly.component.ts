import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service'
import { PdfMakerService } from '../../../services/pdf-maker.service'
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
    private pdfMakerService: PdfMakerService,
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
          this.getUserId();
          this.instantiateForm();
          this.getCollection();
          this.dataLoaded = true;
        })
      })
    });
  }

  public largeModal;
  collection;
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
  selectedMonth;
  stockId;
  materialId;
  supplierId;
  cardSelecter = "history";
  stockForm = new FormGroup({
    class: new FormControl(),
    materialId: new FormControl(),
    customerId: new FormControl(),
    supplierId: new FormControl(),
    quantity: new FormControl(),
    min: new FormControl(),
    max: new FormControl(),
    note: new FormControl(),
    monthlyForecast: new FormControl(),
  });

  statusForm = new FormGroup({
    stockId: new FormControl(),
    month: new FormControl(),
    reason: new FormControl(),
  });

  createCreditNoteForm = new FormGroup({
    stockId: new FormControl(),
    creditNoteId: new FormControl(this.collection),
    price: new FormControl(),
    collection: new FormControl(),
  });

  forecastDataForm = new FormGroup({
    month: new FormControl(),
    demand: new FormControl(),
    note: new FormControl()
  });

  adjustLimitsForm = new FormGroup({
    stockId: new FormControl(),
    min: new FormControl(),
    max: new FormControl()
  });

  withdrawStockForm = new FormGroup({
    stockId: new FormControl(),
    withdrawal: new FormControl()
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

  getCollection(){
    if(this.currentStock.customerId == "org1.example.com"){
      if (this.currentStock.supplierId == "org2.example.com"){
        this.collection = "Org1-Org2Collection"
      }
      else {this.collection = "Org1-Org3Collection"}
    }
    if(this.currentStock.customerId == "org2.example.com"){
      if (this.currentStock.supplierId == "org1.example.com"){
        this.collection = "Org1-Org2Collection"
      }
      else {this.collection = "Org2-Org3Collection"}
    }
    if(this.currentStock.customerId == "org3.example.com"){
      if (this.currentStock.supplierId == "org1.example.com"){
        this.collection = "Org1-Org3Collection"
      }
      else {this.collection = "Org2-Org3Collection"}
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
    this.httpService.getInvoice(this.modalData.invoiceId, this.collection).subscribe((res) => {
      console.log(res.invoiceData)
      window.open(res.invoiceData)
    })
  }

  userId;

  getUserId() {
    let user = document.cookie.match(new RegExp('(^| )' + 'userName' + '=([^;]+)'))[2];
    this.userId = decodeURIComponent(user).split("@")[1];
    //this.stockQuery.selector.supplierId = this.supplierId;
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
      customerId: this.userId,
      supplierId: this.currentStock.supplierId,
      min: this.currentStock.min,
      max: this.currentStock.max,
      quantity: this.currentStock.quantity,
      note: this.currentStock.note,
      monthlyForecast: this.forecasts
    })
    this.adjustLimitsForm.patchValue({
      stockId: this.stockId,
      min: this.currentStock.min,
      max: this.currentStock.max
    })
    this.withdrawStockForm.patchValue({
      stockId: this.stockId
    })
    this.createCreditNoteForm.patchValue({
      stockId: this.stockId,
      collection: this.collection
    })
  }

  submitAdjustStockData() {
    console.log(this.stockForm)
    this.httpService.updateStock(this.stockForm.value).subscribe(() => {
      this.dataLoaded = false;
      this.getStockHistory(this.stockId).then(() => {
        this.dataLoaded = true;
      });
      this.getStockShippings(this.materialId, this.supplierId).then()
    });
  }

  submitAdjustLimitsData() {
    this.httpService.adjustLimits(this.adjustLimitsForm.value).subscribe(() => {
      this.dataLoaded = false;
      this.getStockHistory(this.stockId).then(() => {
        this.dataLoaded = true;
      });
      this.getStockShippings(this.materialId, this.supplierId).then()
    });
  }

  submitWithdrawStockData() {
    this.httpService.withdrawStock(this.withdrawStockForm.value).subscribe(() => {
      this.dataLoaded = false;
      this.getStockHistory(this.stockId).then(() => {
        this.dataLoaded = true;
      });
      this.getStockShippings(this.materialId, this.supplierId).then()
    });
  }


  setForecastMonth(id) {
    this.selectedMonth = this.forecasts[id]
  }

  approveForecast() {
    this.statusForm.patchValue({
      stockId: this.stockId,
      month: this.selectedMonth.month
    })
    this.httpService.approveForecast(this.statusForm.value).subscribe((res) => {
      this.dataLoaded = false;
      this.getStockHistory(this.stockId).then(() => {
        this.dataLoaded = true;
      });
      this.getStockShippings(this.materialId, this.supplierId).then()
    })
  }

  declineForecast() {
    this.statusForm.patchValue({
      stockId: this.stockId,
      month: this.selectedMonth.month
    })
    this.httpService.declineForecast(this.statusForm.value).subscribe((res) => {
      this.dataLoaded = false;
      this.getStockHistory(this.stockId).then(() => {
        this.dataLoaded = true;
      });
      this.getStockShippings(this.materialId, this.supplierId).then()
    })
  }

  submitCreateCreditNoteData() {
    this.httpService.createCreditNote(this.createCreditNoteForm.value).subscribe(() => {
      this.dataLoaded = false;
      this.getStockHistory(this.stockId).then(() => {
        this.dataLoaded = true;
      });
      this.getStockShippings(this.materialId, this.supplierId).then()
    });
  }

  submitAddForecastData() {
    let data = {
      "stockId": this.stockId,
      "data": this.forecastDataForm.value
    }
    this.httpService.addForecast(data).subscribe((res) => {
      this.dataLoaded = false;
      this.getStockHistory(this.stockId).then(() => {
        this.dataLoaded = true;
      });
      this.getStockShippings(this.materialId, this.supplierId).then()
    })
  }


  createPdf(id){
    this.httpService.getCreditNote(this.currentStock.creditNoteHistory[id].creditNoteId, this.collection).subscribe((res) => {
      console.log(res)
      this.pdfMakerService.createPdf([[this.currentStock.materialId, res.creditNotePeriod.totalWithdrawal, res.price, +res.creditNotePeriod.totalWithdrawal* +res.price],res.creditNotePeriod.creditNoteId, res.creditNotePeriod.endDate])
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
