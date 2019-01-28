import { Component, OnInit } from '@angular/core';




@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {



  constructor(
  ) { }

  ngOnInit() {
  }


  shippings = [{
    "shippingId": "23123123",
    "materialId": "3255234234",
    "supplierId": "97234223",
    "customerId": "923023",
    "quantity": "250",
    "sentDate": "",
    "receivedDate": "",
    "status": "Not Sent"
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
  }]

}
