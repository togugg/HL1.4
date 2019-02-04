import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonthlyComponent } from './monthly/monthly.component';
import { HistoryComponent } from './history.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'History'
    },
    children: [
      {
        path: '',
        redirectTo: 'overview'
      },
      {
        path: 'overview',
        component: HistoryComponent,
        data: {
          title: 'Overview'
        }
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
