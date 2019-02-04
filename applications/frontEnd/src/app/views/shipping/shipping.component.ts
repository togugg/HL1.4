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
    this.instantiateForm()
/*     this.getSupplierId();
    this.getMaterialIds().then(() => {
      this.instantiateForm()
      this.dataLoaded = true
    });
    this.getShippings().then(() => { }); */
  }

  supplierId;
  dataLoaded = false;
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

  getShippings() {
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

  getMaterialIds() {
    return new Promise((resolve, reject) => {
      this.httpService.getMaterialIds(this.supplierId).subscribe((res) => {
        this.materials = res;
        console.log(this.materials)
        console.log(this.supplierId)
        resolve(res)
      })
    })
  }

  shippings = [];
  materials = [];
  shippingForm;
  sendForm;

  instantiateForm() {
    this.shippingForm = new FormGroup({
      shippingId: new FormControl(),
      materialId: new FormControl({ value: this.materials, disabled: false }),
      supplierId: new FormControl({ value: this.supplierId, disabled: false }),
      quantity: new FormControl(),
      note: new FormControl(),
    });

    this.sendForm = new FormGroup({
      shippingId: new FormControl(),
      invoiceId: new FormControl(),
      invoiceData: new FormControl(),
      collection: new FormControl("invoiceCollection"),
      note: new FormControl()
    });
  }

  setSendModal(i) {
    this.sendForm = new FormGroup({
      shippingId: new FormControl(),
      invoiceId: new FormControl(),
      invoiceData: new FormControl(),
      collection: new FormControl("invoiceCollection"),
      note: new FormControl()
    });
  }

  submitShippingData() {
    this.shippingForm.value.class = "org.warehousenet.shipping"
    this.httpService.createShipping(this.shippingForm.value).subscribe(console.log, console.log)
  }

}
