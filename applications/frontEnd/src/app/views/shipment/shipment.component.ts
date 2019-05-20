import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

import { FormGroup, FormControl } from '@angular/forms';



@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.scss']
})
export class ShipmentComponent implements OnInit {



  constructor(
    private httpService: HttpService,
  ) { }

  ngOnInit() {
    this.instantiateForm()
    this.getSupplierId();
    this.getMaterialIds().then(() => {
      this.instantiateForm()
      this.dataLoaded = true
    });
    this.getShipments().then(() => { });
  }

  supplierId;
  dataLoaded = false;
  shipmentQuery = {
    "selector": {
      "class": {
        "$eq": "org.warehousenet.shipment"
      },
    }
  }
 /*  shipmentQuery = {
    "selector": {
      "class": {
        "$eq": "org.warehousenet.shipment"
      },
      "supplierId": {
        "$eq": ""
      }
    }
  } */

  getSupplierId() {
    let user = document.cookie.match(new RegExp('(^| )' + 'userName' + '=([^;]+)'))[2];
    this.supplierId = decodeURIComponent(user).split("@")[1];
    //this.shipmentQuery.selector.supplierId = this.supplierId;
    console.log(this.shipmentQuery)
  }

  getShipments() {
    return new Promise((resolve, reject) => {
      this.httpService.getAssetsByQuery(JSON.stringify(this.shipmentQuery)).subscribe((res) => {
        this.shipments= [];
        res.forEach(element => {
          if (element.Record.state == 1) {
            element.Record.state = "Sent"
          }
          if (element.Record.state == 2) {
            element.Record.state = "Received"
          }
          this.shipments.push(element.Record)
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

  shipments = [];
  materials = [];
  shipmentForm;
  sendShipmentForm;

  instantiateForm() {
    this.shipmentForm = new FormGroup({
      shipmentId: new FormControl(),
      materialId: new FormControl({ value: this.materials, disabled: false }),
      customerId: new FormControl({ value: "org1.example.com", disabled: false }),
      supplierId: new FormControl({ value: this.supplierId, disabled: false }),
      quantity: new FormControl(),
      note: new FormControl(),
    });

    this.sendShipmentForm = new FormGroup({
      shipmentId: new FormControl(),
      invoiceId: new FormControl(),
      invoiceData: new FormControl(),
      collection: new FormControl("invoiceCollection"),
      note: new FormControl()
    });
  }

  setSendModal(i) {
    this.sendShipmentForm = new FormGroup({
      shipmentId: new FormControl(this.shipments[i].shipmentId),
      invoiceId: new FormControl(),
      invoiceData: new FormControl(),
      collection: new FormControl("invoiceCollection"),
      note: new FormControl()
    });
  }

  submitCreateshipmentData() {
    this.shipmentForm.value.class = "org.warehousenet.shipment";
    this.httpService.createShipment(this.shipmentForm.value).subscribe( ()=>{
      this.getShipments().then(() => { });
    }, console.log);
  }

  submitSendShipmentData() {
    console.log(this.sendShipmentForm.value);
    this.httpService.sendShipment(this.sendShipmentForm.value).subscribe(()=>{
      this.getShipments().then(() => { });
    }, console.log);
  }

  onFileChange(event) {
    let reader = new FileReader();
    console.log(reader)
   
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        this.sendShipmentForm.patchValue({
          invoiceData: reader.result
        });
      };
    }
  }

}
