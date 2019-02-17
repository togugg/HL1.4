import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';

import { MatSort, MatTableDataSource } from '@angular/material';

import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {



  constructor(
    private httpService: HttpService,
    private router: Router
  ) { }

  ngOnInit() {
    this.instantiateForm()
    this.getUserId();
    this.instantiateForm()
    this.getStocks().then(() => {
    this.dataLoaded = true;
    });
  }

  userId;
  dataLoaded = false;
  stockQuery = {
    "selector": {
      "class": {
        "$eq": "org.warehousenet.stock"
      },
    }
  }
  /* stockQuery = {
    "selector": {
      "class": {
        "$eq": "org.warehousenet.stock"
      },
      "supplierId": {
        "$eq": ""
      }
    }
  } */

  displayedColumns: string[] = ['status', 'materialId', 'customerId', 'supplierId', 'quantity', 'min', 'max', 'note'];
  dataSource;

  getUserId() {
    let user = document.cookie.match(new RegExp('(^| )' + 'userName' + '=([^;]+)'))[2];
    this.userId = decodeURIComponent(user).split("@")[1];
    //this.stockQuery.selector.supplierId = this.supplierId;
  }

  @ViewChild(MatSort) sort: MatSort;

  getStocks() {
    this.stocks = [];
    return new Promise((resolve, reject) => {
      this.httpService.getAssetsByQuery(JSON.stringify(this.stockQuery)).subscribe((res) => {
        res.forEach(element => {
          if (element.Record.quantity < element.Record.min) element.Record.status = "red";
          if (element.Record.quantity >= element.Record.min && element.Record.quantity <= element.Record.max) element.Record.status = "green";
          if (element.Record.quantity > element.Record.max) element.Record.status = "yellow";
          this.stocks.push(element.Record);
        });
        this.dataSource = new MatTableDataSource(this.stocks)
        this.dataSource.sort = this.sort;
        resolve(res);
      })
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  stocks = [];
  materials = [];
  stockForm;

  instantiateForm() {
    this.stockForm = new FormGroup({
      materialId: new FormControl(),
      customerId: new FormControl({ value: this.userId, disabled: false }),
      supplierId: new FormControl(),
      quantity: new FormControl(),
      min: new FormControl(),
      max: new FormControl(),
      note: new FormControl()
    });
  }


  submitCreateStockData() {

    this.stockForm.value.class = "org.warehousenet.stock";
    this.httpService.createStock(this.stockForm.value).subscribe(() => {
      this.dataLoaded = false;
      this.getStocks().then(() => { this.dataLoaded = true });
    }, console.log);
  }

  routingToStock(stock) {
    //let routingId = this.stocks[id].materialId + ":" + this.stocks[id].supplierId;
    this.router.navigate(["/history/monthly/" + stock.key]);

  }



}
