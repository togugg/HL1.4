import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { ShippingComponent } from './shipping.component';
import { CreateShippingComponent } from './create-shipping/create-shipping.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Shipping'
    },
    children: [
      {
        path: '',
        redirectTo: 'overview'
      },
      {
        path: 'overview',
        component: ShippingComponent,
        data: {
          title: 'Overview'
        }
      },
      {
        path: 'create-shipping',
        component: CreateShippingComponent,
        data: {
          title: 'Create Shipping'
        }
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingRoutingModule { }
