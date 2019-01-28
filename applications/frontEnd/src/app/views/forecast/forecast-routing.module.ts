import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YearlyComponent } from './yearly/yearly.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Forecast'
    },
    children: [
      {
        path: '',
        redirectTo: 'yearly'
      },
      {
        path: 'yearly',
        component: YearlyComponent,
        data: {
          title: 'Yearly'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForecastRoutingModule {}
