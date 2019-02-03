import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

import { FormGroup, FormControl } from '@angular/forms';



@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {



  constructor(
    private httpService: HttpService,
  ) { }

  ngOnInit() {
    this.getSupplierId()
    this.instantiateForm()
    this.getStockShippings().then(() => { })
  }

  supplierId;
  shippingQuery = {
    "selector": {
      "class": {
        "$eq": "org.warehousenet.shipping"
      },
      "supplierId": {
        "$eq": ""
      }
    }
  }

  getSupplierId() {
    let user = document.cookie.match(new RegExp('(^| )' + 'userName' + '=([^;]+)'))[2];
    this.supplierId = decodeURIComponent(user).split("@")[1];
    this.shippingQuery.selector.supplierId = this.supplierId;
    console.log(this.shippingQuery)
  }

  getStockShippings() {
    return new Promise((resolve, reject) => {
      this.httpService.getAssetsByQuery(JSON.stringify(this.shippingQuery)).subscribe((res) => {
        res.forEach(element => {
          if (element.Record.state == 1) {
            element.Record.state = "Sent"
          }
          if (element.Record.state == 2) {
            element.Record.state = "Received"
          }
          this.shippings.push(element.Record)
        });
        resolve(res)
      })
    })
  }

  shippings = [];
  shippingForm;

  instantiateForm() {
    this.shippingForm = new FormGroup({
      shippingId: new FormControl(),
      materialId: new FormControl(),
      supplierId: new FormControl({ value: this.supplierId, disabled: false }),
      quantity: new FormControl(),
      note: new FormControl(),
    });
  }

  submitData() {
    console.log(this.shippingForm.value)
  }

}
