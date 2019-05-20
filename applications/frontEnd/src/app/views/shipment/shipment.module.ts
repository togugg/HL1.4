import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatTableModule} from '@angular/material/table'; 

import { ShipmentComponent } from './shipment.component'
import { ShipmentRoutingModule } from './shipment-routing.module';
import { CreateShipmentComponent } from './create-shipment/create-shipment.component'

@NgModule({
  declarations: [ShipmentComponent, CreateShipmentComponent],
  imports: [
    CommonModule,
    ShipmentRoutingModule,
    MatTableModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ShipmentComponent
  ]
})
export class ShipmentModule { }