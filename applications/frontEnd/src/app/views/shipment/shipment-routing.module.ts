import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { ShipmentComponent } from './shipment.component';
import { CreateShipmentComponent } from './create-shipment/create-shipment.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Shipment'
    },
    children: [
      {
        path: '',
        redirectTo: 'overview'
      },
      {
        path: 'overview',
        component: ShipmentComponent,
        data: {
          title: 'Overview'
        }
      },
      {
        path: 'create-shipment',
        component: CreateShipmentComponent,
        data: {
          title: 'Create Shipment'
        }
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentRoutingModule { }
