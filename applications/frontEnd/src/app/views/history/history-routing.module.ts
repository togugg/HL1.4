import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonthlyComponent } from './monthly/monthly.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'History'
    },
    children: [
      {
        path: '',
        redirectTo: 'monthly'
      },
      {
        path: 'monthly/:id',
        component: MonthlyComponent,
        data: {
          title: 'Monthly'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule {}
