import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatTableModule} from '@angular/material/table'; 

import { ShippingComponent } from './shipping.component'
import { ShippingRoutingModule } from './shipping-routing.module';
import { CreateShippingComponent } from './create-shipping/create-shipping.component'

@NgModule({
  declarations: [ShippingComponent, CreateShippingComponent],
  imports: [
    CommonModule,
    ShippingRoutingModule,
    MatTableModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ShippingComponent
  ]
})
export class ShippingModule { }